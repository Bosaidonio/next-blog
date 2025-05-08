'use client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import {NotionUsingComputer2} from '@app/_icons'


interface ClientHomeIconProps {
  isAnimation?: boolean;
}

export default function ClientHomeIcon(props:ClientHomeIconProps): React.JSX.Element{
  const [isShow,setShow] = useState<boolean | null>(null)
  const { isAnimation = false } = props
  useEffect(() => {
    if(!isAnimation) {
      return
    }
    setShow(true)
    if(window.gsap){
      console.log('window.gsap',window.gsap)
      window.gsap.set('#drawing path', {
        drawSVG: '0%',
        fill: 'none'
      })
      // 2. 路径绘制动画
      window.gsap.to('#drawing path', {
        drawSVG: '100%',
        duration: 0.5,
        stagger: 0,
        ease: 'power1.inOut',
        onComplete: () => {
          // 3. 动画后再显示填充色
          gsap.to('#drawing path', {
            fill: '#000', // 或原来的颜色
            duration: 0.5
          })
        }
      })
    }
  }, [isAnimation])
  return  <NotionUsingComputer2 className="fill-black dark:fill-[var(--x-color-slate-200)]"  id="drawing" style={{display: !isAnimation || !isShow ? 'block' : 'none'}} />
}
