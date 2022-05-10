import fs from 'fs';
import path from 'path';
import { deployfileData } from '../utils/deployfileData';
import { isProd, writeTool } from '../help/help';

const rootDir = process.cwd()

const createData = (
  appName: string,
  domainName: string,
  env: 'pre' | 'prod',
  envConfig?: string
) => {
  let deployfileData2: string;
  let resultDomainName: string

  const containersName = isProd(env) ? 'container-api-prod' : 'container-api-pre';
  const ingressName = domainName.replace(/\./g, '-')
  if (envConfig) {
    deployfileData2 = deployfileData.replace('envFrom:\n' +
      '            - configMapRef:\n' +
      '                name: aws-config', `envFrom:
            - configMapRef:
                name: ${envConfig}`);
  } else {
    deployfileData2 = deployfileData.replace('envFrom:\n' +
      '            - configMapRef:\n' +
      '                name: aws-config', '');
  }
  if (isProd(env)) {
    resultDomainName = domainName
  } else {
    resultDomainName = domainName.replace('.', '-pre.')
  }

  return deployfileData2
    .replace(/APP_NAME/g, appName)
    .replace(/NAME_SPACE/g, `namespace: front-${env}`)
    .replace(/DOMAIN_NAME/g, resultDomainName)
    .replace(/INGRESS_NAME/g, ingressName)
    .replace('container-api-pre', containersName);
};

const handleDeployFileWrite = (
  appName: string,
  domainName: string,
  env: 'pre' | 'prod',
  envConfig?: string,
) => {
  const hasDeployDir: boolean = fs.existsSync(path.join(rootDir, 'deploy'));
  if(!hasDeployDir){
    fs.mkdirSync('deploy')
  }
  if(isProd(env)) {
    fs.mkdirSync('deploy/prod')
  }else{
    fs.mkdirSync('deploy/pre')
  }
  const filePath = `deploy/${env}/deploy-${appName}.yaml`

  const writer = fs.createWriteStream(filePath);
  const data = createData(appName, domainName, env, envConfig)
  writeTool(writer, data, filePath)
};

const handleDeployFiles = (appName: string, domainName: string, envConfig?: string) => {
  handleDeployFileWrite(appName, domainName, 'pre', envConfig);
  handleDeployFileWrite(appName, domainName, 'prod', envConfig);
}

export default handleDeployFiles;
