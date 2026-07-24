import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { defaultLanguage } from '@island.is/shared/constants'
import { RuntimeEnv } from '@island.is/next/utils'
import { buildPublicRuntimeEnv } from '../environments/runtimeEnvironment'

interface Props {
  lang: string
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    return { ...initialProps, lang: ctx?.query?.lang ?? defaultLanguage }
  }

  render() {
    const { lang } = this.props

    return (
      <Html lang={lang}>
        <Head>
          <RuntimeEnv env={buildPublicRuntimeEnv()} />
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
