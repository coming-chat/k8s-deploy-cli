import { WriteStream} from 'fs'

const writeTool = (writer: WriteStream, data: string, name?: string) => {
  let ok: boolean;
  console.log(`开始写入 ${name}`);
  ok = writer.write(data);

  if (!ok) {
    console.log('写不动了');
    writer.once('drain', () => {
      console.log('可以继续');
      writeTool(writer, data, name);
    });
  }
}

export default writeTool
