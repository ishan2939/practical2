const functions = require('./functions.js');

exports.handle_get_request = (req, res) => {
    res.render('index', {
        response: {
            message: '',
            emoji: ''
        },
        time: ''
    });
}

exports.handle_post_request = (req, res) => {

    let EnteredTime = new Date(req.body.time);//get entered date

    let response = functions.getResponse(EnteredTime);//get response
    
    res.render('index', {//send the response
        response: response,
        time: req.body.time
    });
}