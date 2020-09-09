import React, { FC } from 'react'
import Link from 'next/link'
import { Button, Hidden } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'

export const LanguageToggler: FC<{
  hideWhenMobile?: boolean
}> = ({ hideWhenMobile }) => {
  const { activeLocale, locale, t } = useI18n()
  const otherLanguageUrl = activeLocale === 'en' ? '/' : '/en'
  const onClick = () => {
    locale(t.otherLanguageCode)
  }

  const LanguageButton = (
    <Link href={otherLanguageUrl}>
      <Button variant="menu" onClick={onClick} width="fluid">
        {t.otherLanguageName}
      </Button>
    </Link>
  )

  return !hideWhenMobile ? (
    LanguageButton
  ) : (
    <Hidden below="md">{LanguageButton}</Hidden>
  )
}
