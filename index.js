#!/usr/bin/env node

const axios = require('axios');
const yargs = require('yargs');

yargs.command({
  command: 'fetch',
  describe: 'Fetch the first 20 even-numbered TODOs',
  handler: fetchTodos
}).argv;

async function fetchTodos() {
  try {
    const todoPromises = [];
    for (let i = 2; i <= 40; i += 2) {
      todoPromises.push(axios.get(`https://jsonplaceholder.typicode.com/todos/${i}`));
    }

    const todos = await Promise.allSettled(todoPromises);

    todos.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { title, completed } = result.value.data;
        console.log(`Title: ${title} - Completed: ${completed}`);
      } else {
        console.error(`Failed to fetch TODO ${index * 2 + 2}: ${result.reason}`);
      }
    });
  } catch (error) {
    throw new Error("Error fetching TODOs");
  }
}

module.exports = { fetchTodos };