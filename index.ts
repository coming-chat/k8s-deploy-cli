import handleNginxFile from './lib/handleNginxWrite';
import handleJenkinsFiles from './lib/handleJenkinsfileWrite';
import handleDockerFiles from './lib/handleDockerfileWrite';
import handleDeployFiles from './lib/handleDeployFileWrite';

export const handleK8sConfigFiles = (
  appName: string,
  githubUrl: string,
  buildScriptInPre: string,
  buildScriptInProd: string,
  packagedPath: string,
  domainName: string,
  envConfigName?: string,
) => {
  //生成并写入 nginx.config
  handleNginxFile()

//生成并写入 jenkinsfile
  handleJenkinsFiles(appName, githubUrl)

//生成并写入 Dockerfile
  handleDockerFiles(buildScriptInPre, buildScriptInProd, packagedPath)

//生成并写入 deploy 文件
  handleDeployFiles(appName, domainName, envConfigName)
}
