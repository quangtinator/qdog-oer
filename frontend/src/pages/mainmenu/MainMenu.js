import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {reset_to_default_challenge} from "../../redux_slices/CurrentChallangeSlice";
import {reset_to_default_practices_list} from "../../redux_slices/CurrentPracticesListSlice";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import {makeStyles} from "@material-ui/core/styles";
import {main_background, story_dialog, system_button_background, game_logo} from "../../images";
import {fetch_high_score_board} from "../../redux_slices/HighScoreBoardSlice";
import {color} from "../../definitions/Types";
import {reset_time} from "../../redux_slices/TimerSlice";
import {set_current_page} from "../../redux_slices/CurrentPage";
import About from "./About";
import { FaLock } from "react-icons/fa";
import { Tooltip } from '@material-ui/core';
import {set_game_mode} from "../../redux_slices/CurrentGameModeSlice";
import useSound from 'use-sound';
import click_sound from '../../sound/click_sound.wav';


const TOTAL_LEVEL = 25;

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
        'font-family': 'Charmonman'
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
        'font-size': '1.7vh'
    },
    text_container: {
        'color': color.WHITE,
        'font-size': '1.7vh',
        'line-height': '2'
    },
    button_not_clickable: {
        'opacity': '0.8',
        'height': '6vh',
        'font-size': '2vh',
        'background-image': `url(${system_button_background})`,
        'background-size': '100% 100%',
        'font-family': 'Charmonman'
    },
    game_logo: {
        'position': 'relative',
        'top': '13vh',
        'background-image': `url(${game_logo})`,
        'background-size': '100% 100%',
        'z-index': '1',
        'height': '30vh',
        'width': '13vw',
    }
}));

function MainMenu() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const [is_about_opening, set_is_about_opening] = useState(false);
    const game_progress = useSelector(state => state.game_progress);
    const number_of_unlocked_level = Object.keys(game_progress).length;
    const helper_arr = [...Array(1).keys()];
    const [play_click] = useSound(click_sound, {volume: 0.25});

    const click_on_play = (e) => {
        e.preventDefault();
        play_click();
        dispatch(set_current_page('choose_cycle'));
    };

    const click_on_how_to_play = (e) => {
        e.preventDefault();
        play_click();
        dispatch(set_current_page('how_to_play'));
    };

    const click_on_high_score = (e) => {
        e.preventDefault();
        dispatch(fetch_high_score_board());
        play_click();
        dispatch(set_current_page('high_score_board'));
    };

    const close_about = (e) => {
        play_click();
        set_is_about_opening(false);
    };

    const click_on_about = (e) => {
        play_click();
        set_is_about_opening(true);
    };

    const click_on_certificate = (e) => {
        play_click();
        e.preventDefault();
        dispatch(set_current_page('certificate'));
    };

    useEffect(() => {
        dispatch(set_game_mode(''));
        dispatch(reset_to_default_challenge());
        dispatch(reset_to_default_practices_list());
        dispatch(reset_time());
    });

    return (
        <Grid container item justify={'center'} xs={12} className={styles.root}>
            <About close_about={close_about} is_about_opening={is_about_opening}/>
            <Grid container item justify={'center'} xs={6} md={5} className={styles.game_logo}></Grid>
            <Grid container item direction={'column'} xs={10} spacing={3} className={styles.mainmenu_container}>
                <Grid container item justify={'center'}>
                    <Grid item xs={6} md={5}>
                        <Button className={styles.button} fullWidth onClick={click_on_play}>Test</Button>
                    </Grid>
                </Grid>

                <Grid container item justify={'center'}>
                {
                    helper_arr.map(index => {
                        if (number_of_unlocked_level === TOTAL_LEVEL) {
                            return (
                                <Grid item xs={6} md={5}>
                                    <Button className={styles.button} fullWidth onClick={click_on_certificate}>Certificate</Button>
                                </Grid>
                            )
                        } else {
                            return (
                                <Tooltip title={"Finish the game to unlock the certificate"}>
                                    <Grid item xs={6} md={5}>
                                        <Button className={styles.button} fullWidth disabled><FaLock/>Certificate</Button>
                                    </Grid>
                                </Tooltip>
                            )
                        }
                    })
                }
                </Grid>

                <Grid container item justify={'center'}>
                    <Grid item xs={6} md={5}>
                        <Button className={styles.button} fullWidth onClick={click_on_how_to_play}>How To Play</Button>
                    </Grid>
                </Grid>

                <Grid container item justify={'center'}>
                    <Grid item xs={6} md={5}>
                        <Button className={styles.button} fullWidth onClick={click_on_high_score}>Leaderboards</Button>
                    </Grid>
                </Grid>

                <Grid container item justify={'center'}>
                    <Grid item xs={6} md={5}>
                        <Button className={styles.button} fullWidth onClick={click_on_about}>About</Button>
                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    );
}

export default MainMenu;