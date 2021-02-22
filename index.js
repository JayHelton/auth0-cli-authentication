const { Command } = require('commander');

const makeLoginCommand = require('./commands/login');

function main() {
  const program = new Command();
  program.version('0.0.1');
  
  const mycli = program.command('mycli');
  makeLoginCommand(mycli);
  program.parse(process.argv);
}

main();
