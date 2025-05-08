"use client"

import React, { ReactNode, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RenderedCodeBlock {
  lang: string;
  renderedHTML: ReactNode;
}
export function SwitcherClient({ renderedCodeBlocks }: { renderedCodeBlocks: RenderedCodeBlock[] }) {
  const [selectedLang, setSelectedLang] = useState(renderedCodeBlocks[0].lang)
  const currentCodeBlock = renderedCodeBlocks.find((block) => block.lang === selectedLang)!

  return (
    <div className="relative group">
      {currentCodeBlock.renderedHTML}
      <div className="hidden group-hover:block absolute bottom-2 right-2">
        <Select  value={selectedLang} onValueChange={setSelectedLang}>
          <SelectTrigger size="sm" className=" bg-white  dark:bg-gray-800  " >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {renderedCodeBlocks.map(({ lang }, index) => (
              <SelectItem key={index} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
