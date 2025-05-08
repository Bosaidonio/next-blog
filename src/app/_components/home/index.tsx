
import cn from 'clsx'
import Index from '@client/client-home-icon'
import './page.css'
import Link from 'next/link'
import { getDictionary } from '@app/_dictionaries/get-dictionary'
import {
  NotionDigitalJournaling,
  NotionDigitalPainting,
  NotionWorkingWithComputerContentCreator
} from '@app/_icons/theme-mode-svg'

interface HomeProps {
  lang: string
}
const Home = async (props: HomeProps) => {
  const dict = await getDictionary(props.lang)

  const sections = [
    {
      id: 1,
      title: dict.skillNext,
      description: dict.skillNextDesc,
      icon: <NotionDigitalJournaling />
    },
    {
      id: 2,
      title: dict.skillReact,
      description: dict.skillReactDesc,
      icon: <NotionDigitalPainting />
    },
    {
      id: 3,
      title: dict.skillVue,
      description: dict.skillVueDesc,
      icon: <NotionWorkingWithComputerContentCreator />
    },
  ]
  return <div className="content w-full max-w-full pt-[100px]">
    <div className="home mb-[120px]">
      <div className="hero p-[64px] ms:p-[20px]">
        <div className="container max-w-[1200px] mx-auto flex lg:flex-row md:flex-col sm:flex-col ms:flex-col">
          <div className="main flex-auto">
            <div className="heading flex flex-col lg:text-4xl md:text-3xl sm:text-3xl ms:text-3xl">
              <span className="name clip py-1 mb-8  lg:max-w-[650px]  md:max-w-full ms:max-w-full  font-bold">{dict.welcomeTitle}</span>
              <span
                className="text lg:max-w-[650px]  md:max-w-full ms:max-w-full  font-bold whitespace-pre-wrap tracking-[-0.4px] ">{dict.homeTip}</span>
            </div>
            <p className="my-8 lg:text-2xl  md:text-xl ms:text-xl lg:max-w-[650px]  md:max-w-full ms:max-w-full ">
              {dict.homeDesc}
            </p>
            <div className="flex gap-5 ">
              <Link href="/main/introduction" className="
            px-4 py-2 rounded-sm text-lg bg-black text-slate-200  dark:bg-gray-800  font-bold
            cursor-pointer select-none outline-none
            transition transform-[scale(1)] active:transform-[scale(0.97)]
            ">
                {dict.startButtonText}
              </Link>
              <Link href="https://github.com/Bosaidonio/next-blog" className="
            px-4 py-2 rounded-sm  font-bold
            cursor-pointer select-none outline-none
            transition transform-[scale(1)] active:transform-[scale(0.97)]
            ">
                {dict.githubText}
              </Link>
            </div>
          </div>
          <div className="image lg:w-[500px] md:w-full  sm:w-full">
            <Index />
          </div>
        </div>
        <div className="technology flex flex-col items-center gap-5 lg:mt-40 md:mt-25 ms:mt-15">
          <h3 className="font-bold lg:text-3xl md:text-3xl  ms:text-2xl">{dict.skillDesc}</h3>
          <ul className="flex flex-col gap-8 my-20 ms:my-10">
            {
              sections.map((item, index) => {
                return (
                  <li key={item.id} className={cn("flex gap-8 px-10 ",`${index % 2 === 0 ? 'lg:flex-row mg:flex-row md:max-mg:flex-col ' : 'lg:flex-row-reverse mg:flex-row-reverse md:max-mg:flex-col '}`,'sm:flex-col ms:flex-col')}>
                    <div className="px-5 py-5 lg:w-1/2 md:w-1/2 md:flex md:items-center md:max-mg:w-full  ms:w-full">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-5 lg:justify-center  lg:max-w-1/2 md:max-w-1/2  md:max-mg:max-w-full  ms:max-w-full">
                      <h2 className="text-2xl  my-5 font-bold ">{item.title}</h2>
                      <p className="text-lg ">
                        {item.description}
                      </p>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  </div>
}
export default Home
