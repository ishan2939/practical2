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



function convertToHoursMinutes(ms) {    //convert milliseconds to hour and minutes   
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    return {
        hour: hours,
        minute: minutes
    }
}



function calculateLeftDays(enteredTime, weekDay) {
    //arguments = 1) user entered time, 2) which week day has user entered
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


    let i = days.findIndex((d) => d == weekDay);    //find out index of the weekDay from days array

    let j = 0, count = 0, flag = false;
    //count represents number of days between the entered day and the next day that shop is open
    //flag means found the day in schedule  
    //start the loop for days array
    for (j = 1; j < 8; j++) {
        flag = shop_schedule.find((s) => s.day == days[(i + j) % 7]);

        if (flag)
            break;
        else
            count++;
    }

    //check if start> end then assuming that shop will be open till 12 PM then there are no remaninghours for today
    let now = convertToMills({ hour: enteredTime.getHours(), minute: enteredTime.getMinutes() });   //convert added time to milliseconds
    let leftTimeForToday = convertToHoursMinutes(86400000 - now);   //find remaining time

    let openTime = getHoursMinutes(flag.open);  //get hours and minutes of next day open time

    let totalHours = leftTimeForToday.hour + openTime.hour; //find total hours
    let totalMinutes = leftTimeForToday.minute + openTime.minute;   //find total minutes

    if (totalMinutes >= 60) {   //handle minutes
        totalHours = totalHours + Math.floor(totalMinutes / 60);
        totalMinutes = Math.floor(totalMinutes % 60);
    }

    if (totalHours >= 24) { //handle hours
        count = count + Math.floor(totalHours / 24);
        totalHours = Math.floor(totalHours % 24);
    }
    return (((count > 0) ? `${count} Days` : '') + ((totalHours > 0) ? ` ${totalHours} hours` : '') + ((totalMinutes > 0) ? ` ${totalMinutes} minutes` : '') + '.');

}

function getResponse(enteredTime) {
    let response = {};
    let weekDay = enteredTime.toLocaleDateString('en-US', { weekday: 'short' });    //get today's week day in short form (ex. Mon, Fri)


    let foundDay = shop_schedule.find((d) => {
        return d.day == weekDay
    }); //check if today's day exists in shop'schedule


    if (foundDay === undefined) {   //if it does not
        response.message = 'Unfortunately we are closed. The shop will be open after ' + calculateLeftDays(enteredTime, weekDay);
        response.emoji = '😢';  //then store "closed"
    }
    else {

        let start = convertToMills(getHoursMinutes(foundDay.open));  //convert shop's opening time to milliseconds
        let end = convertToMills(getHoursMinutes(foundDay.close));  //convert shop's closing time to milliseconds
        let now = convertToMills({ hour: enteredTime.getHours(), minute: enteredTime.getMinutes() });   //convert current moments time to milliseconds
    
        let time = {};
        let message = '';

        if (start <= now && now <= end) {
            //check if we are currently between opening and closing time then calculate the remaining time in closing
            time = convertToHoursMinutes(end - now);
            
            message = (time.hour != 0 ? `${time.hour} Hours ` : '') + (time.minute != 0 ? `${time.minute} Minutes` : '') + '.';
            
            response.message = 'We are open. But shop will close within ' + message;
            response.emoji = '😍';
        }
        //else then calculate the remaining time in opening
        else if (start >= now) {//if we are before the opening time
            time = convertToHoursMinutes(start - now);

            message = (time.hour != 0 ? `${time.hour} Hours ` : '') + (time.minute != 0 ? `${time.minute} Minutes` : '') + '.';
            
            response.message = 'Unfortunately we are closed. The shop will be open after ' + message;
            response.emoji = '😢';
        }
        else {//if we are after closing time
            response.message = 'Unfortunately we are closed for today. The shop will open after ' + calculateLeftDays(enteredTime, weekDay);
            response.emoji = '😢';
        }

    }
    return response;
}

module.exports = { getHoursMinutes, convertToMills, convertToHoursMinutes, calculateLeftDays, getResponse };