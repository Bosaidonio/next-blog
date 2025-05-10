import nextra from 'nextra'
import ip from 'ip'
// 如果需要引入插件，运行命令时不能使用： next dev --turbopack
import { recmaCodeHike, remarkCodeHike } from 'codehike/mdx'
import codeImport from 'remark-code-import'
import path from 'path'
const chConfig = {
  components: { code: 'Code' },
}

const withNextra = nextra({
  defaultShowCopyCode: true,
  latex: true,
  mdxOptions: {
    remarkPlugins: [
      () =>
        codeImport({
          rootDir: path.resolve(__dirname, './src/code-snippets')
        }),
      [remarkCodeHike, chConfig],
    ],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
})

export default withNextra({
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', ip.address()],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh',
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  redirects: async () => [
    {
      source: '/',
      destination: '/main',
      statusCode: 302,
    },
    {
      source: '/frontend',
      destination: '/frontend/dashboard',
      statusCode: 302,
    },
  ],
  webpack(config) {
    // rule.exclude doesn't work starting from Next.js 15
    const { test: _test, ...imageLoaderOptions } = config.module.rules.find(
      // @ts-expect-error -- fixme
      (rule) => rule.test?.test?.('.svg')
    )
    // 写入配置文件
    config.module.rules.push({
      test: /\.svg$/,
      oneOf: [
        {
          resourceQuery: /svgr/,
          use: ['@svgr/webpack'],
        },
        imageLoaderOptions,
      ],
    })
    // config.module.rules.push(
    //   {
    //     test: /.*/, // 匹配所有文件扩展名（如果想包含目录下的所有文件类型）
    //     // test: /\.(py)$/, // 示例：匹配多种文件类型
    //     include: path.resolve(__dirname, './src/code-snippets'),
    //     use: 'raw-loader'
    //   }
    // )
    return config
  },
  experimental: {
    turbo: {
      rules: {
        './src/app/_icons/**/*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    optimizePackageImports: [
      // '@app/_icons'
    ],
  },
})
