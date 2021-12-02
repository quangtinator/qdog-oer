import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {main_background, system_button_background, story_dialog} from "../../images";
import {color} from '../../definitions/Types';
import DropDownFeedback from './DropDownFeedback';
import UserInput from './UserInput';
import { postFeedback } from './postFeedback';
import {set_current_page} from "../../redux_slices/CurrentPage";
import { useToasts } from 'react-toast-notifications';
import useSound from 'use-sound';
import click_sound from '../../sound/click_sound.wav';

const useStyles = makeStyles((theme) => ({
    pop_up: {
        'position': 'absolute',
        'background-image': `url(${story_dialog})`,
        'background-size': '100% 100%',
        'width': '100vw',
        'height': '90vh',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%,-50%)',
        'padding-left': '3vw',
        'padding-right': '3vw',
        'padding-top': '10vh',
    },
    root: {
        'position': 'absolute',
        'height': '100%',
        'background-image': `url(${main_background})`,
        'background-size': '100% 100%'
    },
    header: {
        'font-size': '3vh',
        'color': color.WHITE,
        'height': '10vh',
    },
    text: {
        'color': color.WHITE,
        'font-size': '1.7vh',
        'position': 'relative',
        'top': '-28vh',
    },
    button_container: {
        'position': 'absolute',
        'bottom': '2vh'
    },
    button: {
        'position': 'relative',
        'bottom': '7vh',
        'width': '11vw',
        'height': '5vh',
        'background-image': `url(${system_button_background})`,
        'background-size': '100% 100%',
        'color': color.WHITE,
        'font-family': 'Charmonman'
    },
}));

const UserFeedback = (props) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const {addToast} = useToasts();
    const [play_click] = useSound(click_sound, {volume: 0.25});
    
    const [opinion1, setOpinion1] = useState('');
    const [opinion2, setOpinion2] = useState('');
    const [opinion3, setOpinion3] = useState('');
    const [opinion4, setOpinion4] = useState('');
    const [opinion5, setOpinion5] = useState('');

    const onChange = (alias, e) => {
        e.preventDefault();
        if (alias === 'opinion1') {
            setOpinion1(e.target.value);
        }
        if (alias === 'opinion2') {
            setOpinion2(e.target.value);
        }
        if (alias === 'opinion3') {
            setOpinion3(e.target.value);
        }
        if (alias === 'opinion4') {
            setOpinion4(e.target.value);
        }
        if (alias === 'opinion5') {
            setOpinion5(e.target.value);
        }
    }

    const onClick = () => {
        const feedback = {
            opinion1: opinion1,
            opinion2: opinion2,
            opinion3: opinion3,
            opinion4: opinion4,
            opinion5: opinion5,
        }

        postFeedback(window.accessToken, feedback);
        
        addToast('Feedback sent! Thank you for playing the game.', {
            appearance: 'success',
            autoDismiss: true,
        });

        play_click();
        dispatch(set_current_page('main_menu'));
    }

    return (
        <Grid container item justify={'center'} xs={12} className={styles.root}>
            <Grid container item justify={'center'} xs={12} className={styles.pop_up}>
                <Grid container item justify={'center'} xs={12} className={styles.header}>
                    Do you have a moment for a quick feedback?
                </Grid>

                <Grid container item justify={'center'} spacing={3} xs={12} className={styles.text}>
                    <DropDownFeedback display_label={'The game concept is helpful and relevant to practice OER'}
                                      alias={'opinion1'}
                                      onChange={onChange}/>
                    <DropDownFeedback display_label={'The User Interface is easy to navigate and well designed'}
                                      alias={'opinion2'}
                                      onChange={onChange}/>
                    <DropDownFeedback display_label={'Would you personally use this game to practice OER?'}
                                      alias={'opinion3'}
                                      onChange={onChange}/>
                    <DropDownFeedback display_label={'Would you recommend this game to your friends/colleagues?'}
                                      alias={'opinion4'}
                                      onChange={onChange}/>
                    <UserInput display_label={'Your suggestions for future development:'}
                               alias={'opinion5'}
                               onChange={onChange}/>
                               
                </Grid>

                <Grid container item xs={5} className={styles.button_container} justify={'center'}>
                    <Button className={styles.button} onClick={onClick}>
                        Send Feedback
                    </Button>
                </Grid>

            </Grid>
        </Grid>
        
    );
};

export default UserFeedback;