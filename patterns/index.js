const patternDict = [{
        pattern : '\\b(?<greeting>Hi|Hello|Hey)\\b',
        intent : 'Hello'
    }, {
        pattern :'\\b(bye|exit)\\b',
        intent : 'Exit'
    }, {
        pattern : '\\b((weather\\s(like\\s)?)|(is\\sit\\s(?<type>freezing|cold|cool|warm|hot|very\\shot)\\s))in\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)\\s\\b(?<time>tomorrow|today)',
        intent : 'temperature forecast'
    }, {
        pattern : '\\b((weather\\s(like\\s)?)|(is\\sit\\s(?<type>freezing|cold|cool|warm|hot|very\\shot)\\s))in\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)',
        intent : 'temperature current'
    }, {
        pattern : '\\bwill\\sit\\sbe\\s[a-z]+\\sin\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)\\s\\b(?<time>tomorrow)',
        intent : 'weather forecast'
    }];
    
module.exports = patternDict;