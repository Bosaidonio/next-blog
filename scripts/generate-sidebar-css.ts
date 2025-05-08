import * as fs from 'fs';
import * as path from 'path';



/**
 * 读取 basePath 下 includesList 中指定目录的子目录名称
 * @param basePath 根路径
 * @param includesList 需要查找的一级目录名数组
 * @param maxDepth 查找深度，默认 0（只查一层）
 * @returns 包含前缀的目录路径数组
 */
function readFilteredDirectories(
  basePath: string,
  includesList: string[],
  maxDepth: number = 0
): string[] {
  const result: string[] = [];

  for (const name of includesList) {
    const currentPath = path.join(basePath, name);
    if (!fs.existsSync(currentPath) || !fs.statSync(currentPath).isDirectory()) {
      continue;
    }

    function helper(currentDir: string, relativePath: string, currentDepth: number) {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subPath = path.join(relativePath, entry.name);
          result.push(subPath);

          if (currentDepth < maxDepth) {
            helper(path.join(currentDir, entry.name), subPath, currentDepth + 1);
          }
        }
      }
    }
    result.push(`${name}/dashboard`)
    helper(currentPath, name, 0);
  }

  return result;
}
/**
 * 根据路径数组生成隐藏 <a> 标签的 CSS 代码
 * @param pathList 路径数组，例如 ['/frontend/css', '/frontend/vue']
 * @returns CSS 样式字符串
 */
function generateHideLinkCSS(pathList: string[]): string {
  if (pathList.length === 0) return '';

  const selectors = pathList.map(
    path => `aside a[href="${path}"]`
  );

  return `${selectors.join(',\n')} {\n  display: none;\n}`;
}
/**
 * 将内容写入到指定文件路径（自动创建中间目录）
 * @param content 要写入的内容
 * @param outputPath 输出文件的完整路径
 */
function writeToFile(content: string, outputPath: string): void {
  const dir = path.dirname(outputPath);
  // 确保目录存在
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`✅ 写入成功: ${outputPath}`);
}
const basePath = path.resolve(process.cwd(), './src/content/zh');
const includesList = [
  '/frontend'
]
const dirs = readFilteredDirectories(basePath, includesList);
const cssCode = generateHideLinkCSS(dirs)
writeToFile(cssCode, './src/app/[lang]/sidebar-hidden.css')

