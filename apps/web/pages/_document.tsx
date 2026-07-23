import React from 'react'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

import { RuntimeEnv } from '@island.is/next/utils'

import { PLAUSIBLE_SCRIPT_SRC } from '../constants'
import { buildPublicRuntimeEnv } from '../environments/runtimeEnvironment'
import { getLocaleFromPath } from '../i18n/withLocale'

interface Props {
  lang: Locale
  domain: string
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const domain = process.env.TRACKING_DOMAIN ?? ''
    const lang = getLocaleFromPath(ctx?.req?.url)

    return { ...initialProps, lang, domain }
  }

  render() {
    const { lang, domain } = this.props

    return (
      <Html lang={String(lang)}>
        <Head>
          <RuntimeEnv env={buildPublicRuntimeEnv()} />
          {Boolean(domain) && (
            <script
              defer
              data-domain={domain}
              src={PLAUSIBLE_SCRIPT_SRC}
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
