/**
 * 代表行高亮范围的接口
 */
interface HighlightRange {
  start: number;
  end: number;
}

/**
 * 文件信息接口
 */
interface FileInfo {
  path: string;
  start?: number;
  end?: number;
}

/**
 * 代码元信息的接口定义
 */
interface CodeMeta {
  language?: string;
  highlight?: HighlightRange[];
  fileInfo?: FileInfo;
  [key: string]: string | boolean | number | HighlightRange[] | FileInfo | undefined;
}

/**
 * 常见编程语言列表用于语言识别
 */
const COMMON_LANGUAGES = [
  'js', 'javascript', 'ts', 'typescript', 'jsx', 'tsx',
  'python', 'py', 'ruby', 'php', 'java', 'c', 'cpp', 'cs', 'go',
  'rust', 'swift', 'kotlin', 'scala', 'perl', 'r', 'shell', 'bash',
  'sql', 'html', 'css', 'scss', 'less', 'json', 'xml', 'yaml', 'toml',
  'markdown', 'md', 'tex', 'latex'
];

/**
 * 尝试解析并提取语言标识符
 * @param metastring 元信息字符串
 * @returns 包含语言和剩余字符串的对象
 */
function extractLanguage(metastring: string): { language?: string; remainingString: string } {
  const result: { language?: string; remainingString: string } = {
    remainingString: metastring.trim()
  };

  const firstWordMatch = result.remainingString.match(/^([a-zA-Z0-9_+-]+)(?=\s|$)/);
  if (firstWordMatch && !firstWordMatch[1].includes('=')) {
    const firstWord = firstWordMatch[1];

    // 仅当第一个词是常见语言或明显的语言标识符时，才将其设为语言
    const isLikelyLanguage = COMMON_LANGUAGES.includes(firstWord.toLowerCase())

    if (isLikelyLanguage) {
      result.language = firstWord;
      result.remainingString = result.remainingString.slice(firstWordMatch[0].length).trim();
    }
  }

  return result;
}

/**
 * 提取代码行高亮信息
 * @param metastring 元信息字符串
 * @returns 包含高亮范围和剩余字符串的对象
 */
function extractHighlight(metastring: string): { highlight?: HighlightRange[]; remainingString: string } {
  const result: { highlight?: HighlightRange[]; remainingString: string } = {
    remainingString: metastring.trim()
  };

  const lineHighlightRegex = /\{([\d,-\s]+)\}/;
  const highlightMatch = result.remainingString.match(lineHighlightRegex);

  if (highlightMatch) {
    const ranges: HighlightRange[] = highlightMatch[1].split(',').map(range => {
      const parts = range.trim().split('-').map(Number);
      const start = parts[0];
      const end = parts.length > 1 ? parts[1] : start;
      return { start, end };
    });

    result.highlight = ranges;
    result.remainingString = result.remainingString.replace(lineHighlightRegex, '').trim();
  }

  return result;
}

/**
 * 提取键值对
 * @param metastring 元信息字符串
 * @returns 包含键值对和剩余字符串的对象
 */
function extractKeyValuePairs(metastring: string): { keyValuePairs: [string, string][]; remainingString: string } {
  let remainingString = metastring.trim();
  const keyValuePairs: [string, string][] = [];

  // 处理带引号的键值对: key="value" 或 key='value'
  const quotedRegex = /(\w+)=["']([^"']*)["']/g;
  let quotedMatch: RegExpExecArray | null;
  while ((quotedMatch = quotedRegex.exec(remainingString)) !== null) {
    keyValuePairs.push([quotedMatch[1], quotedMatch[2]]);
  }

  // 移除所有已处理的带引号键值对
  remainingString = remainingString.replace(/\w+=["'][^"']*["']/g, '');

  // 处理不带引号的键值对: key=value
  const unquotedRegex = /(\w+)=([^\s"']+)/g;
  let unquotedMatch: RegExpExecArray | null;
  while ((unquotedMatch = unquotedRegex.exec(remainingString)) !== null) {
    keyValuePairs.push([unquotedMatch[1], unquotedMatch[2]]);
  }

  // 移除所有已处理的不带引号键值对
  remainingString = remainingString.replace(/\w+=[^\s"']+/g, '');

  return { keyValuePairs, remainingString };
}

/**
 * 提取布尔标志
 * @param metastring 元信息字符串
 * @returns 布尔标志数组
 */
function extractBooleanFlags(metastring: string): string[] {
  const boolFlags = metastring.match(/\b(\w+)\b/g) || [];
  return boolFlags;
}

/**
 * 解析文件信息
 * @param filePath 文件路径字符串，可能包含行号
 * @returns 文件信息对象
 */
function parseFileInfo(filePath: string): FileInfo {
  const fileInfo: FileInfo = {
    path: filePath
  };

  // 检查是否包含行号信息
  const fileMatch = filePath.match(/(.+?)(?:#L(\d+)(?:-L(\d+))?)?$/);
  if (fileMatch) {
    fileInfo.path = fileMatch[1]; // 文件路径
    if (fileMatch[2]) {
      fileInfo.start = parseInt(fileMatch[2], 10);
    }
    if (fileMatch[3]) {
      fileInfo.end = parseInt(fileMatch[3], 10);
    }
  }

  return fileInfo;
}

/**
 * 解析代码块的元信息字符串
 * 支持以下格式:
 * - ```js filename="example.js"
 * - ```js {1-3,5}
 * - ```js title="示例" showLineNumbers
 * - ```showLineNumbers file=./code-snippets/create.js#L4-L29
 *
 * @param metaStr
 * @returns 解析后的元信息对象
 */
function parseCodeMeta(metaStr: string): CodeMeta {
  if (!metaStr) return {};

  const result: CodeMeta = {};

  // 步骤1: 提取语言
  const { language, remainingString: afterLanguage } = extractLanguage(metaStr);
  if (language) {
    result.language = language;
  }

  // 步骤2: 提取高亮信息
  const { highlight, remainingString: afterHighlight } = extractHighlight(afterLanguage);
  if (highlight) {
    result.highlight = highlight;
  }

  // 步骤3: 提取键值对
  const { keyValuePairs, remainingString: afterKeyValues } = extractKeyValuePairs(afterHighlight);

  // 步骤4: 提取布尔标志
  const boolFlags = extractBooleanFlags(afterKeyValues);

  // 步骤5: 处理键值对
  for (const [key, value] of keyValuePairs) {
    if (key === 'file') {
      // 特殊处理文件路径和行号
      result.fileInfo = parseFileInfo(value);
    } else {
      result[key] = value;
    }
  }

  // 步骤6: 处理布尔标志
  for (const flag of boolFlags) {
    result[flag] = true;
  }

  return result;
}



// 导出函数和类型
export {
  parseCodeMeta,
  extractLanguage,
  extractHighlight,
  extractKeyValuePairs,
  extractBooleanFlags,
  parseFileInfo
}
export type {
  CodeMeta,
  HighlightRange,
  FileInfo
};

