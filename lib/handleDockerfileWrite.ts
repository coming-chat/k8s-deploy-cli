import fs from 'fs';
import { isProd } from '../helper/help';
import writeTool from '../helper/writeTool';
import { dockerfileData } from '../utils/dockerfileData';

const createData = (packagedPath: string, env: 'dev' | 'prod', buildScript: string): string => {
  const REACT_APP_API_ENV = isProd(env)? 'prod' : 'pre'
  return dockerfileData.replace('/opt/web/build', `/opt/web/${packagedPath}`)
    .replace(/REACT_APP_API_ENV=pre/g, `REACT_APP_API_ENV=${REACT_APP_API_ENV}`)
    .replace('yarn run build', buildScript)
}

const handleDockerfileWrite = (env: 'prod' | 'dev', buildScript: string, packagedPath: string) => {
  const writer = fs.createWriteStream(`Dockerfile.${env}`);
  const data = createData(packagedPath, env, buildScript)
  writeTool(writer, data, 'Dockerfile')
}

const handleDockerFiles = (buildScript: string, packagedPath: string) => {
  handleDockerfileWrite('dev', buildScript, packagedPath);
  handleDockerfileWrite('prod', buildScript, packagedPath);
}

export default handleDockerFiles