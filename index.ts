import handleNginxFile from './lib/handleNginxWrite';
import handleJenkinsFiles from './lib/handleJenkinsfileWrite';
import handleDockerFiles from './lib/handleDockerfileWrite';
import handleDeployFiles from './lib/handleDeployFileWrite';

export const handleK8sConfigFiles = (
  appName: string,
  githubUrl: string,
  namespaceInJenkinsFile: string,
  buildScript: string,
  packagedPath: string,
  metadataNamespace: string,
  envConfigName?: string,
) => {
  //生成并写入 nginx.config
  handleNginxFile()

//生成并写入 jenkinsfile
  handleJenkinsFiles(namespaceInJenkinsFile, appName, githubUrl)

//生成并写入 Dockerfile
  handleDockerFiles(buildScript, packagedPath)

//生成并写入 deploy 文件
  handleDeployFiles(appName, metadataNamespace, envConfigName)
}
