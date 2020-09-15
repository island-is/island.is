import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { defaultLanguage } from '../i18n/I18n'

const getDomain = (host: string): string => {
  if (typeof host === 'string') {
    host = host.split(':')[0]
    if (host.match(/\.?island\.is$/)) {
      return host.replace(/^www\./, '')
    }
  }

  return ''
}

interface Props {
  lang: string
  domain: string
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    // Quick fix to get language from first part of url...
    // TODO: Find a more natural way of retrieving the locale here
    let lang = defaultLanguage

    const domain = getDomain(ctx.req.get('host'))
    const locale = ctx.req.url.substring(1, 3)
    const suffix = ctx.req.url.substring(3, 4)

    if (!suffix || suffix.match(/[?/#]/)) {
      lang = locale || lang
    }

    return { ...initialProps, lang, domain }
  }

  render() {
    const { lang, domain } = this.props

    return (
      <Html lang={lang}>
        <Head>
          {Boolean(domain) && (
            <script
              async
              defer
              data-domain={domain}
              src="https://plausible.io/js/plausible.js"
            ></script>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
