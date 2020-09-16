import React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import { getLocaleFromPath } from '../i18n/withLocale'

interface Props {
  lang: Locale
  domain: string
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const domain = process.env.TRACKING_DOMAIN ?? ''
    const lang = getLocaleFromPath(ctx.req.url)

    return { ...initialProps, lang, domain }
  }

  render() {
    const { lang, domain } = this.props

    return (
      <Html lang={String(lang)}>
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
