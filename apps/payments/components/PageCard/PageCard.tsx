import { usePathname, useRouter } from 'next/navigation'

import { Box, LinkV2, Logo } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'

import { PageCenter } from '../PageCenter/PageCenter'
import { generic } from '../../messages'

import * as styles from './PageCard.css'

type PageCardWrapperProps = {
  headerSlot: React.ReactNode
  bodySlot: React.ReactNode
}

const getPath = (currentLocale: string, currentPath: string) => {
  if (currentLocale === 'is') {
    return currentPath.replace('/is/', '/en/')
  } else {
    return currentPath.replace('/en/', '/is/')
  }
}

export const PageCard = ({ headerSlot, bodySlot }: PageCardWrapperProps) => {
  const { locale, formatMessage, changeLanguage } = useLocale()
  const router = useRouter()

  const changeLanguageHandler = (lang: Locale) => {
    changeLanguage(lang)
    router.replace(getPath(lang === 'is' ? 'en' : 'is', path))
  }

  const path = usePathname()

  return (
    <PageCenter verticalCenter>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        rowGap={1}
        className={styles.container}
      >
        <Box className={styles.cardContainer} height="full" flexGrow={1}>
          {headerSlot}

          <Box
            paddingX={[3, 4]}
            paddingY={[3, 4]}
            display="flex"
            width="full"
            flexDirection="column"
            justifyContent="spaceBetween"
          >
            {bodySlot}
          </Box>
        </Box>
        <footer className={styles.footer}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            marginX={[2, 0]}
          >
            <LinkV2
              href={
                locale === 'en'
                  ? 'https://island.is/en/skilmalar-island-is'
                  : 'https://island.is/skilmalar-island-is'
              }
              skipTab
            >
              <Logo width={87} />
            </LinkV2>
            <Box display="flex" columnGap={2}>
              <button
                type="button"
                className={styles.link}
                onClick={() =>
                  changeLanguageHandler(locale === 'is' ? 'en' : 'is')
                }
                aria-label={formatMessage(
                  locale === 'is'
                    ? generic.toggleLanguageToEnglish
                    : generic.toggleLanguageToIcelandic,
                )}
              >
                {formatMessage(
                  locale === 'en'
                    ? generic.footerLocaleIS
                    : generic.footerLocaleEN,
                )}
              </button>
              <span className={styles.linkSeparator} />
              <LinkV2
                href={
                  locale === 'en'
                    ? 'https://island.is/en/help'
                    : 'https://island.is/adstod'
                }
                color="blue400"
                className={styles.link}
              >
                {formatMessage(generic.footerHelp)}
              </LinkV2>
            </Box>
          </Box>
        </footer>
      </Box>
    </PageCenter>
  )
}
