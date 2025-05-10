import ClientBanner from '@client/client-banner'
import { getDictionary } from '@app/_dictionaries/get-dictionary'

interface ClientBannerProps {
  params: Promise<{ lang: string }>;
}
export default async function ServerBanner(props: ClientBannerProps) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)
  return <ClientBanner lang={lang} dict={dict} />
}
