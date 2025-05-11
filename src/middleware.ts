export { middleware } from 'nextra/locales'

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind|sitemap.xml|sitemap-[0-9]+.xml|robots.txt).*)'
  ]
}
