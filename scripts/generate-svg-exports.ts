import  fs from 'fs';
import  path from 'path';

// 将文件名转换为 PascalCase，例如 notion-digital-journaling → NotionDigitalJournaling
function toPascalCase(filename: string): string {
  return filename
    .replace(/\.svg$/, '')
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

interface SvgFileInfo {
  fullPath: string;
  relativePath: string;
  fileName: string;
  variableName: string;
}

// 递归获取所有 SVG 的信息
function getAllSvgFiles(dir: string, relativePath = ''): SvgFileInfo[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  console.log('entries',entries)
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      return getAllSvgFiles(fullPath, relPath);
    } else if (entry.isFile() && entry.name.endsWith('.svg')) {
      const fileName = path.basename(entry.name);
      const variableName = toPascalCase(fileName);
      return [{
        fullPath,
        relativePath: relPath,
        fileName,
        variableName,
      }];
    } else {
      return [];
    }
  });
}

// 提供自定义导出语句的能力
function generateSvgExports(
  svgFiles: SvgFileInfo[],
  renderLine: (svg: SvgFileInfo) => string
): string {
  return svgFiles
    .map(svg => renderLine(svg))
    .join('\n');
}

// 默认导出语句格式
function defaultRenderLine(svg: SvgFileInfo): string {
  return `export { default as ${svg.variableName} } from './${svg.relativePath.replace(/\\/g, '/') }?svgr'`;
}

// 写入 index.ts 文件
function writeIndexFile(
  svgDir: string,
  outputFile: string,
  renderLine: (svg: SvgFileInfo) => string = defaultRenderLine
): void {
  const svgFiles = getAllSvgFiles(svgDir);
  const content = generateSvgExports(svgFiles, renderLine);
  fs.writeFileSync(outputFile, content);
  console.log(`✅ 生成文件路径：${outputFile}, 包含 ${svgFiles.length} 个 SVG`);
}
function writeThemeModeSvgFile(
  svgDir: string,
  outputFile: string
): void {
  const svgFiles = getAllSvgFiles(svgDir);

  const imports = [
    `import React from 'react';`,
    `import ThemeModeSvgWrapper from '../ThemeModeSvgWrapper';`,
    ...svgFiles.map(svg =>
      `import { default as ${svg.variableName}Svg } from './${svg.relativePath.replace(/\\/g, '/')}?svgr';`
    )
  ];

  const components = svgFiles.map(svg => `
export const ${svg.variableName} = () => (
  <ThemeModeSvgWrapper>
    <${svg.variableName}Svg />
  </ThemeModeSvgWrapper>
);`).join('\n');

  const content = `${imports.join('\n')}\n\n${components}\n`;

  fs.writeFileSync(outputFile, content);
  console.log(`✅ 生成包装组件文件：${outputFile}`);
}

const CWD = process.cwd();
const svgDir = path.resolve(CWD, './src/app/_icons');
const outputFile = path.resolve(CWD, './src/app/_icons/index.ts');

writeIndexFile(
  svgDir,
  outputFile
)


