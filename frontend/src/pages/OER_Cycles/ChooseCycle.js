import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {reset_to_default_challenge} from "../../redux_slices/CurrentChallangeSlice";
import {reset_to_default_practices_list} from "../../redux_slices/CurrentPracticesListSlice";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import {makeStyles} from "@material-ui/core/styles";
import {main_background, story_dialog, system_button_background} from "../../images";
import {color} from "../../definitions/Types";
import {reset_time} from "../../redux_slices/TimerSlice";
import {set_current_page} from "../../redux_slices/CurrentPage";
import {set_game_mode} from "../../redux_slices/CurrentGameModeSlice";
import useSound from 'use-sound';
import click_sound from '../../sound/click_sound.wav';

const useStyles = makeStyles((theme) => ({
    root: {
        'position': 'absolute',
        'height': '100%',
        'background-image': `url(${main_background})`,
        'background-size': '100% 100%',
        // This is only a temporary fix
        // 'z-index': 1
    },
    mainmenu_container: {
        'margin-top': '16vh'
    },
    button: {
        'height': '6vh',
        'font-size': '1.7vh',
        'background-image': `url(${system_button_background})`,
        'background-size': '100% 100%',
        'color': color.WHITE,
        'font-family': 'Charmonman',
        'margin-top' : '7vh',
    },
    pop_up: {
        'position': 'absolute',
        'background-image': `url(${story_dialog})`,
        'background-size': '100% 100%',
        'width': '45vw',
        'height': '100vh',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%,-50%)',
        'padding-left': '2vw',
        'padding-right': '2vw',
        'padding-top': '11vh'
    },
    ok_button_container: {
        'position': 'absolute',
        'bottom': '10vh',
    },
    ok_button: {
        'background-image': `url(${system_button_background})`,
        'background-size': '100% 100%',
        'color': color.WHITE,
        'font-size': '2vh'
    },
    header: {
        'font-size': '3vh',
        'color': color.WHITE
    },
    choose_level_container: {
        'margin-top': '15vh',
        'width': '80%'
    },
    level_clickable: {
        'height': '6vh',
        'font-size': '2vh',
        'background-image': `url(${system_button_background})`,
        'background-size': '100% 100%',
        'color': color.WHITE
    },
    level_not_clickable: {
        'opacity': '0.3',
        'height': '6vh',
        'font-size': '2vh',
        'background-image': `url(${system_button_background})`,
        'background-size': '100% 100%'
    },
    text_container: {
        'color': color.WHITE,
        'font-size': '2vh',
        'line-height': '2'
    }
}));

function ChooseCycle() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const [play_click] = useSound(click_sound, {volume: 0.25});

    const click_on_create_oer = (e) => {
        e.preventDefault();
        play_click();
        dispatch(set_current_page('create_oer'));
    };

    const click_on_use_oer = (e) => {
        e.preventDefault();
        play_click();
        dispatch(set_current_page('use_oer'));
    };

    const click_on_edit_oer = (e) => {
        e.preventDefault();
        play_click();
        dispatch(set_current_page('edit_oer'));
    };

    const click_on_distribute_oer = (e) => {
        e.preventDefault();
        play_click();
        dispatch(set_current_page('distribute_oer'));
    };

    useEffect(() => {
        dispatch(set_game_mode(''));
        dispatch(reset_to_default_challenge());
        dispatch(reset_to_default_practices_list());
        dispatch(reset_time());
    });

    return (
        <Grid container item xs={12} justify={'center'} className={styles.root}>
            <Grid container direction={'column'} spacing={1} className={styles.choose_level_container}>
                <Grid container item justify={'center'}>
                    <Grid item xs={6} md={5}>
                        <Button className={styles.button} fullWidth onClick={click_on_create_oer}>Create OER</Button>
                    </Grid>
                </Grid>
                <Grid container item justify={'center'}>
                    <Grid item xs={6} md={5}>
                        <Button className={styles.button} fullWidth onClick={click_on_use_oer}>Use OER</Button>
                    </Grid>
                </Grid>
                <Grid container item justify={'center'}>
                    <Grid item xs={6} md={5}>
                        <Button className={styles.button} fullWidth onClick={click_on_edit_oer}>Edit OER</Button>
                    </Grid>
                </Grid>
                <Grid container item justify={'center'}>
                    <Grid item xs={6} md={5}>
                        <Button className={styles.button} fullWidth onClick={click_on_distribute_oer}>Distribute OER</Button>
                    </Grid>
                </Grid>
            </Grid>
                </Grid>
    );
}

export default ChooseCycle