const greeting = 'Hello, World!';

function sayHello() {
  console.log(greeting);
}

function getGreeting() {
  return greeting;
}

sayHello();

module.exports = { sayHello, getGreeting };
