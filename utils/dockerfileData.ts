export const dockerfileData = 'FROM kubespheredev/builder-base:latest AS builder\n' +
  '\n' +
  '#定义node版本号\n' +
  'ENV NODE_VERSION 14.5.0\n' +
  '\n' +
  'RUN ARCH= && uArch="$(uname -m)" \\\n' +
  '  && case "${uArch##*-}" in \\\n' +
  '  x86_64) ARCH=\'x64\';; \\\n' +
  '  aarch64) ARCH=\'arm64\';; \\\n' +
  '  *) echo "unsupported architecture"; exit 1 ;; \\\n' +
  '  esac \\\n' +
  '  # gpg keys listed at https://github.com/nodejs/node#release-keys\n' +
  '  && set -ex \\\n' +
  '  && for key in \\\n' +
  '  94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \\\n' +
  '  FD3A5288F042B6850C66B31F09FE44734EB7990E \\\n' +
  '  71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \\\n' +
  '  DD8F2338BAE7501E3DD5AC78C273792F7D83545D \\\n' +
  '  C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \\\n' +
  '  B9AE9905FFD7803F25714661B63B535A4C206CA9 \\\n' +
  '  77984A986EBC2AA786BC0F66B01FBB92821C587A \\\n' +
  '  8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \\\n' +
  '  4ED778F539E3634C779C87C6D7062848A1AB005C \\\n' +
  '  A48C2BEE680E841632CD4E44F07496B3EB3C1762 \\\n' +
  '  B9E2F5981AA6E0CD28160D9FF13993A75599653C \\\n' +
  '  ; do \\\n' +
  '  gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$key" || \\\n' +
  '  gpg --batch --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$key" || \\\n' +
  '  gpg --batch --keyserver hkp://pgp.mit.edu:80 --recv-keys "$key" ; \\\n' +
  '  done \\\n' +
  '  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \\\n' +
  '  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \\\n' +
  '  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \\\n' +
  '  && grep " node-v$NODE_VERSION-linux-$ARCH.tar.xz\\$" SHASUMS256.txt | sha256sum -c - \\\n' +
  '  && tar -xJf "node-v$NODE_VERSION-linux-$ARCH.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \\\n' +
  '  && rm "node-v$NODE_VERSION-linux-$ARCH.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \\\n' +
  '  && ln -s /usr/local/bin/node /usr/local/bin/nodejs \\\n' +
  '  && yum install -y nodejs gcc-c++ make bzip2 GConf2 gtk2 chromedriver chromium xorg-x11-server-Xvfb\n' +
  '\n' +
  '# npm 安装需要的全局插件\n' +
  'RUN npm i -g watch-cli vsce typescript\n' +
  '\n' +
  '# Yarn 定义yarn的版本号\n' +
  'ENV YARN_VERSION 1.17.3\n' +
  'RUN curl -f -L -o /tmp/yarn.tgz https://github.com/yarnpkg/yarn/releases/download/v${YARN_VERSION}/yarn-v${YARN_VERSION}.tar.gz && \\\n' +
  '  tar xf /tmp/yarn.tgz && \\\n' +
  '  mv yarn-v${YARN_VERSION} /opt/yarn && \\\n' +
  '  ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn && \\\n' +
  '  yarn config set cache-folder /root/.yarn\n' +
  '\n' +
  'WORKDIR /opt/web\n' +
  '\n' +
  '# build 命令，具体自定义自己的应用程序build步骤\n' +
  'COPY . ./\n' +
  'RUN yarn install\n' +
  'ENV REACT_APP_API_ENV=pre\n' +
  'RUN yarn run build;exit 0\n' +
  '\n' +
  '# docker in docker 安装nginx镜像暴露80端口\n' +
  '\n' +
  'FROM nginx:latest\n' +
  'RUN apt-get update && apt-get install awscli curl -y\n' +
  'RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \\\n' +
  '  chmod +x envsubst && \\\n' +
  '  mv envsubst /usr/local/bin\n' +
  '\n' +
  '# 安装aliyun oss 工具\n' +
  'RUN curl -L  http://gosspublic.alicdn.com/ossutil/1.7.3/ossutil64 -o ossutil64 && \\\n' +
  '  chmod 755 ossutil64 && \\\n' +
  '  mv ossutil64 /usr/local/bin\n' +
  '\n' +
  'COPY ./nginx.config /etc/nginx/nginx.template\n' +
  'ENV REACT_APP_API_ENV=pre\n' +
  'CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g \'daemon off;\'"]\n' +
  '\n' +
  '# 将build后的产物移动到nginx\n' +
  'COPY --from=builder /opt/web/build /usr/share/nginx/html\n'
