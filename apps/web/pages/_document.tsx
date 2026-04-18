import React from 'react'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

import { PLAUSIBLE_SCRIPT_SRC } from '../constants'
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
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{if(window.location.hostname.indexOf('vefsafn.is')!==-1){document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('script[src]').forEach(function(s){s.remove()})})}}catch(e){}})()`,
            }}
          />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
