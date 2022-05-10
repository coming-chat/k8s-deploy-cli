import fs from 'fs';
import { isProd, writeTool } from '../help/help';

const createData = (appName: string, githubUrl: string, env: string): string => {
  const APP_NAME = isProd(env) ? `${appName}-prod`: `${appName}-pre`
  const dockerfileName = isProd(env) ? 'Dockerfile.prod': 'Dockerfile.dev'
  const deployFile = isProd(env) ?
    `/prod/deploy-${appName}.yaml`:
    `/pre/deploy-${appName}.yaml`
  const branch = isProd(env) ? 'main': 'pre'

  return `
pipeline {
  agent {
    node {
      label 'base'
    }
  }
  environment {
    DOCKER_CREDENTIAL_ID = 'dockerhub-id'
    KUBECONFIG_CREDENTIAL_ID = 'admin'
    REGISTRY = 'docker.io'
    DOCKERHUB_NAMESPACE = 'comingweb3'
    APP_NAME = '${APP_NAME}'
  }
  parameters {
    string(name: 'BRANCH_NAME', defaultValue: '${branch}', description: '')
  }


  stages {

    stage('拉取代码') {
      steps {
        git(branch: '${branch}', url: '${githubUrl}', credentialsId: 'github-id', changelog: true, poll: false)
      }
    }


    stage('推送镜像') {
      steps {
        container('base') {
          withCredentials([usernamePassword(credentialsId : "$DOCKER_CREDENTIAL_ID" ,passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,)]) {
            sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
            sh 'docker build --network host -f ${dockerfileName} -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BUILD_NUMBER .'
            sh 'docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BUILD_NUMBER'
          }

        }

      }
    }

    stage('部署') {
      steps {
        container('base') {
          script {
            withCredentials([
              kubeconfigFile(
                credentialsId: 'admin',
                variable: 'KUBECONFIG')
              ])
              {
                sh 'envsubst <  deploy${deployFile} | kubectl apply -f -'

              }
            }

        }

      }

    }

  }
}
  `
}

const handleJenkinsfileWrite = (
  appName: string,
  githubUrl: string,
  env: 'pre' | 'prod'
) => {
  const postfix = isProd(env) ? 'Prod': 'Pre';
  const path = `jenkinsfileOn${postfix}`
  const writer = fs.createWriteStream(path);
  const data = createData(
    appName,
    githubUrl,
    env,
  )
  writeTool(writer, data, path)
}

const handleJenkinsFiles = (appName: string, githubUrl: string) => {
  handleJenkinsfileWrite(appName, githubUrl, 'pre');
  handleJenkinsfileWrite(appName, githubUrl, 'prod');
}


export default handleJenkinsFiles
