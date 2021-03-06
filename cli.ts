#!/usr/bin/env node

import { program } from 'commander';
import pkg from './package.json';
import inquirer from 'inquirer';
import { handleK8sConfigFiles } from './index';

program
  .version(pkg.version, '-v, --version')
  .parse(process.argv);

let appName: string;
let githubUrl: string;

//dockerfile
let buildScriptInPre: string;
let buildScriptInProd: string
let packagedPath: string;

//deploy
let domainName: string
let envConfigName: string;

const askForAppName = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'appName',
        message: '请输入你的 appName：',
      }
    ])
    .then((answer) => {
      appName = JSON.parse(JSON.stringify(answer)).appName;
      askForGithubUrl();
    });
};

const askForGithubUrl = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'githubUrl',
        message: '请输入 github 链接：',
      }
    ])
    .then((answer) => {
      githubUrl = JSON.parse(JSON.stringify(answer)).githubUrl;
      askForBuildScriptInPre();
    });
};

const askForBuildScriptInPre = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'buildScript',
        message: '请输入项目在 pre 环境下的 build 命令：',
      }
    ])
    .then((answer) => {
      buildScriptInPre = JSON.parse(JSON.stringify(answer)).buildScript;
      askForBuildScriptInProd();
    });
};

const askForBuildScriptInProd = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'buildScript',
        message: '请输入项目在 prod 环境下的 build 命令：',
      }
    ])
    .then((answer) => {
      buildScriptInProd = JSON.parse(JSON.stringify(answer)).buildScript;
      askForPackagedPath();
    });
};

const askForPackagedPath = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'packagedPath',
        message: '请输入项目 build 打包后输出的目录：',
      }
    ])
    .then((answer) => {
      packagedPath = JSON.parse(JSON.stringify(answer)).packagedPath;
      askForDomainName();
    });
};

const askForDomainName = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'domainName',
        message: '请输入项目的域名：',
      }
    ])
    .then((answer) => {
      domainName = JSON.parse(JSON.stringify(answer)).domainName;
      askForHasEnvConfigName();
    });
};

const askForHasEnvConfigName = () => {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'hasEnvConfig',
        message: '是否有环境变量？'
      }
    ])
    .then((answer: any) => {
      if (answer.hasEnvConfig) {
        askForEnvConfigName();
      } else {
        handleK8sConfigFiles(
          appName,
          githubUrl,
          buildScriptInPre,
          buildScriptInProd,
          packagedPath,
          domainName,
          envConfigName
        );
      }
    });
};

const askForEnvConfigName = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'envConfigName',
        message: '请输入环境变量名称：',
      }
    ])
    .then((answer) => {
      envConfigName = JSON.parse(JSON.stringify(answer)).envConfigName;
      handleK8sConfigFiles(
        appName,
        githubUrl,
        buildScriptInPre,
        buildScriptInProd,
        packagedPath,
        domainName,
        envConfigName
      );
    });
};

askForAppName();
