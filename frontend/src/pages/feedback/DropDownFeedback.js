import React from 'react';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {color} from "../../definitions/Types";
import Form from "react-bootstrap/Form";

const useStyles = makeStyles((theme) => ({
    choice: {
        'height': '1vh'
    },
    choice_drop_down_container: {
        'color': color.WHITE,
        'font-size': '1.6vh',
        'z-index': '1',
    },
    choice_drop_down: {
        'position': 'relative',
        'font-size': '1.6vh',
        'z-index': '1',
        'top': '1vh',
        'left': '6vh',
    },
    label: {
        'position': 'relative',
        'top': '1vh',
        'left': '5vh',
        'font-size': '1.8vh'
    }
}));

const DropDownFeedback = (props) => {
    const styles = useStyles();
    const display_label = props.display_label;
    const alias = props.alias;
    const onChange = props.onChange;

    return (
        <Grid container item xs={12} className={styles.choice}>
            <Grid container className={styles.choice_drop_down_container}>
                <Grid container item xs={8} className={styles.label}>
                        {display_label}
                </Grid>

                <Form.Group>
                    <Form.Control as='select'
                                  onChange= {(e) => onChange(alias, e)}
                                  className={styles.choice_drop_down}>
                            <option>Choose your opinion</option>
                            <option value="Strongly Agree">Strongly Agree</option>
                            <option value="Agree">Agree</option>                 
                            <option value="Neutral">Neutral</option>
                            <option value="Disagree">Disagree</option>
                            <option value="Strongly Disagree">Strongly Disagree</option>
                    </Form.Control>
                </Form.Group>

            </Grid>
        </Grid>
    );
};

export default DropDownFeedback;