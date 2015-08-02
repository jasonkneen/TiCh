# TiCh

Allows you to switch TiApp.xml configurations via the CLI

## Why?

Titanium + Alloy has the ability to theme apps, which is awesome when it comes to having multiple versions of apps that share the same codebase. You can have different styles (TSS), views (XML), app icons, splash screens and assets per theme. The problem is that TiApp.xml is never-changing. Which means if you want to have one codebase but multiple instances of branded apps (all with their own names, versions, App IDs etc) it's a nightmare to manage.

The only solution is to have multiple TiApp.xml files OR manage this manually, storing the values you need to remember for each app. It's multiplied if you build for multiple platforms because Android doesn't allow certain characters in the app id so if you've already published the iOS version, then go to publish Android, you have a problem.

TiCh was designed for me, to solve this issue with a client where I will have one codebase, multiple apps and varying app Ids. It allows me to switch apps, I then clean the project, and build the new version.

There are issues - for one you have to document this in your app for others to know - it's also not git friendly as you'll be polluting your TiApp.xml each time and changing it's content.

But it's a solution (for now) until Appcelerator solve this in some way.

## Install [![NPM version](https://badge.fury.io/js/tich.svg)](http://badge.fury.io/js/tich)

As global CLI:

    $ npm install -g tich

## Usage

### CLI

Create a tich.cfg file in the Titanium project folder as follows:

```json
{
    "configs": [{
        "name": "app1",
        "settings": {
            "name": "APP1",
            "version": "1.0.0",
            "id": "com.domain.app1",
            "guid": "1234-5678-9012-3456",
            "properties" :{
                "Parse_AppId" : "APPID",
                "Parse_ClientKey" : "CLIENTKEY",
                "com.domain.MY_DATE": "$DATE$",
                "com.domain.THE_TIME": "$TIME$",
                "com.domain.BUILD_DESC": "The build at $DATETIME$",
                "com.domain.BUILD_NUMBER": "$TIME_EPOCH$",
                "com.domain.APP_VERSION_DESC": "Version $tiapp.version$",
                "com.domain.moreinfo": "Visit $tiapp.url for more details"
            },
            "raw": {
              "/ti:app/android/manifest/@package": "$tiapp.id$",
              "/ti:app/android/manifest/@android:versionName": "$tiapp.version$",
              "/ti:app/android/manifest/application/@android:debuggable": "false",
              "/ti:app/android/manifest/application/activity[@android:name='.SomeActivity']/@android:screenOrientation": "portrait"
            }
        },
    }, {
        "name": "test",
        "settings": {
            "name": "APP2",
            "version": "2.0.0",
            "id": "com.domain.app2",
            "guid": "4321-5678-9012-3456",
            "raw": {
              "/ti:app/android/manifest/@package": "$tiapp.id$",
              "/ti:app/android/manifest/@android:versionName": "$tiapp.version$",
              "/ti:app/android/manifest/application/@android:debuggable": "true",
            }
        }
    }]
}
```
You can currently put any top level XML node in the settings object, so *publisher*, *copyright*, *icon* etc

##Dynamic Substitution

This allows you to use dynamic content in your replacement values. Special dynamic values include:

* `$DATE$` - The current date (formatted for your locale) - For example `Thursday, March 05, 2015`
* `$TIME$` - The current time (formatted for your locale) - For example `17:03:07`
* `$DATETIME$` - Both of them, including timezone. For example `Thu Mar 05 2015 17:03:07 GMT-0500 (EST)`
* `$TIME_EPOCH$` - The number of seconds since the unix epoch. Useful for increasing build numbers.
* `$tiapp.property$` - Substitutes the current value of the tiapp.xml property's value. For example, `$tiapp.version$` would substitute the current value of the `<version>` element from tiapp.xml

##Raw xpath Substitutions

This allows you to set arbitrary XML values and attributes using [xpath](http://en.wikipedia.org/wiki/XPath) expressions.
This is useful for setting values in the `<android>` and `<ios>` sections of `tiapp.xml`. See the examples above for how
to do this.

##Default

This will show the current TiApp.xml config for name, id, version:

    $ tich

##Switch configuration

This will switch the current TiApp.xml file to the settings for the config name specified:

    $ tich select app1
    $ tich select app2

You'll need to do a

    $ ti clean

too before building with Titanium as any App Name changes will create multiple projects.

##Disable automtica Alloy config update

If you're using Alloy, TiCh will automatically update the theme on your Alloy config file to the name used on your TiCh configuration. If you don't want this to happen you can override with the `--noalloy` setting.

    $ tich select app1 --noalloy

##Optionally using multiple config files

You can optionally use the `--cfgfile`, `--in` and `--out` options to specify the files to use. This is useful when you want to distribute a generic version of `tich.cfg` or `tiapp.xml` with your open source project but use private versions for your own internal builds.

For example, to use the `app2` config profile defined in the `/path/to/myconfig.cfg` file:

    $tich select --cfgfile /path/to/myconfig.cfg app2

To use a different input file as a template:

    $tich select --in /path/to/tiapp-template.xml app2

If you do not specify these options, the following defaults will apply:

* `--cfgfile` defaults to `./tich.cfg`
* `--in` and `--out` default to `./tiapp.xml`

##Future thoughts

* allow saving of new config items / settings via the CLI
* allow renaming, deleting of configs
* allow postbuild commands using Ti/TiNy (ti appstore) to be passed or put into config
* improve error handling
* allow backup capbility to save changed TiApp.xml files

##  Thanks

* [Tony Luka Savage](http://github.com/tonylukasavage) for creating the Tiapp.xml module
* [Fokke Zandbergen](http://github.com/fokkeZB) for the CLI template

## License

<pre>
Copyright 2015 Jason Kneen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
</pre>


