import axios from 'axios'

const ALGOLIA_CRAWLER_USER_ID = process.env.ALGOLIA_CRAWLER_USER_ID
const ALGOLIA_CRAWLER_API_KEY = process.env.ALGOLIA_CRAWLER_API_KEY 
const ALGOLIA_CRAWLER_ID = process.env.ALGOLIA_CRAWLER_ID 
// 生成base64编码的API密钥
function generateApiKey() {
  const credentials = `${ALGOLIA_CRAWLER_USER_ID}:${ALGOLIA_CRAWLER_API_KEY}`
  const buffer = Buffer.from(credentials)
  return buffer.toString('base64')
}

const request = axios.create({
  baseURL: `https://crawler.algolia.com/api/1/crawlers/${ALGOLIA_CRAWLER_ID}`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${generateApiKey()}`,
  },
  timeout: 10000,
})

// 更新爬虫配置
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCrawlerConfig = (data: any) => {
  return request({
    method: 'PATCH',
    url: '/config',
    data: data,
  })
}
// 获取爬虫配置版本
export const getCrawlerConfigVersion = () => {
  return request({
    method: 'GET',
    url: '/config/versions',
  })
}
// 抓取url
export const crawlUrl = (data: { urls: string[] }) => {
  return request({
    method: 'POST',
    url: '/urls/crawl',
    data: data,
  })
}