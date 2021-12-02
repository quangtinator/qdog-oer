import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {useDrop} from "react-dnd";
import {item_types, color, game_types} from "../../../../definitions/Types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ResourceInPracticeEditing from "./ResourceInPracticeEditing";
import ChooseLicenseDialog from "../../dialog/ChooseLicenseDialog";
import ConfirmSubmissionDialog from "../../dialog/ConfirmSubmissionDialog";
import {
    open_confirm_submission_dialog,
} from "../../../../redux_slices/ConfirmSubmissionDialogSlice";
import {
    open_choose_license_dialog,
    select_license,
    set_message_for_choose_license_dialog
} from "../../../../redux_slices/ChooseLicenseDialogSlice";
import {checkCompatible} from "../../../../utils/Requests";
import {system_button_background, practice_lava_frame, story_background, story_question} from "../../../../images";
import Slide from "@material-ui/core/Slide";
import {get_success_message, get_fail_message} from "../../../../utils/GetMessage";
import {set_game_mode} from "../../../../redux_slices/CurrentGameModeSlice";
import SureToSkipDialog from "../../dialog/SureToSkipDialog";
import {set_result_for_level} from "../../../../redux_slices/GameProgressSlice";
import useSound from 'use-sound';
import correct_sound from '../../../../sound/correct_sound.wav';
import wrong_sound from '../../../../sound/wrong_sound.mp3';
import click_sound from '../../../../sound/click_sound.wav';

const useStyles = makeStyles((theme) => ({
    practice_editing_container: {
        'margin-top': '7vh'
    },
    root: {
        'height': '100%',
        'background-image': `url(${story_background})`,
        'background-size': '100% 100%'
    },
    description: {
        'color': color.WHITE,
        'font-size': '2vh'
    },
    description_container: {
        'background-image': `url(${story_question})`,
        'background-size': '100% 100%',
        'height': '9vh',
        'margin-bottom': '1vh'
    },
    result_box: {
        'background-image': `url(${practice_lava_frame})`,
        'background-size': '100% 100%',
        'height': '22vh',
        'margin-top': '2.5vh'
    },
    button_container: {
        'position': 'absolute',
        'bottom': '2.5vh'
    },
    button: {
        'background-image': `url(${system_button_background})`,
        'background-size': '100% 100%',
        'height': '6vh',
        'font-size': '1.8vh',
        'color': color.WHITE
    }
}));

const initChosenResourcesArray = (arr) => {
    return arr.map((elem) => {
        return {
            resource_id: elem.resource_id,
            license: elem.license,
            has_been_chosen: false
        }
    });
};

function PracticeEditing(props) {
    const styles = useStyles();
    const dispatch = useDispatch();
    const current_challenge = useSelector(state => state.current_challenge);
    const go_to_next_level = props.go_to_next_level;
    const practice = props.practice;
    const show_up = props.show_up;
    const choose_license_dialog = useSelector(state => state.choose_license_dialog);
    const [chosenResourcesArray, setChosenResourcesArray] = useState(initChosenResourcesArray(practice.resources));
    const [is_skip_dialog_opening, set_is_skip_dialog_opening] = useState(false);
    const [play_correct] = useSound(correct_sound, { volume: 0.25 });
    const [play_wrong] = useSound(wrong_sound, { volume: 0.25 });
    const [play_click] = useSound(click_sound, { volume: 0.25 });

    const has_resources_been_chosen = (resource_id) => {
        const resource = chosenResourcesArray.find(element => element.resource_id === resource_id);
        if (resource) {
            return resource.has_been_chosen;
        }
        // it does not matter if the following line return true or false.
        return false;
    };

    const click_on_submit_button = (e) => {
        e.preventDefault();
        let licenseArray = [];

        for (let i = 0; i < chosenResourcesArray.length; i++) {
            if (chosenResourcesArray[i].has_been_chosen) {
                licenseArray.push(chosenResourcesArray[i].license);
            }
        }

        if (licenseArray.length < practice.number_of_required_resource) {
            alert('Please put more resources on the lava');
            return;
        }

        let user_answer = choose_license_dialog.selected_license;
        let combination_type = practice.type === game_types.PRACTICE_EDITING_COLLAGE ? 'collage' : 'composition';
        checkCompatible(window.accessToken, combination_type, licenseArray, user_answer)
            .then(res => {
                if (res.hasOwnProperty('result') && res.result) {
                    dispatch(open_confirm_submission_dialog({correctness: true, message: get_success_message()}));
                    dispatch(set_result_for_level({level: current_challenge.level, result: null}));
                    play_correct();
                } else {
                    dispatch(open_confirm_submission_dialog({correctness: false, message: get_fail_message()}));
                    play_wrong();
                }
            })
            .catch(e => console.log(e));
    };

    const on_click_remove_resource = (resource_id) => {
        let new_resources = chosenResourcesArray.map(resource => {
            if (resource.resource_id === resource_id) {
                resource.has_been_chosen = false;
            }
            return resource
        });
        setChosenResourcesArray(new_resources);
    };

    const [{isOver}, drop] = useDrop({
        accept: item_types.PRACTICE_RESOURCE,
        drop: (item, monitor) => {
            let new_resources = chosenResourcesArray.map(resource => {
                if (resource.resource_id === item.resource_id) {
                    resource.has_been_chosen = true;
                }
                return resource
            });
            setChosenResourcesArray(new_resources);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    });

    const click_on_next = (e) => {
        e.preventDefault();
        play_click();
        
        let licenseArray = [];

        for (let i = 0; i < chosenResourcesArray.length; i++) {
            if (chosenResourcesArray[i].has_been_chosen) {
                licenseArray.push(chosenResourcesArray[i].license);
            }
        }

        if (licenseArray.length < practice.number_of_required_resource) {
            dispatch(open_confirm_submission_dialog({
                    correctness: false,
                    message: 'Not enough resources on the lava',
                    is_last_level: false,
                }
            ));
        } else {
            dispatch(select_license('none'));
            dispatch(open_choose_license_dialog());
            let licenses_to_be_combined = '';
            for (let i = 0; i < licenseArray.length; i++) {
                if (i === 0) {
                    licenses_to_be_combined = licenseArray[i].toUpperCase();
                } else {
                    licenses_to_be_combined += ' + ' + licenseArray[i].toUpperCase();
                }
            }
            let combination_type = practice.type === game_types.PRACTICE_EDITING_COLLAGE ? 'collage' : 'composition';
            dispatch(set_message_for_choose_license_dialog(
                <p>
                    Please choose a license for the {combination_type} of:
                    <br/>
                    {licenses_to_be_combined}
                </p>
            ));
        }
    };

    useEffect(() => {
        setChosenResourcesArray(initChosenResourcesArray(practice.resources));
    }, [practice.id]);

    useEffect(() => {
        dispatch(set_game_mode(game_types.PRACTICE))
    });

    return (
        <Grid container item direction={'row'} justify={'center'} className={styles.root}>
            <Grid container item direction={'column'} alignItems={'center'} spacing={10}
                  className={styles.practice_editing_container}>
                <ChooseLicenseDialog click_on_submit_button={click_on_submit_button}/>
                <ConfirmSubmissionDialog go_to_next_level={go_to_next_level}/>
                <SureToSkipDialog go_to_next_level={go_to_next_level} is_skip_dialog_opening={is_skip_dialog_opening}
                                  set_is_skip_dialog_opening={set_is_skip_dialog_opening}/>
                <Grid container item justify={'center'}>
                    <Slide direction={'down'} in={show_up} mountOnEnter unmountOnExit>
                        <Grid container item direction={'row'} className={styles.description_container} xs={10}
                              justify={'center'}
                              alignItems={'center'}>
                            <Grid item className={styles.description}>{practice.description}</Grid>
                        </Grid>
                    </Slide>
                    <Slide direction={'down'} in={show_up} mountOnEnter unmountOnExit>
                        <Grid container item direction={'row'} justify={'space-around'} alignItems={'center'}
                              className={styles.result_box} xs={10} ref={drop}>
                            {
                                practice.resources.map((resource) => {
                                    if (has_resources_been_chosen(resource.resource_id)) {
                                        const key = 'practice_resource.' + resource.resource_id;
                                        return (
                                            <ResourceInPracticeEditing key={key}
                                                                       width={'50px'}
                                                                       height={'50px'}
                                                                       resource_type={resource.resource_type}
                                                                       license={resource.license}
                                                                       resource_id={resource.resource_id}
                                                                       on_click_remove_resource={on_click_remove_resource}
                                                                       inside_the_result_box={true}
                                            />
                                        );
                                    }
                                })
                            }
                        </Grid>
                    </Slide>
                </Grid>
                <Slide direction={'up'} in={show_up} mountOnEnter unmountOnExit>
                    <Grid container item justify={'center'} spacing={4}>
                        {
                            practice.resources.map((resource) => {
                                if (!has_resources_been_chosen(resource.resource_id)) {
                                    const key = 'practice_resource.' + resource.resource_id;
                                    return (
                                        <ResourceInPracticeEditing key={key}
                                                                   width={'100px'}
                                                                   height={'100px'}
                                                                   resource_type={resource.resource_type}
                                                                   license={resource.license}
                                                                   resource_id={resource.resource_id}
                                                                   on_click_remove_resource={on_click_remove_resource}

                                        />
                                    );
                                }
                            })
                        }
                    </Grid>
                </Slide>
                <Slide direction={'up'} in={show_up} mountOnEnter unmountOnExit>
                    <Grid container item justify={'space-around'} className={styles.button_container}>
                        <Grid item xs={4}>
                            <Button fullWidth onClick={click_on_next}
                                    className={styles.button}>Next</Button>

                        </Grid>
                    </Grid>
                </Slide>
            </Grid>
        </Grid>
    );
}

export default PracticeEditing;