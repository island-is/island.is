import React, { FC } from 'react'
import { Footer as IslandUIFooter } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'

export const Footer: FC<React.PropsWithChildren<unknown>> = () => {
  const {
    activeLocale,
    t: { footer: t },
  } = useI18n()

  const bottomBarLinks =
    activeLocale === 'en'
      ? [
          {
            title: 'Can we assist?',
            href: 'https://island.is/en/help/digital-iceland/contact-us',
          },
          {
            title: 'Privacy policy',
            href: 'https://island.is/en/privacy-policy',
          },
          {
            title: 'Terms of use',
            href: 'https://island.is/en/terms-of-use',
          },
        ]
      : [
          {
            title: 'Getum við aðstoðað?',
            href: 'https://island.is/s/stafraent-island/hafa-samband',
          },
          {
            title: 'Persónuverndarstefna',
            href: 'https://island.is/personuverndarstefna-stafraent-islands',
          },
          {
            title: 'Notendaskilmálar',
            href: 'https://island.is/skilmalar-island-is',
          },
        ]

  return (
    <IslandUIFooter
      topLinks={t.topLinksInfo}
      middleLinksTitle={t.bottomLinksTitle}
      middleLinks={t.bottomLinks}
      showMiddleLinks
      bottomBarLinks={bottomBarLinks}
    />
  )
}

export default Footer
