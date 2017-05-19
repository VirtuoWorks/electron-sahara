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
npm install -g electron-sahara
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

-  `` simple ``
-  `` react ``
-  `` angular2 ``
-  `` vuejs ``

Example :
```
sahara create MyApp angular2
```

## Add a platform

After creating a Sahara project, navigate to the project directory. From the project directory, you need to add a platform for which you want to build your app.

To add a platform, type ``sahara platform add <platform name>``.

For a complete list of platforms you can add, run ``sahara platform``.

Example :
```
cd MyApp
sahara platform add windows
```
Available platforms :

-  `` windows``
-  `` macos ``
-  `` linux ``

## Run your app

From the command line, run ``sahara run <platform name>``.

`` sahara run windows ``

## Requirements

 - [Node.js](https://nodejs.org/en/download/) (>=4.7)
 - [Git](https://git-scm.com/downloads)