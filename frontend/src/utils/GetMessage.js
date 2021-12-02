const SUCCESS_MESSAGES = ['Congratulation!', 'Good job!', 'Well done'];
const FAIL_MESSAGES = ['That was close', 'Let\'s give it another try', 'Please try again'];
const END_GAME_MESSAGE = `Thank you my dear friend. The Queen is very satisfied with the gift. The whole realm owns
    you this. You can now click on Certificate to receive the Queen's present!`;


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const get_success_message = () => {
    return SUCCESS_MESSAGES[getRandomInt(SUCCESS_MESSAGES.length)];
};

const get_fail_message = () => {
    return FAIL_MESSAGES[getRandomInt(FAIL_MESSAGES.length)];
};

const get_end_game_message = () => {
    return END_GAME_MESSAGE;
};

export {get_success_message, get_fail_message, get_end_game_message}