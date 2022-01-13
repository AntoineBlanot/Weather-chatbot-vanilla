const patternDict = [{
        pattern : '\\b(?<greeting>Hi|Hello|Hey)\\b',
        intent : 'Hello'
    }, {
        pattern :'\\b(bye|exit)\\b',
        intent : 'Exit'
    }, {
        pattern : '\\b((weather\\s(like\\s)?)|(is\\sit\\s[a-z]+\\s))in\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)\\s\\b(?<time>tomorrow|today)',
        intent : 'weather forecast'
    }, {
        pattern : '\\b((weather\\s(like\\s)?)|(is\\sit\\s[a-z]+\\s))in\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)',
        intent : 'weather current'
    }];
    
module.exports = patternDict;