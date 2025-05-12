import * as fs from 'fs'
import * as path from 'path'
import { XMLParser } from 'fast-xml-parser'
import { crawlUrl } from './request'
import Scheduler from './scheduler'
import chalk from 'chalk'

// 定义 sitemap.xml 文件路径
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
// 每批次处理的URL数量
const BATCH_SIZE = 30

async function startAlgoliaIndex() {
  try {
    // 读取 sitemap.xml 文件
    const xmlData = fs.readFileSync(sitemapPath, 'utf-8')

    // 创建解析器
    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (name) => name === 'url',
    })

    // 解析 XML 数据
    const result = parser.parse(xmlData)

    // 提取所有 URL，并筛选只包含 zh 的 URL
    const urls = result.urlset.url
      .map((urlObj: { loc: string }) => urlObj.loc)
      .filter((url: string) => url.includes('/zh/'))


    // 将URLs分批处理
    const batches = []
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      batches.push(urls.slice(i, i + BATCH_SIZE))
    }

    console.log(chalk.bold.blue(`总共找到 ${urls.length} 个URL需要爬取,将分成 ${batches.length} 批次进行处理，每批次最多 ${BATCH_SIZE} 个URL`))
    console.log('-----------------------------------')

    // 创建调度器实例
    const scheduler = new Scheduler()
    
    // 设置任务间隔时间（毫秒）
    scheduler.setPauseBetweenTasks(1000)
    
    // 设置进度回调
    scheduler.setProgressCallback((data) => {
      const taskId = data.result?.data?.taskId || '无任务ID'
      console.log(chalk.green(`✓ 任务 ${data.name} 成功完成`))
      console.log(`  任务ID: ${taskId}`)
      console.log(`  进度: ${data.progress.completed}/${data.progress.total} 完成，${data.progress.failed} 失败，${data.progress.total - data.progress.completed - data.progress.failed} 剩余`)
      console.log('-----------------------------------')
    })
    
    // 设置错误回调
    scheduler.setErrorCallback((data) => {
      console.log(chalk.red(`✗ 任务 ${data.name} 执行失败`))
      console.log(`  错误信息: ${data.error}`)
      console.log(`  进度: ${data.progress.completed}/${data.progress.total} 完成，${data.progress.failed} 失败，${data.progress.total - data.progress.completed - data.progress.failed} 剩余`)
      console.log('-----------------------------------')
    })
    
    // 设置完成回调
    scheduler.setCompleteCallback((stats) => {
      console.log(chalk.bold.green('🎉 所有爬虫任务处理完成！'))
      console.log(`  总任务数: ${stats.total}`)
      console.log(`  成功完成: ${stats.completed}`)
      console.log(`  失败任务: ${stats.failed}`)
      console.log('===================================')
    })
    
    // 添加所有批次任务到调度器
    batches.forEach((batchUrls, index) => {
      const batchName = `批次 ${index + 1}/${batches.length}`      
      scheduler.addTask(
        () => crawlUrl({ urls: batchUrls }),
        batchName
      )
    })
    
  } catch (error) {
    console.error(chalk.red('添加爬虫地址时出错:'), error)
  }
}

startAlgoliaIndex()