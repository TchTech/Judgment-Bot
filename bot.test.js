//const bot = require("./bot")
const getAddedUsers = require("./src/getAddedUsers").getAddedUsers

//jest.setTimeout(10000)

test('Check for keklol (274930301917069313) in getAddedUser()', () => {
    return getAddedUsers().then((users)=>{
        expect(users.includes("274930301917069313")).toBe(true)
    })
});

test('Check for xchromon (800006027679498260) in getAddedUser()', () => {
    return getAddedUsers().then((users)=>{
        expect(users.includes("800006027679498260")).toBe(true)
    })
});

test('Try to check not id (10101010) in getAddedUser()', () => {
    return getAddedUsers().then((users)=>{
        expect(users.includes("10101010")).toBe(false)
    })
});