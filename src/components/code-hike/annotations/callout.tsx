import { AnnotationHandler, InlineAnnotation } from "codehike/code"
import { CodeMeta } from '@/utils/meta'

export const Callout = (meta: CodeMeta):AnnotationHandler => ({
    name: "callout",
    transform: (annotation: InlineAnnotation) => {
      const { query, lineNumber, fromColumn, toColumn, data } = annotation
      // query 格式: /target/ #type message
      const match = query.match(/^#(\w+)\s+(.*)$/)

      const type = match?.[1] || "default"
      const message = match?.[2] || query
      return {
        name: "callout",
        query: message,
        fromLineNumber: lineNumber,
        toLineNumber: lineNumber,
        data: {
          ...data,
          column: (fromColumn + toColumn) / 2,
          type,
          meta
        },
      }
    },
    Block: ({ annotation, children }) => {
      const { column, type = "default", meta } = annotation.data

      const typeClassMap: Record<string, string> = {
        warning: "bg-yellow-100 border-yellow-400 text-yellow-800",
        error: "bg-red-100 border-red-400 text-red-800",
        info: "bg-blue-100 border-blue-400 text-blue-800",
        success: "bg-green-100 border-green-400 text-green-800",
        default: "vo-callout-bg",
      }

      const className = typeClassMap[type] || typeClassMap["default"]

      const isShowLineNumber = meta.showLineNumber
      const chLength = [true, isShowLineNumber,
        meta.collapsible,
        meta.collapsible
      ].filter((item) => item)
      return (
        <>
          {children}
          <div
            style={{ minWidth: `${column + 4}ch`, '--dynamic-ml': `${chLength.length}ch` }}
            className={`w-fit border    rounded px-2 relative  ml-[var(--dynamic-ml)] mt-1 whitespace-break-spaces ${className}`}
          >
            <div
              style={{ left: `${column}ch` }}
              className={`absolute border-l border-t  w-2 h-2 rotate-45 -translate-y-1/2 -top-[1px]  ${className}`}
            />
            {annotation.query}
          </div>
        </>
      )
    },
  }
)
