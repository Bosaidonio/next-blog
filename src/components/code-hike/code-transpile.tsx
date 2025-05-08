/*
 * @Date: 2025-05-08 14:20:23
 * @LastEditors: Bosaidonio Bosaidonio@163.com
 * @LastEditTime: 2025-05-08 14:44:57
 * @Description: Do not edit
 */
import { Block, CodeBlock, parseProps } from 'codehike/blocks'
import {  RawCode } from 'codehike/code'
// CodeTabs is the component from the tabs example
import { CodeWithTabs } from '@/components/code-hike'
import ts from 'typescript'
import { z } from 'zod'

const Schema = Block.extend({ transpile: z.array(CodeBlock) })
interface CodeTranspileProps {
  transpile: RawCode[]
}
export async function CodeTranspile(props: CodeTranspileProps) {
  const rawData = parseProps(props, Schema)
  const codeblock = rawData.transpile[0]
  const result = ts.transpileModule(codeblock.value, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ESNext,
    },
  })

  const tsCode = {
    ...codeblock,
    meta: 'title=typescript',
  }
  const jsCode = {
    ...codeblock,
    value: result.outputText,
    lang: 'js',
    meta: 'title=javascript',
  }

  return <CodeWithTabs tabs={[tsCode, jsCode]} />
}
