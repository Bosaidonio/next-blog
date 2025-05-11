import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import React from "react";
import { Inter } from 'next/font/google'
// import { getDocsPageMap  } from '@/utils/pageMap'
import './globals.css'
import { getDictionary } from '@app/_dictionaries/get-dictionary'
import ServerBanner from '@app/[lang]/server-banner'
import IsHome from '@app/_components/is-home'
import AlgoliaSearch from '@/components/algolia-search'
const fontClass = Inter({
  weight: ['400','600','700'],
  subsets: ['latin','latin-ext'],
})


export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>;
}

export default async function RootLayout(props:LayoutProps) {
  const { lang } = await props.params
  const children = props.children
  const pageMap = await getPageMap(`/${lang}`)
  const _dict = await getDictionary(lang)
  // const docsPageMap = await getDocsPageMap()
  // 初始化 pageMap
  const banner = <ServerBanner params={props.params} />;
  const navbar = (
    <>
      <Navbar
        logo={
          <>
            <div className="flex justify-center items-center w-[30px] h-[30px] mr-2.5 rounded-full font-bold text-gray-200 bg-[var(--color-black)] dark:bg-[var(--color-white)] dark:text-gray-950">M</div>
            <b>Bosaidon</b>
          </>
        }
      />
      <AlgoliaSearch />
    </>
  )
  const footer = <div className="my-footer-bg pt-5 border-t vo-border-color cover-nextra-bg-color"><Footer>MIT {new Date().getFullYear()} © Next.js.</Footer></div>

  return (
    <html
      lang={lang}
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
        backgroundColor={{
          // dark: '#040711',
          dark: '#18181B',
          light: 'rgb(255, 255, 255)',
        }}
      >
      </Head>
      <body className={`w-dvw h-dvh flex flex-col ${fontClass.className} `}>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/bosaidonio/next-blog/tree/main"
          footer={footer}
          i18n={[
            { locale: 'en', name: 'English' },
            { locale: 'zh', name: '简体中文' },
          ]}
          // ... Your additional layout options
        >
          <IsHome>{children}</IsHome>
        </Layout>
      </body>
    </html>
  )
}
