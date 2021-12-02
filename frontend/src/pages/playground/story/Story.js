import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import lodash from 'lodash';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import challengeGenerator from '../../../utils/game_generator/Story';
import {
    to_level,
    prepare_choice_and_question_for_last_level,
    prepare_oer_resources
} from "../../../redux_slices/CurrentChallangeSlice";
import {set_practices_list} from "../../../redux_slices/CurrentPracticesListSlice";
import {
    open_confirm_submission_dialog,
    close_confirm_submission_dialog
} from "../../../redux_slices/ConfirmSubmissionDialogSlice";
import {
    open_choose_license_dialog,
    set_message_for_choose_license_dialog,
    close_choose_license_dialog,
    set_licenses_to_be_excluded_from_answer,
    select_license
} from "../../../redux_slices/ChooseLicenseDialogSlice";
import {set_result_for_level} from "../../../redux_slices/GameProgressSlice";
import {questionTypes, color, game_types} from '../../../definitions/Types';
import ChooseLicenseDialog from '../dialog/ChooseLicenseDialog';
import {checkCompatible, postProgress} from '../../../utils/Requests';
import Choice from './choice/Choice';
import DropDown from './choice/DropDown';
import Slide from '@material-ui/core/Slide';
import ConfirmSubmissionDialog from "../dialog/ConfirmSubmissionDialog";
import {
    story_description_image_container,
    story_talk_box,
    story_question,
    story_smith,
    story_next_button, story_background
} from '../../../images';
import {increase_time, reset_time} from "../../../redux_slices/TimerSlice";
import {set_score, submit_score} from "../../../redux_slices/ScoreSlice";
import {set_game_mode} from "../../../redux_slices/CurrentGameModeSlice";
import Introduction from "./Introduction";
import {get_success_message, get_fail_message, get_end_game_message} from "../../../utils/GetMessage";
import PracticeTheory from '../practice/theory/PracticeTheory';
import PracticeEditing from '../practice/editing/PracticeEditing';
import { set_current_page } from '../../../redux_slices/CurrentPage';
import {story_dialog} from "../../../images";
import answerArray from "../story/choice/DropDownAnswer";
import useSound from 'use-sound';
import correct_sound from '../../../sound/correct_sound.wav';
import wrong_sound from '../../../sound/wrong_sound.mp3';
import win_sound from '../../../sound/win_sound.wav';

const LAST_LEVEL = 24;

const useStyles = makeStyles((theme) => ({
    root: {
        'height': '100%',
        'background-image': `url(${story_background})`,
        'background-size': '100% 100%'
    },
    story_container: {
        'margin-top': '7vh'
    },
    context: {
        'backgroundImage': `url(${story_talk_box})`,
        'background-size': '100% 100%',
        'padding-top': '6vh',
        'padding-left': '5vw',
        'padding-right': '2.5vw',
        'height': '30vh',
        'font-size': '2.2vh'
    },
    picture: {
        'position': 'relative',
        'margin-top': '-11vh',
        [theme.breakpoints.up('sm')]: {
            'height': '26vh'
        },
        [theme.breakpoints.up('xl')]: {
            'height': '300px'
        }
    },
    image_container: {
        'position': 'absolute',
        'max-width': '14vw',
        'max-height': '26vh',
    },
    image: {
        'position': 'absolute',
        'max-width': '60%',
        'max-height': '60%'
    },
    question: {
        'z-index': '1',
        'backgroundImage': `url(${story_question})`,
        'background-size': '100% 100%',
        'color': color.WHITE,
        'padding-left': '4vw',
        'padding-right': '4vw',
        'height': '20vh',
        'font-size': '2.2vh'

    },
    next_button_container: {
        'position': 'absolute',
        'bottom': '7.5vh',
        'height': '12vh',
        'width': '12vh',
    },
    next_button: {
        'backgroundImage': `url(${story_next_button})`,
        'background-size': '100% 100%',
        'color': color.WHITE,
        'font-size': '2vh',
    },
    user_input: {
        'position': 'absolute',
        'background': color.WHITE,
        'background-size': '100% 100%',
        'left': '10vw',
        'top': '85vh',
    },
    smith: {
        'z-index': '0',
        'position': 'absolute',
        'max-width': '25vw',
        'top': '28vh',
        'left': '33vw'
    },
    choice_container: {
        'background-image': `url(${story_dialog})`,
        'background-size': '100% 100%',
        'position': 'absolute',
        'width': '25vw',
        'height': '30vh',
        'top': '50%',
        'left': '50%',
    }
}));


function Story() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const current_challenge = useSelector(state => state.current_challenge);
    const choose_license_dialog = useSelector(state => state.choose_license_dialog);
    const [chosenLicenses, setChosenLicenses] = useState([]);
    const nextChallenge = challengeGenerator(current_challenge.level + 1);
    const game_progress = useSelector(state => state.game_progress);
    const [finalLicense, setFinalLicense] = useState('');
    const [failTimes, setFailTimes] = useState(0);
    const [seen_introduction, set_seen_introduction] = useState(false);
    const [play_correct] = useSound(correct_sound, { volume: 0.25 });
    const [play_wrong] = useSound(wrong_sound, { volume: 0.25 });
    const [play_win] = useSound(win_sound, { volume: 0.25 });

    // Only used for questions requiring players to choose many answer (choices)
    const [choices, setChoices] = useState([
        {
            is_selected: false,
            color: 'none'
        },
        {
            is_selected: false,
            color: 'none'
        },
        {
            is_selected: false,
            color: 'none'
        },
        {
            is_selected: false,
            color: 'none'
        }
    ]);
    const [show_up, set_show_up] = useState({
        stable_content: true,
        unstable_content: true,
    });

    const [show_up_practice, set_show_up_practice] = useState(true);

    /*
        Open the dialog, in which players choose a license as their final answer
        @param [int] choiceNumbers
     */
    const prepare_and_then_open_choose_license_dialog = (choiceNumbers) => {
        let licenses_to_be_combined = current_challenge.oer_resources[0].toUpperCase();
        let newChosenLicenses = lodash.cloneDeep(chosenLicenses);
        for (let i = 0; i < choiceNumbers.length; i++) {
            newChosenLicenses.push(current_challenge.choices[choiceNumbers[i]].CC_license);
            if (i === choiceNumbers.length - 1) {
                licenses_to_be_combined += ' and ' + current_challenge.choices[choiceNumbers[i]].CC_license.toUpperCase();
            } else {
                licenses_to_be_combined += ', ' + current_challenge.choices[choiceNumbers[i]].CC_license.toUpperCase();
            }
        }
        setChosenLicenses(newChosenLicenses);
        dispatch(set_message_for_choose_license_dialog(
            <p>
                Please choose the license for the {current_challenge.combination_type} of
                <br/>
                {licenses_to_be_combined}
            </p>
        ));
        dispatch(select_license('none'));
        dispatch(open_choose_license_dialog());
    };

    const get_all_selected_choices = () => {
        let res = [];
        for (let i = 0; i < choices.length; i++) {
            if (choices[i].is_selected) {
                res.push(i);
            }
        }
        return res;
    };

    /*
        Unset the selected choices
        @params [int] choiceNumbers
     */
    const unselect_selected_choices = (choiceNumbers) => {
        let newChoices = lodash.cloneDeep(choices);
        choiceNumbers.forEach(choiceNumber => {
            newChoices[choiceNumber].is_selected = false;
        });
        setChoices(newChoices);
    };

    const click_on_submit_button = (e) => {
        e.preventDefault();
        const user_answer = choose_license_dialog.selected_license;
        checkCompatible(window.accessToken, current_challenge.combination_type, chosenLicenses.concat(current_challenge.oer_resources), user_answer)
            .then(res => {
                // Player correctly answered
                if (res.hasOwnProperty('result') && res.result) {
                    dispatch(close_choose_license_dialog());
                    dispatch(set_result_for_level({level: current_challenge.level, result: user_answer}));
                    unselect_selected_choices(get_all_selected_choices());
                    setFinalLicense(user_answer);
                    dispatch(open_confirm_submission_dialog(
                        {
                            is_last_level: nextChallenge === null,
                            correctness: true,
                            message: nextChallenge === null ? get_end_game_message() : get_success_message()
                        }
                    ));
                }
                // Wrong Answer
                else {
                    const message = failTimes < 2 ? get_fail_message() : current_challenge.hint;
                    dispatch(open_confirm_submission_dialog({correctness: false, message: message}));
                    setFailTimes(failTimes + 1);
                }
            })
            .catch(e => console.log(e));
    };

    const click_on_next_button = (e) => {
        e.preventDefault();
        if (answerArray[0] === current_challenge.choices[0].correct_answer &&
            answerArray[1] === current_challenge.choices[1].correct_answer &&
            answerArray[2] === current_challenge.choices[2].correct_answer &&
            answerArray[3] === current_challenge.choices[3].correct_answer) {
            dispatch(set_result_for_level({
                level: current_challenge.level,
                //result: current_challenge.choices[current_challenge.correctAnswer].CC_license
            }));
            dispatch(open_confirm_submission_dialog(
                {
                    is_last_level: nextChallenge === null,
                    correctness: true,
                    message: nextChallenge === null ? get_end_game_message() : get_success_message()
                }
            ));
            play_correct();
        } else {
            const message = failTimes < 2 ? get_fail_message() : current_challenge.hint;
            dispatch(open_confirm_submission_dialog({correctness: false, message: message}));
            setFailTimes(failTimes + 1);
            play_wrong();
        }
    };

    const count_the_number_of_selected_choices = () => {
        let count = 0;
        choices.forEach((choice) => {
            if (choice.is_selected) {
                count += 1;
            }
        });
        return count;
    };

    const click_on_a_choice = (choiceNumber) => {
        if (current_challenge.type === questionTypes.SELF_GENERATED) {
            prepare_and_then_open_choose_license_dialog([choiceNumber]);
        } else if (current_challenge.type === questionTypes.SELF_GENERATED_WITH_TWO_CHOICES) {
            if (choices[choiceNumber].is_selected) {
                unselect_selected_choices([choiceNumber]);
            } else if (count_the_number_of_selected_choices() <= 1) {
                let newChoices = [...choices];
                newChoices[choiceNumber].is_selected = true;
                setChoices(newChoices);
            }
        } else if (current_challenge.correctAnswer === choiceNumber) {
            dispatch(set_result_for_level({
                level: current_challenge.level,
                result: current_challenge.choices[current_challenge.correctAnswer].CC_license
            }));
            dispatch(open_confirm_submission_dialog(
                {
                    is_last_level: nextChallenge === null,
                    correctness: true,
                    message: nextChallenge === null ? get_end_game_message() : get_success_message()
                }
            ));
            if (nextChallenge === null) {
                play_win();
            } else {
                play_correct();
            }

        } else {
            const message = failTimes < 2 ? get_fail_message() : current_challenge.hint;
            dispatch(open_confirm_submission_dialog({correctness: false, message: message}));
            setFailTimes(failTimes + 1);
            play_wrong();
        }
    }; 

    /*
        @param bool enter enter = true means sliding in, enter = false means sliding out
     */
    const set_transition = (enter) => {
        set_show_up(prevState => (
            {
                ...prevState,
                stable_content: enter,
                unstable_content: enter
            }
        ));
    };

    const go_to_next_level = () => {
        let answer = null;
        if (current_challenge.type === game_types.STORY ) {
            answer = current_challenge.correctAnswer === null ? finalLicense : current_challenge.choices[current_challenge.correctAnswer].CC_license;
        }

        dispatch(close_confirm_submission_dialog());

        if (current_challenge.type === game_types.PRACTICE_EDITING_COLLAGE || current_challenge.type === game_types.PRACTICE_EDITING_COMPOSITION) {
            dispatch(close_choose_license_dialog());
        }

        dispatch(set_score(
            {
                type: game_types.STORY,
                story_level: current_challenge.level,
                failed_times: failTimes,
            }
        )).then(() => {
            postProgress(window.accessToken, {
                [current_challenge.level]: {
                    answer: answer,
                    failTimes,
                }
            })
                .then((res) => {
                    if (nextChallenge !== null) {
                        if (current_challenge.type !== game_types.STORY) {
                            set_show_up_practice(false);
                        }
                        set_transition(false);
                
                        // time out is required for exiting animation
                        setTimeout((() => {
                            if (current_challenge.type !== game_types.STORY) {
                                set_show_up_practice(true);
                            }

                            set_transition(true);
                            setFailTimes(0);
                            setChosenLicenses([]);

                            if (current_challenge.last_level_chapter) {
                                dispatch(set_current_page('choose_cycle'));
                            }
                            dispatch(to_level(current_challenge.level + 1));
                        }), 150);
                    } else {
                        dispatch(submit_score());
                    }
                    dispatch(reset_time());
                })
                .catch(err => {
                    console.log('err :>> ', err);
                });
        });
    };

    /*
    Get list of practices for each level. Necessary if players directly go to one of first three levels from the main menu
     */
    useEffect(() => {
        if (current_challenge.hasOwnProperty('practices')) {
            dispatch(set_practices_list(current_challenge.practices));
        }
    }, [current_challenge.level]);

    /*
    Set up required oer for each level. Only useful if a level takes the output of previous levels as its input
     */
    useEffect(() => {
        if (current_challenge.hasOwnProperty('require_result_of_levels')) {
            dispatch(prepare_oer_resources(game_progress));
        }
    }, [current_challenge.level]);

    /*
    special case, just for the 6th level
     */
    useEffect(() => {
        if (current_challenge.level === LAST_LEVEL && current_challenge.choices[current_challenge.correctAnswer].CC_license === null) {
            checkCompatible(window.accessToken, current_challenge.combination_type, current_challenge.oer_resources, 'check')
                .then(res => {
                    if (res.hasOwnProperty('correctAnswer') && res.correctAnswer) {
                        dispatch(prepare_choice_and_question_for_last_level({correctAnswer: res.correctAnswer}))
                    }
                })
                .catch(e => console.log(e));
        }
    });

    /*
     Exclude some licenses from answer according to requirement of the level
     */
    useEffect(() => {
        if (current_challenge.hasOwnProperty('licenses_to_be_excluded_from_answer')) {
            dispatch(set_licenses_to_be_excluded_from_answer(current_challenge.licenses_to_be_excluded_from_answer));
        } else {
            dispatch(set_licenses_to_be_excluded_from_answer([]));
        }
    }, [current_challenge.level]);

    // Start the timer
    useEffect(() => {
        let timer = setInterval(() => {
            dispatch(increase_time());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    });

    useEffect(() => {
        dispatch(set_game_mode(game_types.STORY));
    });

    if (current_challenge.level === 0 && !seen_introduction) {
        return (
            <Introduction set_seen_introduction={set_seen_introduction}/>
        );
    }

    else if (current_challenge.type === game_types.PRACTICE_THEORY) {
        return (
            <PracticeTheory practice={current_challenge} 
                            go_to_next_level={go_to_next_level}
                            show_up={show_up_practice}/>
        )
    }
    
    else if (current_challenge.type === game_types.PRACTICE_EDITING_COLLAGE || current_challenge.type === game_types.PRACTICE_EDITING_COMPOSITION) {
        return (
            <PracticeEditing practice={current_challenge}
                             go_to_next_level={go_to_next_level}
                             show_up={show_up_practice}/>
        )
    }

    else {
        return (
            <Grid container item direction={'row'} justify={'center'} className={styles.root}>
                <Grid container item direction={'row'} justify={'center'}
                      className={styles.story_container}>
                    <Slide direction={'left'} in={show_up.stable_content} mountOnEnter unmountOnExit>
                        <img className={styles.smith} src={story_smith}/>
                    </Slide>
                    <ConfirmSubmissionDialog go_to_next_level={go_to_next_level}/>
                    <ChooseLicenseDialog click_on_submit_button={click_on_submit_button}/>

                    <Grid container item direction={'row'} justify={'center'} xs={11}>
                        <Grid container item xs={11} justify={'flex-start'}>
                            <Slide direction={'right'} in={show_up.stable_content} mountOnEnter unmountOnExit>
                                <Grid container item xs={12} className={styles.context}
                                      justify={'center'}>
                                    {current_challenge.context}
                                </Grid>
                            </Slide>
                        </Grid>

                        <Grid container item xs={12} justify={'flex-start'}>
                            <Slide direction={'right'} in={show_up.unstable_content} mountOnEnter unmountOnExit>
                                <Grid container item xs={7} className={styles.picture} justify={'center'}
                                      alignItems={'center'}>
                                    <img className={styles.image_container} src={story_description_image_container}/>
                                    <img className={styles.image} src={current_challenge.description_image}/>
                                </Grid>
                            </Slide>
                        </Grid>

                        <Slide direction={'left'} in={show_up.unstable_content} mountOnEnter unmountOnExit>
                            <Grid container item className={styles.question} justify={'center'}
                                  alignItems={'center'} xs={11}>
                                {current_challenge.question}
                            </Grid>
                        </Slide>

                        <Grid container item xs={12} justify={'space-between'}>
                            {
                                current_challenge.type === questionTypes.MULTIPLE_CHOICE &&
                                [...Array(4).keys()].map(choiceNumber => {
                                    return (
                                        <Choice key={'storymode-choice-' + choiceNumber}
                                                click_on_a_choice={click_on_a_choice}
                                                display_text={current_challenge.choices[choiceNumber].display_text}
                                                choice_number={choiceNumber}
                                                is_selected={choices[choiceNumber].is_selected}
                                                show_up={show_up.unstable_content}/>
                                    )
                                })
                            }
                        </Grid>

                        <Grid container item xs={12} justify={'space-between'}>
                            {
                                current_challenge.type === questionTypes.DROP_DOWN_CHOICE &&
                                [...Array(4).keys()].map(index => {
                                    return (
                                        <DropDown display_label={current_challenge.choices[index].display_label}
                                                  index={index}
                                                  show_up={show_up.unstable_content}/>
                                    )
                                })
                            }
                        </Grid>

                        {
                            current_challenge.type === questionTypes.DROP_DOWN_CHOICE &&
                            <Slide direction={'up'} in={show_up.unstable_content} mountOnEnter unmountOnExit>
                                <Grid container item xs={12} justify={'center'}>
                                    <Grid container item className={styles.next_button_container}>
                                        <Button fullWidth className={styles.next_button}
                                                onClick={click_on_next_button}>Next</Button>
                                    </Grid>
                                </Grid>
                            </Slide>
                        }
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Story;
