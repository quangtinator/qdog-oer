import React, { useState } from 'react';
import {useDispatch} from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Form from "react-bootstrap/Form";
import {main_background, how_to_play, system_button_background} from "../../images";
import {set_current_page} from "../../redux_slices/CurrentPage";
import { useToasts } from 'react-toast-notifications';
import {color} from "../../definitions/Types";
import jsPDF from "jspdf";
import {makeStyles} from "@material-ui/core/styles";
import jwt_decode from "jwt-decode";
import {postCert} from "../certificate/Cert_request";
import {imgToString} from "../certificate/imageToString"
import "../certificate/OldLondon-normal";
import useSound from 'use-sound';
import click_sound from '../../sound/click_sound.wav';

const useStyles = makeStyles((theme) => ({
    root: {
        'position': 'absolute',
        'height': '100%',
        'background-image': `url(${main_background})`,
        'background-size': '100% 100%'
    },
    how_to_play_container: {
        'position': 'relative',
        'height': '75vh',
        'background-image': `url(${how_to_play})`,
        'background-size': '100% 100%'
    },
    header_container: {
        'margin-top': '3vh'
    },
    header: {
        'color': color.BROWN,
        'font-size': '4vh',
        'font-family': 'Charmonman'
    },
    button_container: {
        'position': 'absolute',
        'bottom': '2vh'
    },
    button: {
        'width': '11vw',
        'height': '5vh',
        'background-image': `url(${system_button_background})`,
        'background-size': '100% 100%',
        'color': color.WHITE,
        'font-family': 'Charmonman'
    },
    text_container: {
        'font-family': 'Charmonman',
        'font-size': '2vh',
        'text-align': 'justify',
        'margin-top': '2vh'
    },

    label: {
        'font-family': 'Charmonman',
        'font-size': '2vh',
        'text-align': 'justify',
    }
}));

const Certificate = () => {
    const styles = useStyles();
    const {addToast} = useToasts();
    const [method, setMethod] = useState('download');
    const [language, setLanguage] = useState('en');
    const dispatch = useDispatch();
    const decoded_token = jwt_decode(window.accessToken);
    const [play_click] = useSound(click_sound, {volume: 0.25});
    
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    const generateCert = () => {
        const cert = new jsPDF({
            orientation: "landscape",
            unit: "cm",
            format: [30, 20]
        });

        if (language === 'en') {
            cert.addImage(imgToString.logo, 0, 0);
            cert.addImage(imgToString.background, 8.7, 0); //render pictures, background
            cert.addImage(imgToString.mark, 26, 0);
            cert.addImage(imgToString.lebiac, 17, 16.5);

            cert.setFontSize(46);
            cert.setFont('OldLondon');
            cert.text(10, 4, 'Certificate of Completion');

            cert.setFontSize(12);
            cert.setFont('Helvetica', 'italic');
            cert.text(10, 7, 'This is to certify that:');

            cert.setFontSize(22);
            cert.setFont('Helvetica', 'bold');
            cert.text(10, 8, decoded_token.name);
            cert.text(10, 9, `[${decoded_token.email}]`);

            cert.setFontSize(12);
            cert.setFont('Helvetica', 'italic');
            cert.text(10, 11, 'has completed the course:');

            cert.setFontSize(20);
            cert.setFont('Helvetica', 'bold');
            cert.text(10, 12, 'LeBiAc OER Competency in Teacher Training');

            cert.setFontSize(12);
            cert.setFont('Helvetica', 'italic');
            cert.text(10, 14, 'Issued on:');

            cert.setFontSize(18);
            cert.setFont('Helvetica', 'bold');
            cert.text(10, 15, today);

            cert.setFontSize(10);
            cert.setFont('Helvetica', 'italic');
            cert.text(10, 19.5, 'Disclaimer: This certificate is auto-generated and intended to be used only within the OER Workshop and OER Moodle course');
        } else {
            cert.addImage(imgToString.logo, 0, 0);
            cert.addImage(imgToString.background, 8.7, 0); //render pictures, background
            cert.addImage(imgToString.mark, 26, 0);
            cert.addImage(imgToString.lebiac, 17, 16.5);

            cert.setFontSize(46);
            cert.setFont('OldLondon');
            cert.text(10, 4, 'Abschlusszertifikat');

            cert.setFontSize(12);
            cert.setFont('Helvetica', 'italic');
            cert.text(10, 7, 'Dieses Zertifikat belegt, dass: ');

            cert.setFontSize(22);
            cert.setFont('Helvetica', 'bold');
            cert.text(10, 8, decoded_token.name);
            cert.text(10, 9, `[${decoded_token.email}]`);

            cert.setFontSize(12);
            cert.setFont('Helvetica', 'italic');
            cert.text(10, 11, 'den folgenden Kurs erfolgreich abgeschlossen hat:');

            cert.setFontSize(20);
            cert.setFont('Helvetica', 'bold');
            cert.text(10, 12, 'LeBiAc OER Kompetenzen in der Lehramtsausbildung');

            cert.setFontSize(12);
            cert.setFont('Helvetica', 'italic');
            cert.text(10, 14, 'Ausgestellt am:');

            cert.setFontSize(18);
            cert.setFont('Helvetica', 'bold');
            cert.text(10, 15, today);

            cert.setFontSize(9);
            cert.setFont('Helvetica', 'italic');
            cert.text(10, 19.5, 'Hinweis: Dieses Zertifikat wurde automatisch generiert und ist nur innerhalb des OER Workshops und des OER Moodle-Kurs gültig');
        }
        
        if (method === 'email') {
            const pdf = cert.output('datauristring', `${decoded_token.given_name}_${decoded_token.family_name}_Certificate`);
            postCert(window.accessToken, pdf);

            addToast('Email sent! Thank you for playing the game.', {
                appearance: 'success',
                autoDismiss: true,
            });
        } else {
            cert.output('save', `${decoded_token.given_name}_${decoded_token.family_name}_Certificate`);
        }

        play_click();
        dispatch(set_current_page('feedback'));
    }

    return(
        <Grid container item xs={12} justify={'center'} alignItems={'center'} className={styles.root}>
            <Grid container item xs={8} className={styles.how_to_play_container} justify={'center'}
                  alignContent={'flex-start'}>
                <Grid container item xs={12} justify={'center'} alignItems={'center'} alignContent={'center'}
                      className={styles.header_container}>
                    <Grid item className={styles.header}>Certificate</Grid>
                </Grid>

                <Grid container item xs={10} justify={'flex-start'} className={styles.text_container}>
                    <Grid item>
                        Well done and congratulations!! You have saved the kingdom and completed the game from the OER Workshop.
                        <br/><br/>
                        To honor you, the Queen has decided to grant you a prestige certificate, which indicates that you
                        have finished the game.
                        <br/><br/>
                        Click on the button below to get your the certificate, either via email or downloadable directly from browser. 
                        You can use it later to access to the advanced OER Moodle course room and study further into the field of OER.
                        <br/><br/>
                    </Grid>
                </Grid>

                <Grid container item xs={10} justify={'flex-start'}>
                    <Grid container item xs={10} className={styles.label}>
                        In which language would you want your certificate?
                    </Grid>

                    <Form.Group>
                        <Form.Control as='select'
                                      onChange= {(e) => setLanguage(e.target.value)}
                                      className={styles.text_container}>
                            <option value="en">English</option>
                            <option value="de">German</option>
                        </Form.Control>
                    </Form.Group>
                </Grid>

                <Grid container item xs={10} justify={'flex-start'}>
                    <Grid container item xs={10} className={styles.label}>
                        How would you like to receive your certificate?
                    </Grid>

                    <Form.Group>
                        <Form.Control as='select'
                                      onChange= {(e) => setMethod(e.target.value)}
                                      className={styles.text_container}>
                            <option value="download">Download Directly</option>
                            <option value="email">Via Email</option>
                        </Form.Control>
                    </Form.Group>
                </Grid>

                <Grid container item xs={4} className={styles.button_container} justify={'center'}>
                    <Button className={styles.button} onClick={generateCert}>
                        Get Certificate
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Certificate;