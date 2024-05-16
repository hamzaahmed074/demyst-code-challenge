const { exec } = require("child_process");
const { expect } = require("chai");
const nock = require("nock");
const response = require("./mock-response");
describe("demyst-todo-cli", function () {
  this.timeout(10000); // increase timeout due to possible network delay

  beforeEach(() => {
    // Mock the API responses for even-numbered TODOs
    for (let i = 2; i <= 40; i += 2) {
      nock("https://jsonplaceholder.typicode.com")
        .get(`/todos/${i}`)
        .reply(200, response[i]);
    }
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("should fetch the first 20 even-numbered TODOs and display their title and completion status", (done) => {
    exec("node ./index.js fetch", (error, stdout, stderr) => {
      if (error) {
        return done(error);
      }
      if (stderr) {
        return done(new Error(stderr));
      }

      // Split the output into lines
      const lines = stdout.trim().split("\n");

      // Check if there are exactly 20 lines
      expect(lines).to.have.lengthOf(20);
      lines.forEach((line, index) => {
        const todoIndex = (index + 1) * 2;
        const { title, completed } = response[todoIndex];
        const expectedLine = `Title: ${title} - Completed: ${completed}`;
        expect(line).to.equal(expectedLine);
      });
      done();
    });
  });

  it("should fetch TODOs correctly when there are network delays", (done) => {
    // Mock the API with a delay
    for (let i = 2; i <= 40; i += 2) {
      nock("https://jsonplaceholder.typicode.com")
        .get(`/todos/${i}`)
        .delay(100)
        .reply(200, response[i]);
    }

    exec("node ./index.js fetch", (error, stdout, stderr) => {
      if (error) {
        return done(error);
      }
      if (stderr) {
        return done(new Error(stderr));
      }

      // Split the output into lines
      const lines = stdout.trim().split("\n");

      // Check if there are exactly 20 lines
      expect(lines).to.have.lengthOf(20);

      // Check the format of each line
      lines.forEach((line, index) => {
        const todoIndex = (index + 1) * 2;
        const { title, completed } = response[todoIndex];
        expect(line).to.equal(`Title: ${title} - Completed: ${completed}`);
      });

      done();
    });
  });
});
