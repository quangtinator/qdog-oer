import React, {useEffect, useRef, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import NavBar from './pages/navbar/NavBar';
import {makeStyles} from '@material-ui/core/styles';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {useDispatch} from "react-redux";
import {init_fetch_game_progress} from "./redux_slices/GameProgressSlice";
import {ToastProvider} from 'react-toast-notifications';
import Game from './Game';
import {background_music} from '../src/sound/index';
import Sound from 'react-sound';
import useSound from 'use-sound';
import click_sound from '../src/sound/click_sound.wav';

const useStyles = makeStyles(theme => {
    return {
        game: {
            'position': 'relative',
            'border': '1px solid black',
            'height': '100vh'
        },
        root: {
            'background-color': '#6d3003',
            'overflow': 'hidden'
        }
    }
});

function App() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const game = useRef(null);
    const [isPlaying, setIsPlaying] = useState('true');
    const [play_click] = useSound(click_sound, {volume: 0.25});

    /*
    Initializing to fetch game progress from data base
     */
    useEffect(() => {
        dispatch(init_fetch_game_progress());
    });

    const music = () => {
        play_click();
        setIsPlaying(!isPlaying);
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <ToastProvider autoDismissTimeout={5000}>
                <Grid container justify={'center'} className={styles.root}>
                    <Grid container item direction={'column'} alignItems={'center'} className={styles.game} xs={12}
                        md={6} ref={game}>
                        <Sound url={background_music}
                               playStatus={isPlaying? Sound.status.PLAYING : Sound.status.STOPPED}
                               playFromPosition={500}
                               loop={true}
                               volume={40}/>
                        <NavBar music={music}/>
                        <Game/>
                    </Grid>
                </Grid>
            </ToastProvider> 
        </DndProvider>
    );
}

export default App;
