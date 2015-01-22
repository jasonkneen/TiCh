#!/usr/bin/env node

var program = require('commander'),
    chalk = require('chalk'),
    _ = require('lodash'),
    updateNotifier = require('update-notifier'),
    fs = require("fs"),
    tiappxml = require('tiapp.xml');

var pkg = require('../package.json')
    //clitest = require('../index');


if (!fs.existsSync('tiapp.xml')) {
    console.log(chalk.red('Please run in the Ti Project folder'));
} else if (!fs.existsSync('tich.cfg')) {
    console.log(chalk.red('No tich config!'));
} else {
    tich();
}

function tich() {

    var cfg = JSON.parse(fs.readFileSync("tich.cfg", "utf-8"));

    var tiapp = tiappxml.load('./tiapp.xml');

    program
        .version(pkg.version, '-v, --version')
        .usage('[options] [path]')
        .description(pkg.description)
        .option('-l, --list', 'Lists the configurations in the project folder')
        .option('-u, --use <name>', 'Switches the TiApp.xml to use the config specified')

    program.parse(process.argv);

    // check for a new version
    updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
    }).notify();

    if (program.list) {
        cfg.configs.forEach(function(config) {
            console.log(chalk.cyan(config.name + ' - ' + chalk.grey('Name: ') + config.settings.name + ' ' + chalk.grey('Id: ') + config.settings.id + ' ' + chalk.grey('Version: ') + config.settings.version));
        });
    }

    // process commands
    if (program.use) {

        // find the config
        cfg.configs.forEach(function(config) {

            if (config.name === program.args[0]) {
                console.log('\nFound a config for ' + chalk.cyan(config.name) + '\n');
                for (var prop in config.settings) {

                    tiapp[prop] = config.settings[prop];

                    console.log('Changing ' + chalk.cyan(prop) + ' to ' + chalk.yellow(config.settings[prop]))

                }

                console.log(chalk.green('\nTiApp.xml updated\n'));

                tiapp.write();

            }
        });
    }
}
