import fs from 'fs';
import writeTool from '../helper/writeTool';

export const nginxWriter = fs.createWriteStream('nginx.config');

export const nginxData = 'server {\n' +
  '    listen       ${PORT:-80};\n' +
  '    server_name  _;\n' +
  '\n' +
  '    root /usr/share/nginx/html;\n' +
  '    index index.html;\n' +
  '\n' +
  '    location / {\n' +
  '        try_files $$uri /index.html;\n' +
  '    }\n' +
  '}\n';

const handleNginxFile = () => {
  writeTool(nginxWriter, nginxData, 'nginx.config');
};

export default handleNginxFile;
