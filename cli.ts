import { program } from 'commander';
import pkg from './package.json';
import inquirer from 'inquirer';
import colors from 'colors';
import { handleK8sConfigFiles } from '.';

program
  .version(pkg.version, '-v, --version')
  .parse(process.argv);

let projectOwnership: 'chainx' | 'coming';

let appName: string;
let githubUrl: string;
let namespaceInJenkinsFile: string;

//dockerfile
let buildScript: string;
let packagedPath: string;

//deploy
let envConfigName: string;
let metadataNamespace: string;

inquirer
  .prompt([
    {
      type: 'list',
      name: 'projectOwnership',
      message: '需要生成 chainx 还是 coming 的项目呢？',
      choices: ['chainx', 'coming']
    }
  ])
  .then((answer) => {
    projectOwnership = JSON.parse(JSON.stringify(answer)).projectOwnership;
    namespaceInJenkinsFile = projectOwnership === 'chainx' ? 'chainxorg' : 'comingweb3';
    metadataNamespace = projectOwnership === 'chainx' ? 'chainx-' : '';
    askForAppName();
  });

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
      askForBuildScript();
    });
};

const askForBuildScript = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'buildScript',
        message: '请输入项目的 build 命令：',
      }
    ])
    .then((answer) => {
      buildScript = JSON.parse(JSON.stringify(answer)).buildScript;
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
          namespaceInJenkinsFile,
          buildScript,
          packagedPath,
          metadataNamespace,
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
        namespaceInJenkinsFile,
        buildScript,
        packagedPath,
        metadataNamespace,
        envConfigName
      );
    });
};
