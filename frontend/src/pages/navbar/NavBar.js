import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from '@material-ui/core/Button';
import {navbar_back_button, navbar_logout_button, navbar_music_button } from "../../images";
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import {color} from "../../definitions/Types";
import {keycloak} from "../../index";
import {set_current_page} from "../../redux_slices/CurrentPage";
import Tooltip from '@material-ui/core/Tooltip';
import useSound from 'use-sound';
import click_sound from '../../sound/click_sound.wav';

const useStyles = makeStyles((theme) => ({
    root: {
        'position': 'fixed',
        'z-index': 2
    },
    navbar_container: {
        'margin-top': '1vh'
    },
    back_button: {
        'margin-left': '0.5vw',
        'min-width': '0px',
        'width': '2vw',
        'height': '4vh',
        'background-image': `url(${navbar_back_button})`,
        'background-size': '100% 100%'
    },
    logout_button: {
        'min-width': '0px',
        'width': '2vw',
        'height': '4vh',
        'background-image': `url(${navbar_logout_button})`,
        'background-size': '100% 100%'
    },
    music_button: {
        'margin-left': '1.5vw',
        'min-width': '0px',
        'width': '2vw',
        'height': '4vh',
        'background-image': `url(${navbar_music_button})`,
        'background-size': '100% 100%'
    },
    score_and_time_and_game_type: {
        'margin-left': '1vw',
        'color': color.WHITE,
        'font-size': '2.5vh',
        'font-family': 'Charmonman'
    }
}));


const NavBar = (props) => {
    const dispatch = useDispatch();
    const [play_click] = useSound(click_sound, {volume: 0.25});
    const current_page = useSelector(state => state.current_page);
    const total_score = useSelector(state => state.score.total_score);
    const elapsed_time = useSelector(state => state.elapsed_time);
    const music = props.music;
    const styles = useStyles();

    const click_on_back_button = () => {
        play_click();
        if (current_page === 'story') {
            dispatch(set_current_page('choose_cycle'));
        }
        else if (current_page === 'create_oer') {
            dispatch(set_current_page('choose_cycle')) 
        }
        else if (current_page === 'use_oer') {
            dispatch(set_current_page('choose_cycle')) 
        }
        else if (current_page === 'edit_oer') {
            dispatch(set_current_page('choose_cycle')) 
        }
        else if (current_page === 'distribute_oer') {
            dispatch(set_current_page('choose_cycle'))
        }
        else {
            dispatch(set_current_page('main_menu'));
        }
    };

    const logout = () => {
        keycloak.logout();
    };

    return (
        <Grid container item justify={'center'} xs={12} className={styles.root}>
            <Grid container item md={6} className={styles.navbar_container}>
                <Grid container item xs={1} justify={'flex-start'}>
                    <Tooltip title={"Go Back"}>
                        <Button onClick={() => click_on_back_button()} className={styles.back_button}>
                        </Button>
                    </Tooltip>
                </Grid>

                <Grid container item xs={9} justify={'center'}>
                    <Grid container item xs={3} justify={'flex-start'}>
                        <Grid item className={styles.score_and_time_and_game_type}>
                            Score: {total_score}
                        </Grid>
                    </Grid>
                    <Grid container item xs={4} justify={'flex-start'}>
                        <Grid item className={styles.score_and_time_and_game_type}>
                            Elapsed Time: {elapsed_time}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container item xs={1}>
                    <Grid container item xs={10} justify={'center'}>
                        <Tooltip title={"Background Music"}>
                            <Button onClick={music} className={styles.music_button}>
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Grid container item xs={1}>
                    <Grid container item xs={10} justify={'center'}>
                        <Tooltip title={"Log Out"}>
                            <Button onClick={logout} className={styles.logout_button}>
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
                
            </Grid>
        </Grid>
    );
};


export default NavBar;