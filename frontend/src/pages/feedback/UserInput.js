import React from 'react';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {color} from "../../definitions/Types";
import Form from "react-bootstrap/Form";

const useStyles = makeStyles((theme) => ({
    container: {
        'height': '10vh',
        'z-index': '1',
    },
    user_input_container: {
        'color': color.WHITE,
        'font-size': '1.6vh',
        'z-index': '1',
    },
    text_area: {
        'position': 'relative',
        'font-size': '1.6vh',
        'z-index': '1',
        'top': '3vh',
        'left': '5vh',
        'height': '100%',
        'width': '75vh',
    },
    label: {
        'position': 'relative',
        'top': '1vh',
        'left': '5vh',
        'font-size': '1.8vh'
    }

}));

const UserInput = (props) => {
    const styles = useStyles();
    const display_label = props.display_label;
    const alias = props.alias;
    const onChange = props.onChange;

    return (
        <Grid container item xs={12} className={styles.container}>
            <Grid container xs={12} className={styles.user_input_container}>
                <Grid container item xs={12} className={styles.label}>
                        {display_label}
                </Grid>
    
                <Form.Group container item xs={12} fullWidth>
                    <Form.Control as='textarea'
                                  rows = '7'
                                  onChange= {(e) => onChange(alias,e)}
                                  className={styles.text_area}>
                    </Form.Control>
                </Form.Group>
            </Grid>
        </Grid>
    );
};

export default UserInput;