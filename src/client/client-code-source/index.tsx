'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import { ButtonIcon, TooltipIcon } from '@/components/derived'
import { PictureInPicture2 } from 'lucide-react'

interface ClientCodeSourceProps {
  children?: React.ReactNode
  source?: string
}

interface CodeBlockProps {
  children: React.ReactNode
}

export const SourceCodeBlock = (props: CodeBlockProps) => {
  const {children } = props
  return     <TabsContent value="source">
    {children}
  </TabsContent>
}
export const ExampleCodeBlock = (props: CodeBlockProps) => {
  const {children } = props
  return   Array.isArray(children) ?
    <TabsContent value="example">
      {
        children.map((item, index) => {
          return <div key={index}>{item}</div>
        })
      }
    </TabsContent>
    :  <TabsContent value="example">
    {children}
  </TabsContent>
}
export const ClientCodeSource = ({children,source}: ClientCodeSourceProps) => {
  const handlePlayground = () => {
    window.open(source)
  }
  return <Tabs defaultValue="source" className="w-full relative">
    <TabsList className="w-[400px]">
      <TabsTrigger value="source">实现</TabsTrigger>
      <TabsTrigger value="example">例子</TabsTrigger>
    </TabsList>
    {children}
    {
      source  ? <TooltipIcon className="absolute right-2 top-0" content="PlayGround" >
        <ButtonIcon onClick={handlePlayground} >
          <PictureInPicture2 />
          Open in Playground
        </ButtonIcon>
      </TooltipIcon> : null
    }

  </Tabs>
}

