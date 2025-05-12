'use client'
import { DocSearch } from '@docsearch/react'
import { usePathname } from 'next/navigation'
import '@docsearch/css'

interface AlgoliaSearchProps {
  appId: string
  apiKey: string
  indexName: string
}

export default function AlgoliaSearch({appId,apiKey,indexName}:AlgoliaSearchProps) {
  const locale = usePathname().split('/')[1]
  console.log(appId,apiKey,indexName)
  return (
    <DocSearch
      appId={appId}
      apiKey={apiKey}
      indexName={indexName}
      insights={true}
      searchParameters={{
        facetFilters: [`lang:${locale}`],
      }}
    />
  )
}
