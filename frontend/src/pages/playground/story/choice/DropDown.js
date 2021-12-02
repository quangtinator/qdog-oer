import React from 'react';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {story_choice} from "../../../../images";
import Slide from "@material-ui/core/Slide";
import {color} from "../../../../definitions/Types";
import Form from "react-bootstrap/Form";
import answerArray from './DropDownAnswer';

const useStyles = makeStyles((theme) => ({
    choice: {
        'height': '12vh'
    },
    chosen_choice: {
        'background-color': color.GREEN
    },
    choice_drop_down_container: {
        'backgroundImage': `url(${story_choice})`,
        'background-size': '100% 100%',
        'color': color.WHITE,
        'font-size': '1.6vh',
        'z-index': '1',
    },
    choice_drop_down: {
        'position': 'relative',
        'font-size': '1.6vh',
        'z-index': '1',
        'top': '4vh',
        'left': '6vh',
    },
    label: {
        'position': 'relative',
        'top': '4.5vh',
        'left': '5vh',
        'font-size': '1.8vh'
    }
}));


const DropDown = (props) => {
    const styles = useStyles();
    const display_label = props.display_label;
    const showUp = props.show_up;

    const handleAnswerArrayOnChange = (e) => {
        e.preventDefault();
        answerArray[props.index] = e.target.value;
        console.log(answerArray);
    }
    
    //replace with {value} and ${label} for code recycle in next iteration

    return (
        <Slide direction={'up'} in={showUp} mountOnEnter unmountOnExit>
            <Grid container item xs={5} className={styles.choice}>
                <Grid container className={styles.choice_drop_down_container}>
                    <Grid container item xs={2} className={styles.label}>
                        {display_label}
                    </Grid>
                    <Form.Group>
                        <Form.Control as='select'
                                      onChange= {(e) => handleAnswerArrayOnChange(e)}
                                      className={styles.choice_drop_down}>
                            <option>Choose correct answer</option>
                            <option value="ma">MAESTER ANDERSON</option>
                            <option value="s">SENTINEL</option>                 
                            <option value="dh">DRAGON HILT</option>
                            <option value="ia">ICE ASPECT</option>
                        </Form.Control>
                    </Form.Group>
                </Grid>
            </Grid>
        </Slide>
    );
};

export default DropDown;