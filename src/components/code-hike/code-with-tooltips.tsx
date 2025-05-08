import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { Pre, highlight } from "codehike/code"
import { z } from "zod"
import { Code } from '@/components/code-hike'
import { Tooltips } from '@/components/code-hike/annotations'

const Schema = Block.extend({
  code: CodeBlock,
  tooltips: z.array(Block).optional(),
})


export async function CodeWithTooltips(props: unknown) {
  const { code, tooltips = [] } = parseProps(props, Schema)
  const highlighted = await highlight(code, 'github-from-css')

  highlighted.annotations = highlighted.annotations.map((a) => {
    const tooltip = tooltips.find((t) => t.title === a.query)
    if (!tooltip) return a
    return {
      ...a,
      data: { ...a.data, children: tooltip.children },
    }
  })
  return <Code codeblock={code} highlighted={highlighted}  />
}
