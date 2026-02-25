import React from 'react'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

import { MatomoInitScript } from '@island.is/matomo'

import { PLAUSIBLE_SCRIPT_SRC } from '../constants'
import { getLocaleFromPath } from '../i18n/withLocale'

interface Props {
  lang: Locale
  domain: string
  matomoDomain: string
  matomoSiteId: string
  isMatomoEnabled: boolean
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const domain = process.env.TRACKING_DOMAIN ?? ''
    const matomoDomain = process.env.MATOMO_DOMAIN ?? ''
    const matomoSiteId = process.env.MATOMO_SITE_ID ?? ''
    const isMatomoEnabled = process.env.MATOMO_ENABLED === 'true'
    const lang = getLocaleFromPath(ctx?.req?.url)
    console.log({ matomoDomain, matomoSiteId, isMatomoEnabled })

    return {
      ...initialProps,
      lang,
      domain,
      matomoDomain,
      matomoSiteId,
      isMatomoEnabled,
    }
  }

  render() {
    const { lang, domain, matomoDomain, matomoSiteId, isMatomoEnabled } =
      this.props

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
          <MatomoInitScript
            enabled={isMatomoEnabled}
            matomoDomain={matomoDomain}
            matomoSiteId={matomoSiteId}
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
