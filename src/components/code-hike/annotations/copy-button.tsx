/*
 * @Date: 2025-05-06 16:24:41
 * @LastEditors: Bosaidonio Bosaidonio@163.com
 * @LastEditTime: 2025-05-08 13:57:51
 * @Description: Do not edit
 */
'use client'

import { useState } from 'react'
import { Check, Clipboard } from 'lucide-react'

import { Button } from '@/components/ui/button'
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-7 h-7 bg-white text-black dark:text-white hover:bg-gray-400/20 dark:bg-gray-800 dark:hover:bg-gray-400/20 rounded"
      aria-label="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
      }}
    >
      {copied ? <Check size={14} /> : <Clipboard size={14} />}
    </Button>
  )
}
