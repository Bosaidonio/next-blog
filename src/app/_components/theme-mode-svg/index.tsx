import React from 'react'


export interface ThemeModeSvgProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  width?: string;
}
const ThemeModeSvg =  (props:ThemeModeSvgProps) => {
  const widthMap: Record<string, string> = {
    default: "w-full",
    small: "w-[30px]",
  }
  const {width = 'default'} = props
  return <div className={`${widthMap[width]} flex items-center mr-2.5 fill-black dark:fill-[var(--x-color-slate-200)]`} style={props.style}>
    {props.children}
  </div>
}
export default ThemeModeSvg
