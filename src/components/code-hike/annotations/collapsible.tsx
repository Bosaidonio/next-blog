import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon } from "lucide-react"
import { AnnotationHandler, BlockAnnotation, InnerLine } from 'codehike/code'
import React from 'react'

export const Collapse: AnnotationHandler = {
  name: "collapse",
  transform: (annotation: BlockAnnotation) => {
    const { fromLineNumber } = annotation
    return [
      annotation,
      {
        ...annotation,
        fromLineNumber: fromLineNumber,
        toLineNumber: fromLineNumber,
        name: "CollapseTrigger",
      },
      {
        ...annotation,
        fromLineNumber: fromLineNumber + 1,
        name: "CollapseContent",
      },
    ]
  },
  Block: ({ annotation, children }) => {
    return (
      <Collapsible defaultOpen={annotation.query !== "collapsed"}>
        {children}
      </Collapsible>
    )
  },
}

const icon = (
  <ChevronDownIcon
    className="inline-block group-data-[state=closed]:-rotate-90 transition select-none opacity-30 group-data-[state=closed]:opacity-80 group-hover:!opacity-100 mb-0.5"
    size={15}
  />
)
export const CollapseTrigger: AnnotationHandler = {
  name: "CollapseTrigger",
  onlyIfAnnotated: true,
  AnnotatedLine: ({ annotation: _annotation, ...props }) => (
    <CollapsibleTrigger className="group contents">
      <InnerLine merge={props} data={{ icon }} />
    </CollapsibleTrigger>
  ),
  Line: (props) => {
    const icon = props.data?.icon as React.ReactNode
    return (
      <div className="table-row">
        <span className="w-5 text-center table-cell">{icon}</span>
        <div className="table-cell">
          <InnerLine merge={props} />
        </div>
      </div>
    )
  },
}

export const CollapseContent: AnnotationHandler = {
  name: "CollapseContent",
  Block: CollapsibleContent,
}
