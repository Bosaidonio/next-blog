import { RawCode, highlight } from 'codehike/code'
import { SwitcherClient } from "./annotations/switcher.client"
import React from 'react'
import {Code} from '@/components/code-hike'

export async function CodeSwitcher(props: { code: RawCode[] }) {
  const highlighted = await Promise.all(
    props.code.map((codeblock) => highlight(codeblock, "github-from-css")),
  )
  // 预先渲染所有代码块，并将已渲染的内容传递给客户端组件
  const renderedCodeBlocks = await Promise.all(
    props.code.map(async (codeblock, index) => {
      return {
        lang: highlighted[index].lang,
        renderedHTML: <Code codeblock={codeblock} highlighted={highlighted[index]} transition />
      }
    })
  )

  return <SwitcherClient renderedCodeBlocks={renderedCodeBlocks}  ></SwitcherClient>
}
