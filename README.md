[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Codacy Badge][codacy-image]][codacy-url]

# Electron Sahara

 - **Desktop apps with HTML, CSS & JS** 
 - **Target multiple platforms with one code base** 
 - **Free and open source**
 
**Electron Sahara** is an *Apache Cordova like* command line utility for **electron**. 
Supported platforms :

> <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" width="48"> <img src="https://upload.wikimedia.org/wikipedia/commons/b/bb/OS_X_El_Capitan_logo.svg" width="48"> <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg" width="48">

## Installing Sahara

Sahara command-line runs on Node.js and is available on NPM. Follow platform specific guides to install additional platform dependencies. Open a command prompt or Terminal, and type ``npm install -g electron-sahara``

Example :
```
npm install -g @virtuoworks/electron-sahara
```

## Create a project

Create a blank Sahara project using the command-line tool. Navigate to the directory where you wish to create your project and type ``sahara create <path>``.

For a complete set of options, type ``sahara help create``.

Example :
```
sahara create MyApp
```

### Templates

Templates allow you to use preexisting code to jumpstart your project. Navigate to the directory where you wish to create your project and type ``sahara create <path> [template]``

Available templates :

-  `` vanilla `` (default)
-  `` react ``
-  `` angular2 ``
-  `` vuejs ``

Example :
```
sahara create MyApp angular2
```

## Prepare a platform

After creating a Sahara project, navigate to the project directory. From the project directory, you need to prepare a platform for which you want to build your app.

To prepare a platform, type ``sahara prepare <platform name>``.

For a complete list of platforms you can run ``sahara prepare``.

Example :
```
cd MyApp
sahara prepare win32
```
Available platforms :

-  `` win32`` (for Windows (32/64 bit))
-  `` darwin `` (for OS X (also known as macOS))
-  `` linux `` (for Linux (x86/x86_64))

## Compile a platform

After having prepared a platform, navigate to the project directory. From the project directory, you can compile a release for a platform.

To compile a platform, type ``sahara compile <platform name>``.

For a complete list of platforms you can run ``sahara compile``.

Example :
```
cd MyApp
sahara compile win32
```

## Prepare AND Compile a platform

If you which to perform both operations in a row, navigate to the project directory. From the project directory, type ``sahara build <platform name>``.

Example :
```
cd MyApp
sahara build win32
```

## Run your app

From the command line, run ``sahara run <platform name>``.

`` sahara run win32 ``

## Requirements

 - [Node.js](https://nodejs.org/en/download/) (>=4.7)
 - [Git](https://git-scm.com/downloads)

 ## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@virtuoworks/electron-sahara.svg
[npm-url]: https://www.npmjs.com/package/@virtuoworks/electron-sahara
[downloads-image]: https://img.shields.io/npm/dm/@virtuoworks/electron-sahara.svg
[downloads-url]: https://www.npmjs.com/package/@virtuoworks/electron-sahara
[travis-image]: https://api.travis-ci.org/VirtuoWorks/electron-sahara.svg?branch=master
[travis-url]: https://travis-ci.org/VirtuoWorks/electron-sahara.svg
[coveralls-image]: https://coveralls.io/repos/github/VirtuoWorks/electron-sahara/badge.svg?branch=master&seed=3426236
[coveralls-url]: https://coveralls.io/github/VirtuoWorks/electron-sahara?branch=master
[codacy-image]: https://api.codacy.com/project/badge/Grade/a72b34b2d9194fe68a827c0a38f97aa9
[codacy-url]: https://www.codacy.com/app/VirtuoWorks/electron-sahara?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=VirtuoWorks/electron-sahara&amp;utm_campaign=Badge_Grade