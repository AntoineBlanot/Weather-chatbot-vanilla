const patternDict = [{
        pattern : '\\b(?<greeting>Hi|Hello|Hey|Good morning|Good afternoon)\\b',
        intent : 'Hello'
    }, {
        pattern :'\\b(bye|exit)\\b',
        intent : 'Exit'
    }, {
        pattern : '\\b((temperature\\s(like\\s)?)|(is\\sit\\s(?<type>freezing|cold|cool|warm|hot|very\\shot)\\s))in\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)\\s\\b(?<time>tomorrow)',
        intent : 'forecast temperature'
    }, {
        pattern : '\\b((temperature\\s(like\\s)?)|(is\\sit\\s(?<type>freezing|cold|cool|warm|hot|very\\shot)\\s))in\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)',
        intent : 'current temperature'
    }, {
        pattern : '\\bwill\\sit\\sbe\\s[a-z]+\\sin\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)\\s\\b(?<time>tomorrow)',
        intent : 'forecast weather'
    },{
        pattern : '\\bis\\sit\\s[a-z]+\\sin\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)\\s\\b(?<time>today)',
        intent : 'current weather'
    },{
        pattern : '\\buv\\s(score|index|indice)\\b\\sin\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)\\s\\b(?<time>today)',
        intent : 'uv index'
    },{
        pattern : '\\bair\\s(pollution|index|indice)\\b\\sin\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)',
        intent : 'air pollution'
    }
];
    
module.exports = patternDict;