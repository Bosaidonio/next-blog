import type { MetaRecord } from 'nextra'
import { LinkArrowIcon } from 'nextra/icons'
import { FC, ReactNode } from 'react'


export const ExternalLink: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      {children}&thinsp;
  <LinkArrowIcon
    // based on font-size
    height="1em"
  className="x:inline x:align-baseline x:shrink-0"
    />
    </>
)
}
const meta:MetaRecord =  {
  index: {
    title: "概览",
  },
  _1: {
    type: "separator",
    title: "基础",
  },
  html: "HTML",
  css: "CSS",
  _2: {
    type: "separator",
    title: "核心",
  },

  javascript: "JavaScript",
  typescript: "TypeScript",
  'web-api':"Web API",
  _3: {
    type: "separator",
    title: "框架",
  },
  vue:"Vue",
  react: "React",
}
export default meta
