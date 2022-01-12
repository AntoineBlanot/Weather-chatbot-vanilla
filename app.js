'use strict';

const Readline = require('readline'); // for including readline module in app
const rl = Readline.createInterface({ // for reading inputs
    input : process.stdin,
    output : process.stdout,
    terminal : false
});

const matcher = require('./matcher'); // matcher module
const weather = require('./weather'); // weather module

rl.setPrompt('> ');
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

            case 'get weather':
                console.log(`Weather in ${cb.entities.city} at ${cb.entities.time} is :`);
                break;

            case 'current weather':
                rl.setPrompt('');
                weather(cb.entities.city).then(res => {
                    console.log(`Current weather in ${res.name} is ${(res.main.temp-273.15).toFixed(1)}°C`);
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