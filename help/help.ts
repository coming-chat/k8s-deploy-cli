import { WriteStream } from "fs";
import fs from 'fs';
import rimraf from 'rimraf'

const isProd = (env: string): boolean => {
  return env === 'prod'
}

const writeTool = (writer: WriteStream, data: string, path: string) => {
  // if (fs.existsSync(path)) {
  //   rimraf.sync(path)
  // }

  let ok: boolean;
  console.log(`开始写入 ${path}`);
  ok = writer.write(data);

  if (!ok) {
    console.log('写不动了');
    writer.once('drain', () => {
      console.log('可以继续');
      writeTool(writer, data, path);
    });
  }
}

export {
  isProd,
  writeTool
}
