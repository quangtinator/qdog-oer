import React from 'react';
import {useSelector} from "react-redux";
import MainMenu from "./pages/mainmenu/MainMenu";
import HighScoreBoard from "./pages/high_score/HighScoreBoard";
import HowToPlay from "./pages/how_to_play/HowToPlay";
import Story from "./pages/playground/story/Story";
import UserFeedback from './pages/feedback/UserFeedback';
import Certificate from "./pages/certificate/Certificate";
import ChooseCycle from "./pages/OER_Cycles/ChooseCycle";
import ChooseLevelCreateOER from './pages/playground/choose_level/ChooseLevelCreateOER';
import ChooseLevelUseOER from './pages/playground/choose_level/ChooseLevelUseOER';
import ChooseLevelEditOER from './pages/playground/choose_level/ChooseLevelEditOER';
import ChooseLevelDistributeOER from './pages/playground/choose_level/ChooseLevelDistributeOER';


const Game = () => {
    const current_page = useSelector(state => state.current_page);
    switch (current_page) {
        case 'main_menu':
            return (
                <MainMenu/>
            );
        case 'high_score_board':
            return (
                <HighScoreBoard/>
            );
        case 'how_to_play':
            return (
                <HowToPlay/>
            );
        case 'story':
            return (
                <Story/>
            );
        case 'feedback':
            return (
                <UserFeedback/>
            );
        case 'certificate':
            return (
                <Certificate/>
            );
        case 'choose_cycle':
            return (
                <ChooseCycle/>
            );
        case 'create_oer':
            return (
                <ChooseLevelCreateOER/>
            );
        case 'use_oer':
            return (
                <ChooseLevelUseOER/>
            );
        case 'edit_oer':
            return (
                <ChooseLevelEditOER/>
            );
        case 'distribute_oer':
            return (
                <ChooseLevelDistributeOER/>
            );
    }
};

export default Game;