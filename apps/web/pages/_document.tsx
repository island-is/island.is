import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { defaultLanguage } from '../i18n/I18n'

interface Props {
  lang: string
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    // Quick fix to get language from first part of url...
    // TODO: Find a more natural way of retrieving the locale here
    let lang = defaultLanguage

    const locale = ctx.req.url.substring(1, 3)
    const suffix = ctx.req.url.substring(3, 4)

    if (!suffix || suffix.match(/[?/#]/)) {
      lang = locale || lang
    }

    return { ...initialProps, lang }
  }

  render() {
    const { lang } = this.props

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
