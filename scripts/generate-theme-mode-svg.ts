import fs from 'fs';
import path from 'path';

const indexFile = path.resolve(process.cwd(), './src/app/_icons/index.ts');
const outputFile = path.resolve(process.cwd(), './src/app/_icons/theme-mode-svg.tsx');

// 读取 index.ts，提取出所有导出的变量名
const indexContent = fs.readFileSync(indexFile, 'utf-8');

const exportRegex = /export\s+\{\s+default\s+as\s+(\w+)\s+\}/g;

let match: RegExpExecArray | null;
const exportedNames: string[] = [];

while ((match = exportRegex.exec(indexContent)) !== null) {
  exportedNames.push(match[1]);
}

const imports = [
  `import React from 'react';`,
  `import ThemeModeSvgWrapper from '@app/_components/theme-mode-svg';`,
  ...exportedNames.map(name => `import { ${name} as ${name}Svg } from './index';`)
];

const components = exportedNames.map(name => `
export const ${name} = () => (
  <ThemeModeSvgWrapper>
    <${name}Svg />
  </ThemeModeSvgWrapper>
);`).join('\n');

const finalContent = `${imports.join('\n')}\n\n${components}\n`;

fs.writeFileSync(outputFile, finalContent);

console.log(`✅ 已生成包装 SVG 文件：${outputFile}，共包含 ${exportedNames.length} 个组件`);
