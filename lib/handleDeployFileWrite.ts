import writeTool from '../helper/writeTool';
import fs from 'fs';
import path from 'path';
import { deployfileData } from '../utils/deployfileData';
import { isProd } from '../helper/help';

const rootDir = process.cwd()

const createData = (metadataName: string, metadataNamespace: string, env: 'pre' | 'prod', envConfig?: string) => {
  const containersName = isProd(env) ? 'container-api-prod' : 'container-api-pre';
  let deployfileData2: string;
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

  return deployfileData2
    .replace('name: kusama-slot-front', `name: ${metadataName}`)
    .replace('namespace: chainx-pre', `namespace: ${metadataNamespace}`)
    .replace(/app: kusama-slot-front/g, `app: ${metadataName}`)
    .replace('container-api-pre', containersName);
};

const handleDeployFileWrite = (
  appName: string,
  metadataNamespace: string,
  env: 'pre' | 'prod',
  envConfig?: string
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

  const writer = fs.createWriteStream(`deploy/${env}/deploy-${appName}.yaml`);
  const data = createData(appName, metadataNamespace, env, envConfig)
  writeTool(writer, data, `${appName}`)
};

const handleDeployFiles = (appName: string, metadataNamespace: string, envConfig?: string) => {
  handleDeployFileWrite(appName, `${metadataNamespace}pre`, 'pre', envConfig);
  handleDeployFileWrite(appName, `${metadataNamespace}prod`, 'prod', envConfig);
}

export default handleDeployFiles;
