import {license_types, questionTypes, game_types, resource_types} from '../../definitions/Types';
import {containOnlyNDLicenses} from "./Practice";
import {
    level_2_description,
    level_5_description,
    level_8_description,
    level_3_description,
    level_4_description,
    level_9_description,
    level_10_description,
    level_11_description,
    level_15_description,
    level_16_description,
    level_17_description,
    level_18_description,
    level_21_description,
    level_22_description,
    level_23_description,
    level_24_description,
} from "../../images";

// For multiple_choice questions, declaring combination_type in the challenge is not necessary because the correct answer
// is fixed. Hence no request to the server will be made.

const generateLevel0 = () => {
    let data = [
        {Audio: 'Soundcloud'},
        {Text: 'Google Doc'},
        {Graphics: 'Easy.ly'}
    ];
    return {
        type: game_types.PRACTICE_THEORY,
        level: 0,
        data: data,
        description: 'Drag to arrange the OER types (on the right) to match the right creating tools (on the left)',
        numberOfMatches: data.length,
    }
};

const generateLevel1 = () => {
    let data = [
        {Presentation: 'Google Doc'},
        {Website: 'Wordpress'},
        {Video: 'Filmora'},
    ];
    return {
        type: game_types.PRACTICE_THEORY,
        level: 1,
        data: data,
        description: 'Drag to arrange the OER types (on the right) to match the right creating tools (on the left)',
        numberOfMatches: data.length,
    }
};

const generateLevel2 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 2,
        context: `In order to create the weapon you desire, first you need to extract the raw material 
                and it is very important to use the tool that fits with the material.`,
        description_image: level_2_description,
        question: `Which of the following tools should you use if you want to extract some iron (TEXT type)?`,
        choices: [
            {
                display_text: 'A broom (Filmora)',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'A shovel (Clipgenerator)',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'A hammer (Libre Office)',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'A spoon (Soundcloud)',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 2,
        hint: 'Be careful with the text form',
    };
};

const generateLevel3 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 3,
        context: `Steel is a combination of carbon and iron and also the perfect material for our weapon 
                but we still need CARBON to make it`,
        description_image: level_3_description,
        question: `Which is the type of CARBON when we know that we can use high heat(MozillaWebmaker) to catch them?`,
        choices: [
            {
                display_text: 'Text Type',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'Audio Type',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'Website Type',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'Graphic Type',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 2,
        hint: 'mozillaWEBmaker',
    };
};

const generateLevel4 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 4,
        context: `Let's see how you deal in this unfortunate situation`,
        description_image: level_4_description,
        question: `Oh no!! Your furnace has suddenly broken down and one of your buddy offers you to use 
                his to create Steel(OER). What could be the reason not to use his furnace?`,
        choices: [
            {
                display_text: 'His furnace might have some legal/technical restrictions',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'You can not use two different furnaces to create Steel',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'Steel can only be forged using your furnace',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'He could somehow later claim license on your Steel',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 0,
        hint: 'Be careful with the restrictions!!!',
    };
};

const generateLevel5 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 5,
        context: `Good job! Now that you have gather all you need, it is time to create Steel as the material for our sword.`,
        description_image: level_5_description,
        question: `With a magical furnace (MS Office), which type of Steel (OER) can you create?`,
        choices: [
            {
                display_text: '100% Iron(Presentation slides)',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: '99% Iron + 1% Carbon(Tables)',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: '98% Iron + 2% Carbon(Texts)',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'All of the above',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 3,
        hint: 'Can you create all of those types with MS Office?',
        last_level_chapter: true,
    };
};

const generateLevel6 = () => {
    let data = [
        {[license_types.CC_BY]: `Original authors must be credited`},
        {[license_types.CC_BY_SA]: `Redistributions with the same license as the original`},
        {[license_types.CC_BY_NC]: `Commercial use is NOT allowed`}
    ];
    return {
        type: game_types.PRACTICE_THEORY,
        level: 6,
        data: data,
        description: 'Drag to arrange the description (on the right) to match the licences (on the left)',
        numberOfMatches: data.length
    };
};

const generateLevel7 = () => {
    let data = [
        {[license_types.CC_BY_NC_SA]: `Commercial use is NOT allowed; Redistributions with the same license as the original`},
        {[license_types.CC_BY_ND]: `Adaptation is NOT allowed`},
        {[license_types.CC_BY_NC_ND]: `Adaptation and commercial use are NOT allowed`},
    ];
    return {
        type: game_types.PRACTICE_THEORY,
        level: 7,
        data: data,
        description: 'Drag to arrange the description (on the right) to match the licences (on the left)',
        numberOfMatches: data.length
    };
};

const generateLevel8 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 8,
        context: `Well done! Now it is finally time to use your Steel, but before using it, there are something to remember`,
        description_image: level_8_description,
        question: `What is considered not so important when it comes to using OER?`,
        choices: [
            {
                display_text: 'Name of the Creator',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'When the OER was created',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'Where you can find it',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'All of the above',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 1,
        hint: 'The TULLU(TASLL) rule might help'
    };
};

const generateLevel9 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 9,
        context: `Unfortunately we only have enough material to create the blade. We have to buy a hilt(Gefäß) to finish it`,
        description_image: level_9_description,
        question: `When you are planning to use a premade part of the sword(OER), 
                what are the following properties that need to be considered and remembered?`,
        choices: [
            {
                display_text: 'Who is the creator of that part?',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'Where you got that part and the name of it',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'Under which spell(License) it is in and where to find it?',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'All of the above',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 3,
        hint: 'The TULLU(TASLL) rule might help'
    };
};

const generateLevel10 = () => {
    return {
        type: questionTypes.DROP_DOWN_CHOICE,
        level: 10,
        context: `You asked your good old friend MAESTER ANDERSON from town SENTINEL for the DRAGON HILT 
                under ICE ASPECT spell(CC BY-SA) to finish the sword.`,
        description_image: level_10_description,
        question: 'Before you use that part for your sword, can you note down all the important information?',
        choices: [
            {
                display_label: 'Title: ',
                CC_license: license_types.CC_BY_SA,
                correct_answer: 'dh',
            },
            {
                display_label: 'Author: ',
                CC_license: license_types.CC_BY_NC_SA,
                correct_answer: 'ma',
            },
            {
                display_label: 'Source: ',
                CC_license: license_types.CC_BY_ND,
                correct_answer: 's',
            },
            {
                display_label: 'License: ',
                CC_license: license_types.CC_ZERO,
                correct_answer: 'ia',
            }
        ],
        correctAnswer: null,
        hint: 'You should read carefully!'
    };
};

const generateLevel11 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 11,
        context: `The materials are ready. Let's get to work but first, 
                choose wisely!! Let them know who you are`,
        description_image: level_11_description,
        question: `Your mission is to craft a powerful sword and would want the people to remember who made it 
                and not to modify your masterpiece. Which license do you put on to your weapon?`,
        choices: [
            {
                display_text: 'CC Zero',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'CC BY',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'CC BY-SA',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'CC BY-ND',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 3,
        hint: 'ND stands for No Derivative',
        last_level_chapter: true,
    };
};

const generateLevel12 = () => {
    const all_resources = Object.keys(resource_types).map(key => {
        if (resource_types.hasOwnProperty(key)) {
            return resource_types[key]
        }
    });
    const licenses = [license_types.CC_ZERO, license_types.CC_BY, license_types.CC_BY_SA, license_types.CC_BY_NC, license_types.CC_BY_NC_SA, license_types.CC_BY_ND, license_types.CC_BY_NC_ND];

    let result = {
        type: game_types.PRACTICE_EDITING_COLLAGE,
        level: 12,
        number_of_required_resource: 2,
        description: 'Pick at least two resources and drop onto the lava to combine a collage',
        resources: []
    };

    for (let i = 0; i < 4; i++) {
        const resource = all_resources[Math.floor(Math.random() * 4)];
        const license = licenses[Math.floor(Math.random() * 7)];
        result.resources.push({
            resource_type: resource,
            license: license,
            resource_id: i + '-' + resource + '-' + license
        });
    }

    if (containOnlyNDLicenses(result.resources)) {
        return generateLevel12();
    }

    return result;
};

const generateLevel13 = () => {
    let data = [
        {Composition: 'Resources can be clearly differentiated from each other'},
        {Collage: 'Resources are blended into the other and cannot be differentiated from each other'}
    ];
    return {
        type: game_types.PRACTICE_THEORY,
        level: 13,
        data: data,
        description: 'Drag to arrange the description (on the right) to match the concepts (on the left)',
        numberOfMatches: data.length
    }
};

const generateLevel14 = () => {
    const all_resources = Object.keys(resource_types).map(key => {
        if (resource_types.hasOwnProperty(key)) {
            return resource_types[key]
        }
    });
    const licenses = [license_types.CC_ZERO, license_types.CC_BY, license_types.CC_BY_SA, license_types.CC_BY_NC, license_types.CC_BY_NC_SA, license_types.CC_BY_ND, license_types.CC_BY_NC_ND];

    let result = {
        type: game_types.PRACTICE_EDITING_COMPOSITION,
        level: 14,
        number_of_required_resource: 2,
        description: 'Pick at least two resources and drop onto the lava to combine a composition',
        resources: []
    };

    for (let i = 0; i < 4; i++) {
        const resource = all_resources[Math.floor(Math.random() * 4)];
        const license = licenses[Math.floor(Math.random() * 7)];
        result.resources.push({
            resource_type: resource,
            license: license,
            resource_id: i + '-' + resource + '-' + license
        });
    }

    if (containOnlyNDLicenses(result.resources)) {
        return generateLevel14();
    }

    return result;
};

const generateLevel15 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 15,
        context: `Ah ha! You just remember there is one missing component of STEEL`,
        description_image: level_15_description,
        question: `Given that steel (CC BY-NC-SA) is a COLLAGE of carbon (CC ZERO), iron (CC BY-NC) 
                and a secret substance X. What is X?`,
        choices: [
            {
                display_text: 'Chromium (CC BY-SA)',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'Tungsten (CC BY-NC-SA)',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'Nickel (CC BY-ND)',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'Manganese (CC ZERO)',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 1,
        hint: 'Be careful with the SA licenses'
    };
};

const generateLevel16 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 16,
        context: `Your hilt(Gefäß) is finally here, it's time to combine them together`,
        description_image: level_16_description,
        question: `Your new craft weapon is a COMPOSITION of the blade (CC BY) and the hilt (CC BY-SA). 
                Which license should you choose for your weapon?`,
        choices: [
            {
                display_text: 'CC BY-SA',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'CC BY-NC-SA',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'CC ZERO',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'CC BY-ND',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 0,
        hint: 'Be careful with the SA licenses'
    };

};

const generateLevel17 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 17,
        context: `The sword is finish, but we can't just give it to the Queen. We might need something to contain it`,
        description_image: level_17_description,
        question: `The sword box consists of three main components: the wooden box (CC Zero), the lock (CC BY-NC),
                and the decoration silk inside the box (CC BY-NC-SA). This is a COLLAGE. What is the license of the box?`,
        choices: [
            {
                display_text: 'CC BY-SA',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'CC BY-NC-SA',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'CC BY-ND',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'CC ZERO',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 1,
        hint: 'Be careful of the NC-SA license',
        oer_resources: []
    };
};

const generateLevel18 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 18,
        context: `Finally, we can gift the sword to the Queen now`,
        description_image: level_18_description,
        question: `The gift is a COLLAGE of the sword (CC BY-SA) and the box (CC BY-NC-SA). 
                Which license should we assign to the gift?`,
        choices: [
            {
                display_text: 'CC BY-NC-SA',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'CC BY-SA',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'CC BY-NC-ND',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'CC BY',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 0,
        hint: 'Be careful of the NC-SA license',
        oer_resources: [],
        last_level_chapter: true,
    };
};

const generateLevel19 = () => {
    let data = [
        {Photos: 'openphoto.net'},
        {Video: 'vimeo.com'},
        {Music: 'free-loops.com'}
    ];
    return {
        type: game_types.PRACTICE_THEORY,
        level: 19,
        data: data,
        description: 'Drag to arrange the portal (on the right) to match the OER types (on the left)',
        numberOfMatches: data.length
    }
};

const generateLevel20 = () => {
    let data = [
        {Textbook: 'opensatx.org'},
        {Presentation: 'de.slideshare.net'},
        {Simulation: 'phet.colorado.edu'}
    ];
    return {
        type: game_types.PRACTICE_THEORY,
        level: 20,
        data: data,
        description: 'Drag to arrange the portal (on the right) to match the OER types (on the left)',
        numberOfMatches: data.length
    }
};

const generateLevel21 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 21,
        context: `The road to the other kingdom is very far`,
        description_image: level_21_description,
        question: `Earlier you put CC-BY-SA to your sword and you want the to give it to Queen through a magic portal (youtube.com). 
                Is it possible?`,
        choices: [
            {
                display_text: 'No, you need CC-BY-ND',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'No, you need CC-BY-NC',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'No, you need CC BY or CC ZERO',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'Yes, because license does not matter on the portal',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 2,
        hint: 'Which license is allowed on youtube.com?',
        oer_resources: []
    };
};

const generateLevel22 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 22,
        context: `So you can not send it through the portal. It's time to put another license to it`,
        description_image: level_22_description,
        question: `Suddenly you changed your mind and want everyone to use your sword freely(CC0 1.0). 
                Select a right choice to deliver the sword to the Queen?`,
        choices: [
            {
                display_text: 'Your horse(pxhere.com)',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'Your cow(kisscc0.com)',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'Your donkey(pixabay.com)',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'All of the above',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 3,
        hint: 'Which animal can walk?',
        oer_resources: []
    };
};

const generateLevel23 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 23,
        context: `The Queen is very impressed by the sword that you made and has decided to let the librarian DOCUMENT the process 
                of crafting to make a book in order to train the young blacksmiths.`,
        description_image: level_23_description,
        question: 'The librarian wants to put the book in the Empress Library(https://de.wikibooks.org/wiki/). Will you be able to go there and help him find out which license he should put on the book?',
        choices: [
            {
                display_text: 'CC ZERO',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'CC BY-NC',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'CC BY-SA (3.0)',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'CC BY-NC-SA',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 2,
        hint: 'May the destination has your answer',
        oer_resources: []
    };
};

const generateLevel24 = () => {
    return {
        type: questionTypes.MULTIPLE_CHOICE,
        level: 24,
        context: `A powerful mage also wants to give you the magic ring that can project IMAGES of the legendary sword so 
                that you can show your students later in the future.`,
        description_image: level_24_description,
        question: `For safety reason he needs to hide this ring. Where is the perfect place to hide and under which license 
                do you think the mage should put on the ring?`,
        choices: [
            {
                display_text: 'In the forest(https://pxhere.com/) with CC0 1.0',
                CC_license: license_types.CC_BY_SA
            },
            {
                display_text: 'At his home(https://www.youtube.com) with CC0 4.0',
                CC_license: license_types.CC_BY_NC_SA
            },
            {
                display_text: 'By the sea(https://vimeo.com/creativecommons) with CC BY',
                CC_license: license_types.CC_BY_ND
            },
            {
                display_text: 'Under the throne(https://de.slideshare.net) with CC BY',
                CC_license: license_types.CC_ZERO
            }
        ],
        correctAnswer: 0,
        hint: 'May the destination has your answer',
        oer_resources: [],
        last_level_chapter: true,
    };
};

const challengeGenerator = (level) => {
    if (typeof level === 'string') {
        level = parseInt(level, 10);
    }
    let result = {};
    switch (level) {
        case 0:
            result = generateLevel0();
            break;
        case 1:
            result = generateLevel1();
            break;
        case 2:
            result = generateLevel2();
            break;
        case 3:
            result = generateLevel3();
            break;
        case 4:
            result = generateLevel4();
            break;
        case 5:
            result = generateLevel5();
            break;
        case 6:
            result = generateLevel6();
            break;
        case 7:
            result = generateLevel7();
            break;
        case 8:
            result = generateLevel8();
            break;
        case 9:
            result = generateLevel9();
            break;
        case 10:
            result = generateLevel10();
            break;
        case 11:
            result = generateLevel11();
            break;
        case 12:
            result = generateLevel12();
            break;
        case 13:
            result = generateLevel13();
            break;
        case 14:
            result = generateLevel14();
            break;
        case 15:
            result = generateLevel15();
            break;
        case 16:
            result = generateLevel16();
            break;
        case 17:
            result = generateLevel17();
            break;
        case 18:
            result = generateLevel18();
            break;
        case 19:
            result = generateLevel19();
            break;
        case 20:
            result = generateLevel20();
            break;
        case 21:
            result = generateLevel21();
            break;
        case 22:
            result = generateLevel22();
            break;
        case 23:
            result = generateLevel23();
            break;
        case 24:
            result = generateLevel24();
            break;
        default:
            return null;
    }

    return result;
};

export default challengeGenerator;