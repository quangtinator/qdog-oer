let api_version = 'api/v1';
let BACKEND_BASE_URL_API = process.env.REACT_APP_BACKEND_BASE_URL + api_version;

const postFeedback = (token, feedback) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ feedback : feedback })
    };

    return fetch(BACKEND_BASE_URL_API + '/feedback', requestOptions)
        .then(res => {
            return res;
        })
        .catch(e => {
            throw (e);
        });
};

export {postFeedback}