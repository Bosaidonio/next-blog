
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Pre, withIcons } from 'nextra/components'
import { GitHubIcon } from 'nextra/icons'
import { Code } from "@/components/code-hike/code"
const docsComponents = getDocsMDXComponents({
    pre: withIcons(Pre, { js: GitHubIcon }),

})


export const useMDXComponents: typeof getDocsMDXComponents = components => ({
    ...docsComponents,
    ...components,
    Code
})
