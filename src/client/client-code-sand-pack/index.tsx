'use client';
import { Sandpack, SandpackTheme } from '@codesandbox/sandpack-react'
import type {SandpackProps} from '@codesandbox/sandpack-react'
import { freeCodeCampDark,githubLight } from "@codesandbox/sandpack-themes";
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'



export type CodeSandPack = SandpackProps & {
  code?: string;
  filePath?: string;
};

export function ClientCodeSandPack({  code, filePath = '/index.js', ...rest }: CodeSandPack) {
  const files = code
    ? {
      [filePath]: {
        code: code,
        active: true
      }
    }
    : rest.files
  const { theme } = useTheme()
  const [themeMode,setThemeMode] = useState<SandpackTheme>()

  useEffect(()=>{
    if(theme==='dark'){
      setThemeMode(freeCodeCampDark)
    }else{
      setThemeMode(githubLight)
    }
  },[theme])
  return <Sandpack
    theme={themeMode}
    template="vanilla"
    options={{
      showConsoleButton: false,
      showInlineErrors: true,
      showNavigator: true,
      showLineNumbers: true,
      showTabs: true,
      layout: 'console',
      initMode: 'lazy',
      autorun: false,
      recompileMode: "delayed",
      recompileDelay: 1000,
    }}
    files={files}
    {...rest}
  />
}
