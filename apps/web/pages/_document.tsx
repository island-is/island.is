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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var _paq = window._paq = window._paq || [];
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                  var u="https://matomo-dev.dev01.devland.is/";
                  _paq.push(['setTrackerUrl', u+'matomo.php']);
                  _paq.push(['setSiteId', '2']);
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                })();
              `,
            }}
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
