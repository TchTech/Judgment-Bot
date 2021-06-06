const { group, test, command, beforeStart, afterAll, expect } = require("corde");
// You can also import const corde = require("corde"); This is a default export with all others
// functions.
const { client, loginBot } = require("../train.js");

beforeStart(() => {
  loginBot();
});

group("main commands", () => {
  test("hello command should return 'Hello!!'", () => {
    expect("hello").toReturn("Hello!!");
  });
});

afterAll(() => {
  client.destroy();
});