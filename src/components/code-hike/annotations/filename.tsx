import { cn } from '@/utils/cn'
import {
  FileJson, FileText, FileCode,
  FileImage, FileVideo, FileAudio,
  FileSpreadsheet, FileTerminal,
  FileArchive,
  LucideIcon
} from 'lucide-react'
import React from 'react'
import { FileInfo, HighlightRange } from '@/utils/meta'
import { NotionCss, NotionHtml, NotionJavascript, NotionTypescript } from '@app/_icons'

type IconComponentType = LucideIcon & React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>
  & React.RefAttributes<SVGSVGElement>> | React.ComponentType<React.SVGProps<SVGSVGElement>>;

// 定义文件类型信息接口
interface FileTypeInfo {
  icon:  IconComponentType
  color: string;
}

// 定义文件类型映射类型
type FileTypesMap = {
  [key: string]: FileTypeInfo;
}

// 文件扩展名到图标的映射和颜色
const fileTypes: FileTypesMap = {
  // JavaScript 相关
  js: { icon: NotionJavascript, color: 'text-yellow-500' },
  jsx: { icon: NotionJavascript, color: 'text-blue-500' },
  ts: { icon: NotionTypescript, color: 'text-blue-600' },
  tsx: { icon: NotionTypescript, color: 'text-blue-500' },
  json: { icon: FileJson, color: 'text-yellow-400' },

  // Web 相关
  html: { icon: NotionHtml, color: 'text-orange-500' },
  css: { icon: NotionCss, color: 'text-blue-400' },
  scss: { icon: FileCode, color: 'text-pink-500' },
  sass: { icon: FileCode, color: 'text-pink-600' },
  less: { icon: FileCode, color: 'text-blue-300' },

  // 后端相关
  php: { icon: FileCode, color: 'text-purple-500' },
  py: { icon: FileCode, color: 'text-green-500' },
  java: { icon: FileCode, color: 'text-red-500' },
  rb: { icon: FileCode, color: 'text-red-600' },
  go: { icon: FileCode, color: 'text-blue-400' },
  rs: { icon: FileCode, color: 'text-orange-600' },
  cs: { icon: FileCode, color: 'text-green-600' },
  sql: { icon: FileCode, color: 'text-blue-700' },

  // 媒体文件
  png: { icon: FileImage, color: 'text-green-400' },
  jpg: { icon: FileImage, color: 'text-green-500' },
  jpeg: { icon: FileImage, color: 'text-green-500' },
  gif: { icon: FileImage, color: 'text-purple-400' },
  svg: { icon: FileImage, color: 'text-orange-400' },
  mp4: { icon: FileVideo, color: 'text-red-400' },
  webm: { icon: FileVideo, color: 'text-red-500' },
  mp3: { icon: FileAudio, color: 'text-purple-500' },
  wav: { icon: FileAudio, color: 'text-purple-600' },

  // 文档文件
  pdf: { icon: FileText, color: 'text-red-600' },
  doc: { icon: FileText, color: 'text-blue-600' },
  docx: { icon: FileText, color: 'text-blue-600' },
  txt: { icon: FileText, color: 'text-gray-600' },
  md: { icon: FileText, color: 'text-blue-300' },

  // 数据和压缩文件
  xls: { icon: FileSpreadsheet, color: 'text-green-600' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-600' },
  csv: { icon: FileSpreadsheet, color: 'text-green-500' },
  zip: { icon: FileArchive, color: 'text-yellow-600' },
  rar: { icon: FileArchive, color: 'text-yellow-700' },
  tar: { icon: FileArchive, color: 'text-yellow-600' },
  gz: { icon: FileArchive, color: 'text-yellow-500' },

  // 配置文件
  env: { icon: FileTerminal, color: 'text-gray-600' },
  gitignore: { icon: FileTerminal, color: 'text-gray-700' },
  yml: { icon: FileTerminal, color: 'text-gray-500' },
  yaml: { icon: FileTerminal, color: 'text-gray-500' },
  toml: { icon: FileTerminal, color: 'text-gray-600' },
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 文件扩展名（小写）
 */
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * 获取文件图标和颜色信息
 * @param filename 文件名
 * @returns 包含图标组件和颜色的对象
 */
function getFileInfo(filename: string): FileTypeInfo {
  const ext = getFileExtension(filename);
  return fileTypes[ext] || { icon: FileText, color: 'text-gray-500' }; // 默认值
}

interface FileNameProps {
  filename: string | number | true | HighlightRange[] | FileInfo
}

/**
 * 显示带有图标的文件名组件
 * 根据文件扩展名自动显示相应的图标和颜色
 */
export function FileName({ filename }: FileNameProps): React.ReactElement | null {
  if (!filename || typeof filename !== 'string') return null;

  const { icon: Icon, color } = getFileInfo(filename);

  return (
    <div
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-[var(--vo-pre-bg-dark-1)] border-b border-gray-200 dark:border-gray-400 rounded-t-xl h-12  ">
      <Icon  className={cn("w-4 h-4 mr-2 w-4 h-6", color)} />
      <span>{filename}</span>
    </div>
  );
}
