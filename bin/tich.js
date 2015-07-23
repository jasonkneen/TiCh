#!/usr/bin/env node

var program = require('commander'),
    chalk = require('chalk'),
    updateNotifier = require('update-notifier'),
    fs = require("fs"),
    tiappxml = require('tiapp.xml'),
    pkg = require('../package.json'),
    xpath = require('xpath')

tich();

// main function
function tich() {

    // status command, shows the current config
    function status() {
        console.log('\n');
        console.log('Name: ' + chalk.cyan(tiapp.name));
        console.log('AppId: ' + chalk.cyan(tiapp.id));
        console.log('Version: ' + chalk.cyan(tiapp.version));
        console.log('GUID: ' + chalk.cyan(tiapp.guid));
        console.log('\n');
    }

    // select a new config by name
    function select(name, outfilename) {
        var regex = /\$tiapp\.(.*)\$/;

        if (!name) {
            if (fs.existsSync('./app/config.json')) {
                var alloyCfg = JSON.parse(fs.readFileSync("./app/config.json", "utf-8"));

                if (alloyCfg.global.theme) {
                    console.log('\nFound a theme in config.json, trying ' + chalk.cyan(alloyCfg.global.theme));
                    select(alloyCfg.global.theme);
                } else {
                    status();
                }
            }
        } else {
            // find the config name specified
            cfg.configs.forEach(function(config) {

                if (config.name === name) {
                    console.log('\nFound a config for ' + chalk.cyan(config.name) + '\n');

                    for (var setting in config.settings) {

                        if (!config.settings.hasOwnProperty(setting)) continue;

                        if (setting != "properties" && setting != "raw") {

							var now = new Date();
                            var replaceWith = config.settings[setting]
                                .replace('$DATE$', now.toLocaleDateString())
                                .replace('$TIME$', now.toLocaleTimeString())
                                .replace('$DATETIME$', now.toLocaleString())
                                .replace('$TIME_EPOCH$', now.getTime().toString());

                            var matches = regex.exec(replaceWith);

                            if (matches && matches[1]) {
                                var propName = matches[1];
                                replaceWith = replaceWith.replace(regex, tiapp[propName]);
                            }

                            tiapp[setting] = replaceWith;

                            console.log('Changing ' + chalk.cyan(setting) + ' to ' + chalk.yellow(replaceWith));
                        }

                    }

                    if (config.settings.properties) {
                        for (var property in config.settings.properties) {

                            if (!config.settings.properties.hasOwnProperty(property)) continue;

                            var replaceWith = config.settings.properties[property]
                                .replace('$DATE$', new Date().toLocaleDateString())
                                .replace('$TIME$', new Date().toLocaleTimeString())
                                .replace('$DATETIME$', new Date().toLocaleString())
                                .replace('$TIME_EPOCH$', new Date().getTime().toString());


                            var matches = regex.exec(replaceWith);
                            if (matches && matches[1]) {
                                var propName = matches[1];
                                replaceWith = replaceWith.replace(regex, tiapp[propName]);
                            }

                            tiapp.setProperty(property, replaceWith);

                            console.log('Changing App property ' + chalk.cyan(property) + ' to ' + chalk.yellow(replaceWith));

                        }
                    }

                    if (config.settings.raw) {
                        var doc = tiapp.doc;
                        var select = xpath.useNamespaces({
                            "ti": "http://ti.appcelerator.org",
                            "android": "http://schemas.android.com/apk/res/android"
                        });
                        for (var path in config.settings.raw) {

                            if (!config.settings.raw.hasOwnProperty(path)) continue;

                            var node = select(path, doc, true);
                            if (!node) {
                                console.log(chalk.yellow('Could not find ' + path + ", skipping"));
                                continue;
                            }

                            var replaceWith = config.settings.raw[path]
                                .replace('$DATE$', new Date().toLocaleDateString())
                                .replace('$TIME$', new Date().toLocaleTimeString())
                                .replace('$DATETIME$', new Date().toLocaleString())
                                .replace('$TIME_EPOCH$', new Date().getTime().toString());


                            var matches = regex.exec(replaceWith);
                            if (matches && matches[1]) {
                                var propName = matches[1];
                                replaceWith = replaceWith.replace(regex, tiapp[propName]);
                            }

                            

                            if (typeof(node.value) === 'undefined'){
                                node.firstChild.data = replaceWith;
                            }
                            else{
                                node.value = replaceWith;
                            }

                            console.log('Changing Raw property ' + chalk.cyan(path) + ' to ' + chalk.yellow(replaceWith));

                        }
                    }

                    console.log(chalk.green('\n' + outfilename + ' updated\n'));

                    tiapp.write(outfilename);

                }
            });

            //console.log(chalk.red('\nCouldn\'t find a config called: ' + name + '\n'));

        }
    }

    // setup CLI
    program
        .version(pkg.version, '-v, --version')
        .usage('[options]')
        .description(pkg.description)
        .option('-l, --list', 'Lists the configurations in the project folder')
        .option('-f, --cfgfile <path>', 'Specifies the tich config file to use')
        .option('-i, --in <path>', 'Specifies the file to read (default: tiapp.xml)')
        .option('-o, --out <path>', 'Specifies the file to write (default: tiapp.xml)')
        .option('-s, --select <name>', 'Updates TiApp.xml to config specified by <name>')
        //.option('-c, --capture <name>', "Stores the current values of TiApp.xml id, name, version as <name> ")

    program.parse(process.argv);

    var cfgfile = program.cfgfile ? program.cfgfile : 'tich.cfg';
    var infile = program.in ? program.in : './tiapp.xml';
    var outfile = program.out ? program.out : './tiapp.xml';

    // check that all required input paths are good
    [cfgfile, infile].forEach(function (file) {
        if (!fs.existsSync(file)) {
            console.log(chalk.red('Cannot find ' + file));
            program.help();
        }
    });

    // read in our config
    var cfg = JSON.parse(fs.readFileSync(cfgfile, "utf-8"));

    // read in the app config
    var tiapp = tiappxml.load(infile);

    // check for a new version
    updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
    }).notify();

    // LIST command - show the list of config items
    if (program.list) {
        cfg.configs.forEach(function(config) {
            console.log(chalk.cyan(config.name + ' - ' + chalk.grey('Name: ') + config.settings.name + ' ' + chalk.grey('Id: ') + config.settings.id + ' ' + chalk.grey('Version: ') + config.settings.version));
        });

    // select command, select based on the arg passed
    } else if (program.select) {

        select(program.args[0], outfile);

    // capture command - this will store the current TiApp.xml settings
    } else if (program.capture) {
        // coming soon!

    } else {

        status();

    }

}

