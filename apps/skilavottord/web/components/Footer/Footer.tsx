import React, { FC } from 'react'
import { Footer as IslandUIFooter } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'

export const Footer: FC<React.PropsWithChildren<unknown>> = () => {
  const {
    t: { footer: t },
  } = useI18n()

  return (
    <IslandUIFooter
      topLinks={t.topLinksInfo}
      middleLinksTitle={t.bottomLinksTitle}
      middleLinks={t.bottomLinks}
      showMiddleLinks
    />
  )
}

export default Footer
