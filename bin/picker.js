const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const shell = require('shelljs');
const mkdirp = require('mkdirp');
const path = require('path');

const codePicker = async () => {

  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }

  console.log(
    chalk.green(
      figlet.textSync("Wecome to Code Picker")
    )
  );

  const questions = [
    {
      name: 'remote',
      type: 'input',
      message: 'which repository do you want to pick ?'
    },
    {
      name: 'target',
      type: 'input',
      message: 'what the positive file path that you want to pick ?'
    },
    {
      name: 'localpath',
      type: 'input',
      message: 'where do you want to save the code ?'
    }
  ];

  const answers = await inquirer.prompt(questions);
  const { remote, target } = answers;
  let { localpath } = answers;
  if (!path.isAbsolute(localpath)) {
    localpath = path.join(process.env.PWD, localpath);
  }
  mkdirp.sync(mkdirp);

  const { confirm } = await inquirer.prompt([
    {
      name: 'confirm',
      type: 'confirm',
      message: `code will save at ${localpath}`
    }
  ]);
  if (!confirm) {
    process.exit(1);
  }

  shell.exec(`git clone --depth 1 ${ remote } ${ localpath }`)
  shell.cd(`${ localpath }`);
  shell.exec(`git filter-branch --prune-empty --subdirectory-filter ${ target } HEAD`)
  shell.rm('-rf', '.git');

  console.log(chalk.green('success'));
}

codePicker();