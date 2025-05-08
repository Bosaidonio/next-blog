/*
 * @Date: 2025-05-07 17:39:04
 * @LastEditors: Bosaidonio Bosaidonio@163.com
 * @LastEditTime: 2025-05-08 14:42:06
 * @Description: Do not edit
 */
import { Block, CodeBlock, parseProps } from 'codehike/blocks'
import { highlight, RawCode } from 'codehike/code'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code } from './code'
import { parseCodeMeta } from '@/utils'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'

const Schema = Block.extend({ tabs: z.array(CodeBlock) })
interface CodeWithTabs {
  tabs: RawCode[]
}
export async function CodeWithTabs(props: CodeWithTabs) {
  const { tabs } = parseProps(props, Schema)
  return <CodeTabs tabs={tabs} />
}

export async function CodeTabs(props: { tabs: RawCode[] }) {
  const { tabs } = props
  const highlighted = await Promise.all(tabs.map((codeBlock) => highlight(codeBlock, 'github-from-css')))
  const codeMetaList = tabs.map((codeBlock) => {
    const codeMeta = parseCodeMeta(codeBlock.meta)
    codeMeta.id = uuidv4()
    return {
      codeMeta,
      codeBlock,
    }
  })

  return (
    <Tabs defaultValue={codeMetaList[0]?.codeMeta?.title}>
      <TabsList className=" w-[400px]">
        {codeMetaList.map((code) => (
          <TabsTrigger key={code.codeMeta.id} value={code.codeMeta.title}>
            {code.codeMeta.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {codeMetaList.map((code, i) => (
        <TabsContent key={code.codeMeta.id} value={code.codeMeta.title} className="mt-0">
          <Code codeblock={code.codeBlock} highlighted={highlighted[i]}></Code>
        </TabsContent>
      ))}
    </Tabs>
  )
}
