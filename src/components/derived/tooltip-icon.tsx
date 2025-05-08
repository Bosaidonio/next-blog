import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import React from 'react'


export interface TooltipIconProps {
  children: React.ReactNode
  content: string
  className?: string
}

export function TooltipIcon({
  children,
  content,
  className,
}: TooltipIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent >{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
