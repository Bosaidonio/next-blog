import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并类名并解决Tailwind类名冲突
 * 使用clsx处理条件类名，然后使用tailwind-merge合并相同类型的Tailwind类
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
