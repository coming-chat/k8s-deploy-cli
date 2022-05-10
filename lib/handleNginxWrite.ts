import fs from 'fs';
import { writeTool } from '../help/help';

const path = 'nginx.config'
export const nginxWriter = fs.createWriteStream(path);

export const nginxData = 'server {\n' +
  '    listen       ${PORT:-80};\n' +
  '    listen       [::]:${PORT:-80};\n' +
  '    server_name  _;\n' +
  '\n' +
  '    root /usr/share/nginx/html;\n' +
  '    index index.html;\n' +
  '    gzip on;\n' +
  '    gzip_disable "msie6";\n' +
  '\n' +
  '    gzip_comp_level 6;\n' +
  '    gzip_min_length 1100;\n' +
  '    gzip_buffers 16 8k;\n' +
  '    gzip_proxied any;\n' +
  '    gzip_types\n' +
  '            text/plain\n' +
  '            text/css\n' +
  '            text/js\n' +
  '            text/xml\n' +
  '            text/javascript\n' +
  '            application/javascript\n' +
  '            application/x-javascript\n' +
  '            application/json\n' +
  '            application/xml\n' +
  '            application/rss+xml\n' +
  '            image/svg+xml/javascript;\n' +
  '    location / {\n' +
  '        try_files $$uri /index.html;\n' +
  '    }\n' +
  '}\n';

const handleNginxFile = () => {
  writeTool(nginxWriter, nginxData, path);
};

export default handleNginxFile;