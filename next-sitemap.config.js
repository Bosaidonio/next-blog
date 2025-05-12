/** @type {import('next-sitemap').IConfig} */
const config =  {
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  generateIndexSitemap: false, // 不生成索引站点地图
  generateRobotsTxt: true, // 生成 robots.txt 文件
  sitemapSize: 7000, // 每个站点地图的最大 URL 数
  changefreq: 'daily', // 更改频率
  priority: 0.7, // 优先级
  robotsTxtOptions: {
    policies: [
      {
        // 允许所有用户访问所有页面
        userAgent: '*',
        // 允许所有页面
        allow: '/',
      },
    ],
  },
}
export default config