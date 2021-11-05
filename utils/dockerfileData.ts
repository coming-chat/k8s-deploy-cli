export const dockerfileData = 'FROM node:14.15.0 as builder\n' +

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
