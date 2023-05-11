const shop_schedule = [
    {
        day: 'Mon',
        open: '07:00 AM',
        close: '07:00 PM'
    },
    {
        day: 'Tue',
        open: '07:00 AM',
        close: '07:00 PM'
    },
    {
        day: 'Thu',
        open: '7:00 AM',
        close: '7:00 PM'
    },
    {
        day: 'Fri',
        open: '7:00 AM',
        close: '7:00 PM'
    }
]

function getHoursMinutes(str) { //take string 7:00 AM and get hours and minutes out of it.

    let n = 0;
    str = str.split(' ');   //get ['7:00' : 'AM']
    if (str[1] == 'PM') //if it is in 'PM' convert to 24 format
        n = 12;

    return {
        hour: Number(str[0].split(':')[0]) + n,
        minute: Number(str[0].split(':')[1])
    }   //return hours and minutes
}



function convertToMills(time) {
    return (((time.hour * 60 * 60) + (time.minute * 60)) * 1000);
}

function getResponse(enteredTime) {
    let response = {};
    let weekDay = enteredTime.toLocaleDateString('en-US', { weekday: 'short' });    //get today's week day in short form (ex. Mon, Fri)


    let foundDay = shop_schedule.find((d) => {
        return d.day == weekDay
    }); //check if today's day exists in shop'schedule


    if (foundDay === undefined) {   //if it does not
        response.message = 'Unfortunately we are closed.';
        response.emoji = '😢';  //then store "closed"
    }
    else {  //if it does exists

        let start = convertToMills(getHoursMinutes(foundDay.open));  //convert shop's opening time to milliseconds
        let end = convertToMills(getHoursMinutes(foundDay.close));  //convert shop's closing time to milliseconds
        let now = convertToMills({ hour: enteredTime.getHours(), minute: enteredTime.getMinutes() });   //convert entered time to milliseconds

        if (start <= now && now <= end) {   //if we are between current and closing time
            response.message = 'YAY! We are open.';
            response.emoji = '😍';  //then store open
        }

        else {//else store closed
            response.message = 'Unfortunately we are closed.';
            response.emoji = '😢';
        }
    }
    return response;
}

module.exports = { getHoursMinutes, convertToMills, getResponse };