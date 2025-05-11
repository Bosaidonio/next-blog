'use client';
import { DocSearch } from '@docsearch/react';
import { usePathname } from 'next/navigation';
import '@docsearch/css';


export default function AlgoliaSearch() {
  const locale = usePathname().split('/')[1];
  return (
    <DocSearch
      appId="BY658UP9FT"
      apiKey="917f0550018b7306daefeddf69da5c2f"
      indexName="idash"
      insights={true}
      searchParameters={{
        facetFilters: [`lang:${locale}`],
      }}
    />
  )
}