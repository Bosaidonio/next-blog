import { AnnotationHandler } from "codehike/code"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

export const Tooltips: AnnotationHandler = {
  name: "tooltip",
  Inline: ({ children, annotation }) => {
    const { query, data } = annotation
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger >
            <div className="underline decoration-dashed">
              {children}
            </div>
          </TooltipTrigger>
          <TooltipContent align="start">
            {data?.children || query}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
}
