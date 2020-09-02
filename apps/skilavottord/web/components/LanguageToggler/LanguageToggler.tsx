import React, { FC } from 'react'
import Link from 'next/link'
import { Button, Hidden } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'


export const LanguageToggler: FC<{
  hideWhenMobile?: boolean
}> = ({ hideWhenMobile }) => {
  const { activeLocale, locale } = useI18n()
  const otherLanguageUrl = activeLocale === 'en' ? '/' : 'en'
  const otherLanguageCode = activeLocale === 'is' ? 'en' : 'is'
  const onClick = () => {
    locale(otherLanguageCode)
  }
  const languageButtonText =
    activeLocale === 'is' ? (
      <span>
        <Hidden below="lg">EN</Hidden>
      </span>
    ) : (
      <span>
        <Hidden below="lg">IS</Hidden>
      </span>
    )

  const LanguageButton = (
    <Link href={otherLanguageUrl}>
      <Button variant="menu" onClick={onClick} width="fluid">
        {languageButtonText}
      </Button>
    </Link>
  )

  return !hideWhenMobile ? (
    LanguageButton
  ) : (
    <Hidden below="md">{LanguageButton}</Hidden>
  )
}
