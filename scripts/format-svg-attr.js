import fs from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio'
import jsBeautify from 'js-beautify'
/**
 * 清理 SVG 文件中的属性
 * @param {String} inputDir 输入目录
 * @param {String} outputDir 输出目录
 * @param {Array} allowedAttrs 自定义保留的属性
 * @param {Array} removedAttrs 自定义删除的属性
 */
function cleanSvgFiles(inputDir, outputDir, allowedAttrs, removedAttrs) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.readdirSync(inputDir)
    .filter(file => file.endsWith('.svg'))
    .forEach(file => {
      const filePath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);

      const data = fs.readFileSync(filePath, 'utf8');
      const $ = cheerio.load(data, { xmlMode: true });

      $('path').each((_, el) => {
        // 处理直接在 <path> 上的属性
        Object.keys(el.attribs).forEach(attr => {
          const value = el.attribs[attr];

          // 如果属性在删除列表中，移除
          if (removedAttrs.includes(attr)) {
            $(el).removeAttr(attr);
          }

          // 如果属性在保留列表中，保留
          if (allowedAttrs.includes(attr)) {
            $(el).attr(attr, value);
          }
        });

        // 处理 style 属性中的 CSS
        const rawStyle = $(el).attr('style');
        let foundStroke = false;

        if (rawStyle) {
          const stylePairs = rawStyle
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

          stylePairs.forEach(pair => {
            const [key, value] = pair.split(':').map(p => p.trim());

            if (removedAttrs.includes(key)) {
              return; // 跳过删除的属性
            }

            if (allowedAttrs.includes(key)) {
              $(el).attr(key, value);
              if (key === 'stroke') foundStroke = true;
            }
          });

          $(el).removeAttr('style');
        }

        // 如果没有 stroke 属性，默认添加一个 stroke
        if (!foundStroke && !$(el).attr('stroke')) {
          $(el).attr('stroke', 'black');
        }
      });
      // 设置svg元素上的width和height
      $(`svg`).attr({
        width: '100%',
        height: '100%',
      });
      const xml = $.xml();
      const formatXml = jsBeautify.html(xml,{
        "indent_size": "4",
        "indent_char": " ",
        "max_preserve_newlines": "5",
        "preserve_newlines": true,
        "keep_array_indentation": false,
        "break_chained_methods": false,
        "indent_scripts": "normal",
        "brace_style": "collapse",
        "space_before_conditional": true,
        "unescape_strings": false,
        "jslint_happy": false,
        "end_with_newline": false,
        "wrap_line_length": "40",
        "indent_inner_html": false,
        "comma_first": false,
        "e4x": false,
        "indent_empty_lines": false
      })
      fs.writeFileSync(outputPath, formatXml);
      console.log(`✔ 已处理: ${file}`);
    });

  console.log('🎉 所有 SVG 文件已处理完毕');
}
// 自定义保留的属性
const allowedAttrs = [
  'stroke',             // 保留 stroke 属性
  'stroke-width',       // 保留 stroke-width
  'stroke-linecap',     // 保留 stroke-linecap
  'stroke-linejoin',    // 保留 stroke-linejoin
  'opacity'             // 保留 opacity
];

// 自定义删除的属性
const removedAttrs = [
  'fill',               // 删除 fill 属性
  'color',              // 删除 color 属性
];
// cleanSvgFiles(
//   './public/assets/svg',
//   './public/assets/svg',
//   allowedAttrs,
//   removedAttrs
//   )
