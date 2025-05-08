
import { AnnotationHandler, CodeAnnotation, highlight, HighlightedCode, Pre, RawCode } from 'codehike/code'
import {
  Callout,
  ClassName,
  Collapse,
  CollapseContent,
  CollapseTrigger,
  CopyButton,
  Diff,
  FileName,
  Focus,
  Fold,
  Line,
  LineNumbers,
  Mark,
  Link,
  TokenTransitions,
  Tooltips,
  Wave
} from './annotations'
import { cn, parseCodeMeta } from '@/utils'
import './theme.css'
import { ReactNode } from 'react'
import ts from 'typescript'
const isContainAnnotation = (annotation: CodeAnnotation[], annotationName: string): boolean => {
  return annotation.some(annotation => annotation.name === annotationName)
}

// 处理代码元数据的函数
async function processCodeMeta(codeblock: RawCode, highlighted: HighlightedCode | undefined) {
  // 如果没有提供高亮代码，则进行高亮处理
  if (!highlighted && codeblock) {
    highlighted = await highlight(codeblock, 'github-from-css')
  }

  // 解析元数据
  const codeMeta = parseCodeMeta(codeblock.meta)

  // 设置语言
  if (codeblock.lang) {
    codeMeta.language = codeblock.lang
  }

  // 处理特殊注解
  if (highlighted) {
    // 检查是否包含折叠注解
    if (isContainAnnotation(highlighted.annotations, 'collapse')) {
      codeMeta.collapsible = true
    }

    // 检查是否包含焦点注解
    if (isContainAnnotation(highlighted.annotations, 'focus')) {
      codeMeta.focus = true
    }
  }

  return { codeMeta, highlighted }
}

// 构建处理程序列表的函数
function buildHandlers(codeMeta: ReturnType<typeof parseCodeMeta>) {
  const handlers = [
    Line,
    Callout(codeMeta),
    ClassName,
    Collapse,
    CollapseContent,
    CollapseTrigger,
    Mark,
    Diff,
    Focus,
    Link,
    Fold,
    TokenTransitions,
    Tooltips,
    Wave
  ]

  // 如果需要显示行号，添加行号处理程序
  if (codeMeta.showLineNumber) {
    handlers.push(LineNumbers)
  }

  return handlers
}

// 文件名组件
const FileNameHeader = ({ filename }: { filename: string | undefined }): ReactNode => {
  return filename ? <FileName filename={filename} /> : null
}

// 代码内容组件
interface CodeContentProps {
  highlighted: HighlightedCode;
  handlers: AnnotationHandler[];
  hasFocus: boolean;
  hasFilename: boolean;
  hasTransition: boolean | undefined
}

const CodeContent = ({ highlighted, handlers, hasFocus, hasFilename,hasTransition }: CodeContentProps) => {
  // console.log('highlighted',highlighted.annotations)
  return (
    <div className={cn(hasFocus && 'has-focused-lines')}>
      <div className={cn(
        'vo-copy-btn absolute hidden group-hover:block top-3 right-3 z-10',
        hasFilename ? 'top-14' : 'top-3'
      )}>
        <CopyButton text={highlighted.code} />
      </div>
      <Pre
        code={highlighted}
        handlers={handlers}
        className={cn(
          'vo-pre-bg overflow-auto overscroll-x-auto py-3 px-4',
          hasFilename ? 'rounded-b-xl rounded-t-none' : 'rounded-xl',
          hasTransition && 'transition'
        )}
      />
    </div>
  )
}

function _transpile(codeblock: RawCode, codeMeta: ReturnType<typeof parseCodeMeta>) {
  if (!codeMeta.transpile) {
    return [
      {
        lang: 'ts',
        value: '',
        meta: '',
      },
      {
        lang: 'js',
        value: '',
        meta: '',
      },
    ]
  }
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
  return [tsCode, jsCode]
}

// 主要的 Code 组件
export async function Code({ codeblock, highlighted,transition }: { codeblock: RawCode, highlighted?: HighlightedCode,transition?: boolean }) {

  // 处理代码元数据
  const { codeMeta, highlighted: processedHighlighted } = await processCodeMeta(codeblock, highlighted)

  if (!processedHighlighted) {
    throw new Error('Failed to process code highlighting')
  }

  // 构建处理程序
  const handlers = buildHandlers(codeMeta)

  // 检查是否有文件名
  const hasFilename = !!codeMeta.filename

  // 编译ts
  // const [tsCode, jsCode] = transpile(codeblock, codeMeta)

  return <div className="relative group mt-3 vo-code-wrapper">
      {/* 显示文件名 */}
      <FileNameHeader filename={codeMeta.filename as string} />

      {/* 显示代码内容 */}
      <CodeContent
        highlighted={processedHighlighted}
        handlers={handlers}
        hasFocus={!!codeMeta.focus}
        hasTransition={transition}
        hasFilename={hasFilename}
      />
    </div>

}
