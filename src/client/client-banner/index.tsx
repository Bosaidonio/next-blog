'use client';

import { Banner } from 'nextra/components';
import { usePathname } from 'next/navigation';
import type { Dictionary } from '@app/_dictionaries/i18n-config'
interface ClientBannerProps {
  lang: string
  dict: Dictionary
}
export default  function ClientBanner(props: ClientBannerProps ) {
 const pathname = usePathname();
 if (pathname === '/' || pathname === `/${props.lang}/main`) return null;
 const { dict } = props;
 return (
   <Banner storageKey="some-key">
     {dict.bannerTitle}
   </Banner>
 );
}

