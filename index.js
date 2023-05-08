const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname + '/public')))
app.use(express.urlencoded({ extended: true }));

const shop_schedule = [
    {
        day: 'Mon',
        open: '7:00 AM',
        close: '7:00 PM'
    },
    {
        day: 'Tue',
        open: '07:00 AM',
        close: '07:00 PM'
    },
    {
        day: 'Thu',
        open: '07:00 AM',
        close: '07:00 PM'
    },
    {
        day: 'Fri',
        open: '07:00 AM',
        close: '07:00 PM'
    }
]

function convert(str, n = 0) {//str=time and n= if convert to 24 hour format or not(if yes then add 12 to hours else add 0)
    str = str.split(':');
    return {
        hour: Number(str[0]) + n,
        minute: Number(str[1])
    }
}

app.get('/', (req, res) => {
    res.render('index', {
        response: {
            message: '',
            emoji: ''
        }
    });
});

app.post('/showifopen', (req, res) => {

    let EnteredTime = new Date(req.body.time);//get today's date
    let response = {};
    let weekDay = EnteredTime.toLocaleDateString('en-US', { weekday: 'short' });//get today's week day in short form (ex. Mon, Fri)

    let showTime = weekDay + ' ' + req.body.time.split('T')[0] + ' | ' + req.body.time.split('T')[1];//to show user time that they have entered on output
    let foundDay = shop_schedule.find((d) => {
        return d.day == weekDay
    });//check if today's day exists in shop'schedule

    if (foundDay === undefined) {//if it does not
        response.message = 'Unfortunately we are closed on ' + showTime;
        response.emoji = '😢';//then store "closed"
    }
    else {

        let splitOpenTime = foundDay.open.split(' '), splitCloseTime = foundDay.close.split(' ');//will have value like ['07:00', 'AM']

        let openTime = {}, closeTime = {};//create variables to store shop's opening and closing time in hours and minutes 

        if (splitOpenTime[1] == 'PM')//check if it's in PM
            openTime = convert(splitOpenTime[0], 12);//convert to 24 hours format and store hours and minutes
        else
            openTime = convert(splitOpenTime[0]);//else just store hour and minute format


        if (splitCloseTime[1] == 'PM')//do the same with closing time
            closeTime = convert(splitCloseTime[0], 12);
        else
            closeTime = convert(splitCloseTime[0]);


        let start = ((openTime.hour * 60 * 60) + (openTime.minute * 60)) * 1000;//convert shop's opening time to milliseconds
        let end = ((closeTime.hour * 60 * 60) + (closeTime.minute * 60)) * 1000;//convert shop's closing time to milliseconds
        let now = ((EnteredTime.getHours() * 60 * 60) + (EnteredTime.getMinutes() * 60)) * 1000;//convert current moments time to milliseconds

        if (start > end) {//check if start is > than end
            //scenario: let's say shop closed at 11 AM and will open at 7 PM then check accordingly

            if (end <= now && now <= start) {//check if we are currently between 11AM and 7PM store "close"
                response.message = 'Unfortunately we are closed on ' + showTime;
                response.emoji = '😢';
            }
            else {//else store "open"(if we are before 11 AM and after 7PM)
                response.message = 'YAY! We are open on ' + showTime;
                response.emoji = '😍';//if yes store "open"
            }
        }
        else {
            //else if scenario is normal(let's say shop opens at 10AM and closes at 7PM)

            if (start <= now && now <= end) {//check if we are currently between opening and closing time
                response.message = 'YAY! We are open on ' + showTime;
                response.emoji = '😍';//if yes store "open"
            }
            else {//else store "closed"
                response.message = 'Unfortunately we are closed on ' + showTime;
                response.emoji = '😢';
            }
        }
    }
    res.render('index', {//send the response
        response: response
    });
});

app.use('*', (req, res) => {
    res.redirect('/');
});

app.listen(3000, () => {
    console.log("Server started on port 3000...");
});