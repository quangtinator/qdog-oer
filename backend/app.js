const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const constants = require('./utils/constants');
const utils = require('./utils/utils');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt_decode = require('jwt-decode');
const UserModel = require('./models/user');
const HighScoreModel = require('./models/high_score');
const {mongo_db_base_url} = require('./api');
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const fs = require('fs');
const email = require('./utils/email_address');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { type } = require('os');

const app = express();
require("dotenv").config();

const memoryStore = new session.MemoryStore();

app.use(cors());
app.use(bodyParser.json({limit: '200mb'}));
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true, limit: '200mb'}));
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

const keycloak = require('./utils/keycloak-config').initKeycloak(memoryStore);

app.use(keycloak.middleware());

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send('Server is on no api/v1');
});

app.post('/api/v1/check-compatible', keycloak.checkSso(), (req, res) => {
    const {type} = req.body;
    const bearer_token = req.headers.authorization;
    const token = bearer_token.split(' ')[1];
    const decoded_token = jwt_decode(token);
    if (type.toLowerCase() === constants.TYPE.collage) {
        res.send(utils.checkCompatibilityCollage(req.body))
    } else if (type.toLowerCase() === constants.TYPE.composition) {
        res.send(utils.checkCompatibilityComposition(req.body))
    }
});

// get progress
app.get('/api/v1/progress/get', keycloak.checkSso(), (req, res) => {
    const bearer_token = req.headers.authorization;
    const token = bearer_token.split(' ')[1];
    const decoded_token = jwt_decode(token);
    UserModel
        .findOne({email: decoded_token.email})
        .then(userDoc => {
            if (!userDoc) {
                const user = new UserModel({...decoded_token});
                return user.save();
            } else if (userDoc.sub === decoded_token.sub) {
                res.status(200).json(userDoc.toJSON());
            } else {
                res.status(200).json(null);
            }
        })
        .catch(err => {
            console.log('err :>> ', err);
            res.status(400).json("Failed");
        })
});

// post progress
app.post('/api/v1/progress/post', keycloak.checkSso(), (req, res) => {
    const bearer_token = req.headers.authorization;
    const token = bearer_token.split(' ')[1];
    const decoded_token = jwt_decode(token);
    const level = req.body.level;

    UserModel
        .findOne({email: decoded_token.email})
        .then(userDoc => {
            if (!userDoc) {
                const user = new UserModel({...decoded_token, ...req.body});
                return user.save();
            } else if (userDoc.sub === decoded_token.sub) {
                userDoc.set('level', {
                    ...userDoc.toJSON().level,
                    ...level
                });
                return userDoc.save();
            } else {
                userDoc.overwrite({...decoded_token, ...req.body});
                return userDoc.save();
            }
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log('err :>> ', err);
            res.status(400).json("Failed");
        })
});

// get high score
app.get('/api/v1/high-score-board/get', keycloak.checkSso(), (req, res) => {
    HighScoreModel
        .find({})
        .populate('user')
        .then(high_score_board => {
            high_score_board = high_score_board.map(row => {
                console.log(row._doc);
                return {
                    ...row._doc,
                    user: row._doc.user.preferred_username
                }
            });
            res.status(200).json(high_score_board);
        })
        .catch(err => {
            console.log('err :>> ', err);
            res.status(400).json("Failed");
        });
});

// post score
app.post('/api/v1/score/post', keycloak.checkSso(), (req, res) => {
    const bearer_token = req.headers.authorization;
    const token = bearer_token.split(' ')[1];
    const decoded_token = jwt_decode(token);
    const score = req.body.score;
    /*const {score, score_type} = req.body.score;*/
    UserModel
        .findOne({email: decoded_token.email})
        .then(userDoc => {
            if (!userDoc) {
                const user = new UserModel({...decoded_token, ...req.body});
                return user.save();
            } else if (userDoc.sub === decoded_token.sub) {
                userDoc.set('score', score);
                return userDoc.save();
            } else {
                userDoc.overwrite({...decoded_token, ...req.body});
                return userDoc.save();
            }
        })
        .then(current_user => {
            HighScoreModel
                .find({position: {$lt: 3}})
                .then(slots => {
                    slots = check_high_score(slots, current_user);
                    HighScoreModel.deleteMany({}).then(res => {
                        return Promise.all(slots.map(slot => {
                            const high_score = new HighScoreModel({
                                user: slot.user,
                                score: slot.score,
                                position: slot.position
                            });
                            return high_score.save();
                        })).then(res => res);
                    });
                })
                .catch(err => console.log(err));

            res.status(200);
        })
        .catch(err => {
            console.log('err :>> ', err);
            res.status(400).json("Failed");
        });
});

// get score
app.get('/api/v1/score/get', keycloak.checkSso(), (req, res) => {
    const bearer_token = req.headers.authorization;
    const token = bearer_token.split(' ')[1];
    const decoded_token = jwt_decode(token);
    UserModel
        .findOne({email: decoded_token.email})
        .then(userDoc => {
            if (!userDoc) {
                const user = new UserModel({...decoded_token});
                return user.save();
            } else if (userDoc.sub === decoded_token.sub) {
                res.status(200).json(userDoc.toJSON());
            } else {
                res.status(200).json(null);
            }
        })
        .catch(err => {
            console.log('err :>> ', err);
            res.status(400).json("Failed");
        })
});

const check_high_score = (slots, current_user) => {
    let index_of_user_in_high_score_board = slots.findIndex((slot) => (slot.user.toString() === current_user._id.toString()));
    if (index_of_user_in_high_score_board !== -1 && slots[index_of_user_in_high_score_board].score <= current_user.score) {
        slots[index_of_user_in_high_score_board].score = current_user.score;
    } else if (slots.length < 3 && index_of_user_in_high_score_board === -1) {
        slots.push({
            user: current_user._id,
            score: current_user.score
        });
    } else if (index_of_user_in_high_score_board === -1) {
        let pointer = -1;
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].score < current_user.score
                && (pointer === -1 || slots[i].score > slots[pointer].score)) {
                pointer = i;
            }
        }

        if (pointer !== -1) {
            slots[pointer].user = current_user._id;
            slots[pointer].score = current_user.score;
        } else {
            console.log('user does not get into the leaderboard');
        }
    }

    slots.sort((slot1, slot2) => slot2.score - slot1.score);

    for (let i = 0; i < slots.length; i++) {
        slots[i].position = i;
    }
    return slots;
};

mongoose.connect(mongo_db_base_url + 'license_game', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log('connected to mongoDB');
    app.listen(5001, () => {
        console.log('App listening on port 5001');
    });
}).catch(err => console.log(err));

app.post('/api/v1/pdf', keycloak.checkSso(), (req, res) => {
    const bearer_token = req.headers.authorization;
    const token = bearer_token.split(' ')[1];
    const decoded_token = jwt_decode(token);
    const recipant = decoded_token.email;

    const data = JSON.stringify(req.body.cert);

    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: email.EMAIL.CERTIFICATE_SENDER_EMAIL,
            pass: email.EMAIL.CERTIFICATE_SENDER_PASSWORD,
        }
    });

    const mailOptions = {
        from: email.EMAIL.CERTIFICATE_SENDER_EMAIL,
        to: recipant,
        subject: 'Your certificate is here!',
        text: `Thank you for playing and complete the game ${decoded_token.name}!!! You can find your certificate in attachment`,
        attachments: [
            {
                filename: `${decoded_token.given_name}_${decoded_token.family_name}_Certificate`,
                path: data.slice(1,-1),
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email successfully sent: ' + info.response);
        }
    });
})

app.post('/api/v1/feedback', keycloak.checkSso(), (req, res) => {
    const bearer_token = req.headers.authorization;
    const token = bearer_token.split(' ')[1];
    const decoded_token = jwt_decode(token);
    const feedback = req.body.feedback;

    UserModel
        .findOne({email: decoded_token.email})
        .then(userDoc => {
            if (userDoc.sub === decoded_token.sub) {
                userDoc.set('feedback', {
                    ...userDoc.toJSON().feedback,
                    ...feedback
                });
                return userDoc.save();
            } else {
                userDoc.overwrite({...decoded_token, ...req.body});
                return userDoc.save();
            }
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log('err :>> ', err);
            res.status(400).json("Failed");
        })
})

const writeReport = () => { //write from database to report.csv
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    today = dd + '/' + mm + '/' + yyyy + ' ' + hours + ":" + minutes + ":" + seconds;

    let data = [];

    const csvWriter = createCsvWriter({
        path: 'report.csv',
        header: [
          {id: 'name', title: 'Name'},
          {id: 'email', title: 'Email'},
          {id: 'score', title: 'Score'},
          {id: 'opinion1', title: 'The game concept is helpful and relevant to practice OER'},
          {id: 'opinion2', title: 'The User Interface is easy to navigate and well designed'},
          {id: 'opinion3', title: 'Would you personally use this game to practice OER?'},
          {id: 'opinion4', title: 'Would you recommend this game to your friends/colleagues?'},
          {id: 'opinion5', title: 'Feedback'},
        ]
      });

    UserModel.find({ score: { $exists: true } },(function(err, result) {
        if (err) throw err;
        for(let i = 0; i < result.length; i++) {
            let obj = {};
            obj["name"] = result[i].name;
            obj["email"] = result[i].email;
            obj["score"] = result[i].score;

            if (typeof(result[i].feedback) === 'undefined') {
                obj["opinion1"] = null;
                obj["opinion2"] = null;
                obj["opinion3"] = null;
                obj["opinion4"] = null;
                obj["opinion5"] = null;
            } else {
                obj["opinion1"] = result[i].feedback.get('opinion1');
                obj["opinion2"] = result[i].feedback.get('opinion2');
                obj["opinion3"] = result[i].feedback.get('opinion3');
                obj["opinion4"] = result[i].feedback.get('opinion4');
                obj["opinion5"] = result[i].feedback.get('opinion5');
            }

            data[i] = obj;
        }
        csvWriter
            .writeRecords(data)
            .then(()=> console.log('The CSV file is written successfully!'));
    }))

    setTimeout(sendReport, 10000);
}

const sendReport = () => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: email.EMAIL.REPORT_SENDER_EMAIL,
            pass: email.EMAIL.REPORT_SENDER_PASSWORD,
        }
    });

    const mailOptions = {
        from: email.EMAIL.REPORT_SENDER_EMAIL,
        to: email.EMAIL.INTRUCTOR_EMAIL,
        subject: 'Scheduled Report OER Game',
        text: 'Here is the list of players, who has successfully completed the game, together with their suggestions and feedback',
        attachments: [
            {
                filename: 'report.csv',
                content: fs.createReadStream('report.csv')
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email successfully sent: ' + info.response);
        }
    });

    setTimeout(clearReport, 10000);
}

const clearReport = () => {
    fs.writeFile('report.csv', '', function(){console.log('Report cleared!!')})
}

cron.schedule('5 4 * * 2', () => {
    console.log('---------------------');
    console.log('Running Cron Job');
    writeReport();
  }, {
    scheduled: true,
});