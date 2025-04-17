import dynamic from 'next/dynamic';



import fs from 'fs';
import path from 'path'

export  function generateFilePaths(dir: string, basePath: string = ''): string[] {
  const filePaths: string[] = [];

  // 获取目录下的所有文件和文件夹
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);

    // 判断是文件还是目录
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // 如果是目录，递归处理子目录
      filePaths.push(...generateFilePaths(fullPath, relativePath));
    } else if (stats.isFile() && item.endsWith('.mdx')) {
      // 只处理以 .mdx 结尾的文件
      filePaths.push(relativePath);
    }
  });

  return filePaths;
}
//
export function readFileContents(filePaths: string[]): Promise<string[]> {
  return new Promise((resolve) => {
    const contents: string[] = [];

    filePaths.forEach(filePath => {
      // const fullPath = path.join(process.cwd(), 'docs', filePath);
      const fullPath = path.join(process.cwd(), 'src/app/[lang]/',filePath);
      console.log('fullPath',fullPath)
      try {
        // 读取文件内容
        const content = fs.readFileSync(fullPath, 'utf-8');
        contents.push(content);
      } catch (error) {
        console.error(`无法读取文件: ${filePath}`, error);
        resolve(contents)
      }
    });

    resolve(contents)
  })
}

type MetaRecord = { [key: string]: string | { items: MetaRecord } };

// 递归读取 _meta.ts 文件并合并元信息
export  async function generateMetaInfo(dir: string, basePath: string = ''): Promise<MetaRecord> {
  const metaInfo: MetaRecord = {};

  // 获取目录下的所有文件和文件夹
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);

    // 判断是文件还是目录
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // 如果是目录，递归查找子目录中的 _meta.ts 文件
      const subMeta = await generateMetaInfo(fullPath, relativePath);

      if (Object.keys(subMeta).length > 0) {
        metaInfo[item] = { items: subMeta };
      }
    } else if (stats.isFile() && item === '_meta.ts') {
      // 如果是 _meta.ts 文件，读取并解析元信息
      try {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const meta = JSON.parse(fileContent);
        // 将元信息合并到 metaInfo 中
        Object.assign(metaInfo, meta);
      } catch (error) {
        console.error(`无法读取文件: ${fullPath}`, error);
      }
    }
  }

  return metaInfo;
}
