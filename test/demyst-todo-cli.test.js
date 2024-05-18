const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { expect } = chai;

chai.use(sinonChai);

const { fetchTodos } = require('../index');

describe('CLI fetchTodos function', () => {
  let mock;

  before(() => {
    mock = new MockAdapter(axios);
  });

  after(() => {
    mock.restore();
  });

  it('should fetch the first 20 even-numbered TODOs and log their titles and completion status', async () => {
    // Create a mock response for the todos
    for (let i = 2; i <= 40; i += 2) {
      mock.onGet(`https://jsonplaceholder.typicode.com/todos/${i}`).reply(200, {
        title: `Todo ${i}`,
        completed: i % 4 === 0
      });
    }

    const logSpy = sinon.spy(console, 'log');

    await fetchTodos();

    // Verify that console.log was called 20 times
    expect(logSpy.callCount).to.equal(20);

    for (let i = 0; i < 20; i++) {
      const evenNumber = (i + 1) * 2;
      expect(logSpy.getCall(i).args[0]).to.equal(`Title: Todo ${evenNumber} - Completed: ${evenNumber % 4 === 0}`);
    }

    logSpy.restore();
  });

  it('should handle individual fetch errors and continue processing other requests', async () => {
    // Simulate network errors for specific TODOs
    for (let i = 2; i <= 40; i += 2) {
      if (i % 4 === 0) {
        mock.onGet(`https://jsonplaceholder.typicode.com/todos/${i}`).reply(404);
      } else {
        mock.onGet(`https://jsonplaceholder.typicode.com/todos/${i}`).reply(200, {
          title: `Todo ${i}`,
          completed: false
        });
      }
    }

    // Verify that console.log was called 10 times and error log was called 10 times
    const logSpy = sinon.spy(console, 'log');
    const errorSpy = sinon.spy(console, 'error');

    await fetchTodos();

    expect(logSpy.callCount).to.equal(10);
    expect(errorSpy.callCount).to.equal(10);
   
    errorSpy.restore();
    logSpy.restore();
  });
});
