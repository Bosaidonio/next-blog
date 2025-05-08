import { Button } from "@/components/ui/button"
import React from 'react'

export interface ButtonIconProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}
export function ButtonIcon(props: ButtonIconProps) {

  const { className = "",children, ...rest } = props
  return (
    <Button  className={className} {...rest}>
      {children}
    </Button>
  )
}
