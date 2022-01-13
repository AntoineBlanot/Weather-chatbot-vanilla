'use strict';

const { Console } = require('console');
var jp = require('jsonpath');

const Readline = require('readline'); // for including readline module in app
const rl = Readline.createInterface({ // for reading inputs
    input : process.stdin,
    output : process.stdout,
    terminal : false
});

const matcher = require('./matcher'); // matcher module
const weather = require('./weather'); // weather module

rl.setPrompt('> ');
console.log("\x1b[33m",'\n--- Welcome user! How can I help you today? ---\n',"\x1b[0m");
rl.prompt();
rl.on('line', reply => {
    matcher(reply , cb => {
        switch(cb.intent){

            case 'Hello':
                console.log(`${cb.entities.greeting} there`);
                break;

            case 'Exit':
                console.log('You want to exit');
                process.exit();

            case 'temperature current':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {
                    var temp = res.main.temp - 273.15;
                    console.log("\x1b[31m",`It is ${getTemperatureExpression(temp)} in ${res.name}, with ${temp.toFixed(1)}°C.\n`,"\x1b[0m");
                    //console.log("\x1b[0m")
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
            
            case 'temperature forecast':
                rl.setPrompt('');
                weather.getForecast(cb.entities.city).then(res => {
                    var date = getDate(cb.entities.time);
                    var temp = jp.query(res, `$.list[?(@.dt_txt == "${date}")].main.temp`)[0]; // jsonpath query
                    
                    temp = temp - 273.15;
                    console.log(`In ${res.city.name} ${cb.entities.time}, it will be ${getTemperatureExpression(temp)} with ${temp.toFixed(1)}°C (data from ${date})\n`,"\x1b[0m");
                    //console.log("\x1b[0m")
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
    
            default:
                console.log('I did not understand your resquest, please try again');
        }
    });
    rl.prompt();
});

let getTemperatureExpression = (temp) => {
    if (temp < -20){
        return "freezing";
    } else if (temp < 0){
        return "very cold";
    } else if (temp < 15){
        return "cold";
    } else if (temp < 20){
        return "cool";
    } else if (temp < 25){
        return "warm";
    } else if (temp < 30){
        return "hot";
    } else {
        return "very hot";
    }
}

let getDate = (str) => {

    // new Date object
    let date_ob = new Date();

    var stamp;

    if (str == 'today'){
        stamp = 0 
    } else if (str == 'tomorrow'){
        stamp = 1
    } else {
        stamp = 40 // a redéfinir, cas ou l'utilisateur ne rentre ni today ni tomorrow (in x days par ex)
    }

    // adjust 0 before single digit date
    let day = ("0" + (date_ob.getDate() + stamp) % 30).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1 + Math.floor((date_ob.getDate() + stamp)/30))).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = ("0" + (date_ob.getHours() + 3 - (date_ob.getHours() % 3))).slice(-2)

    if (parseInt(hours) > 24)
    {
        hours = "00";
        day = ("0" + (parseInt(day) + 1)).slice(-2);
    }

    return `${year}-${month}-${day} ${hours}:00:00`
}