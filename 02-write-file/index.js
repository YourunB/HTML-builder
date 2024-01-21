const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

process.stdout.write('Hello reviewer! Please enter your text:\n');

const file = path.join(__dirname, 'text.txt');
const fileStream = fs.createWriteStream(file);

function close() {
  stdout.write(`\nThe program is completed.`);
  process.exit();
}

process.on('SIGINT', close);

stdin.on('data', (data) => {
  const text = data.toString();
  if (text.trim() === 'exit' || text.trim() === 'EXIT') {
    close();
  } else {
    fileStream.write(`${text}\n`);
  }
});