import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { defaultLanguage } from 'libs/localization/src/lib/LocaleContext'

interface Props {
  lang: string
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    return { ...initialProps, lang: ctx?.query?.lang ?? defaultLanguage }
  }

  render() {
    const { lang, ...p } = this.props

    return (
      <Html lang={lang}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
