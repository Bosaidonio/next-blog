import path from 'node:path'
import fs from 'node:fs'

const MARKDOWN_EXTENSION_RE = /\.mdx?$/
const CWD = process.cwd()

export function generateMarkdownMeta(
  {
    inputPath,
    outputPath = path.join(CWD, 'nextra-meta/meta.json')
  }) {
  console.log(`---------------✅ start ---------------`)
  const filePaths = []
  function walk(dir) {
    const items = fs.readdirSync(dir)
    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stats = fs.statSync(fullPath)

      if (stats.isDirectory()) {
        walk(fullPath)
      } else if (stats.isFile() && MARKDOWN_EXTENSION_RE.test(item)) {
        // ✅ 相对于 inputPath，而不是 CWD
        const relative = path.relative(inputPath, fullPath);
        console.log(`✅ Handle file ${fullPath} `)
        filePaths.push(relative);
      }
    })
  }
  inputPath = path.join(CWD, inputPath)
  outputPath = path.join(CWD, outputPath)

  walk(inputPath)

  const result = {
    docsPath: inputPath,
    filePaths
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8')
  console.log(`✅ All files from "${inputPath}" saved to "${outputPath}"`)
  console.log(`---------------✅ end ---------------\n`)
  return result
}


