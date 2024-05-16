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

    const todos = await Promise.all(todoPromises);

    todos.forEach(todo => {
      const { title, completed } = todo.data;
      console.log(`Title: ${title} - Completed: ${completed}`);
    });
  } catch (error) {
    console.error('Error fetching TODOs:', error);
    throw error;
  }
}
