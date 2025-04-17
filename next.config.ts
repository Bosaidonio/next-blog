import nextra from 'nextra'
import ip from 'ip'

const withNextra = nextra({
    defaultShowCopyCode: true,
    latex: true,
    mdxOptions: {
        rehypePrettyCodeOptions: {
            theme: {
                dark: 'github-dark',
                light: 'solarized-light'
            }
        }
    }
})

export default withNextra({
    reactStrictMode: true,
    devIndicators: false,
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev',ip.address()],
    i18n: {
        locales: ['en', 'zh'],
        defaultLocale: 'en'
    },
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // redirects: async () => [
    //     {
    //         source: '/docs',
    //         destination: '/docs/',
    //         statusCode: 302
    //     }
    // ],
    webpack(config) {
        // rule.exclude doesn't work starting from Next.js 15
        const { test: _test, ...imageLoaderOptions } = config.module.rules.find(
          // @ts-expect-error -- fixme
          rule => rule.test?.test?.('.svg')
        )
        config.module.rules.push({
            test: /\.svg$/,
            oneOf: [
                {
                    resourceQuery: /svgr/,
                    use: ['@svgr/webpack']
                },
                imageLoaderOptions
            ]
        })
        return config
    },
    experimental: {
        turbo: {
            rules: {
                './src/app/_icons/**/*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js'
                }
            }
        },
        optimizePackageImports: [
            // '@app/_icons'
        ]
    }
})
