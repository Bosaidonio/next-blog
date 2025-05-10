'use client';

import { usePathname } from 'next/navigation'

interface IsHomeProps {
  children: React.ReactNode
}

 const IsHome = (props: IsHomeProps) => {
   const pathname = usePathname()
   const { children } = props
   if (pathname === '/' || pathname.indexOf('/main') > -1) {
     return <div className='is-home'>{children}</div>
   } else {
     return children
   }
 }
export default IsHome