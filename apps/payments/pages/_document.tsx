import React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import { defaultLanguage } from '@island.is/shared/constants'
import Script from 'next/script'

interface Props {
  lang: string
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    const langMatch = ctx.asPath.match(/^\/(is|en)(\/|$)/)
    const lang = langMatch ? langMatch[1] : defaultLanguage

    return { ...initialProps, lang }
  }

  render() {
    const { lang } = this.props

    return (
      <Html lang={lang}>
        <Head>
          <Script
            src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js"
            strategy="beforeInteractive"
            crossOrigin="anonymous"
          />
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
