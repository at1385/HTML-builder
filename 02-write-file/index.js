const path = require('path');
const fs = require('fs');
const { stdout, stdin, exit } = process;

const KeyWord = {
  EXIT: 'exit',
};

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Hello! You can enter any text to save to "text.txt" or "exit" or Ctrl+C to exit the program:\n');

stdin.on('data', data => {  
  if (data.toString().trim() !== KeyWord.EXIT) {
    writeStream.write(data);
  } else {
    stdout.write('You are out of the program. Good bye!');
    exit();
  }
});

process.on('SIGINT', () => {
  stdout.write('You are out of the program. Good bye!');
  exit();
});
