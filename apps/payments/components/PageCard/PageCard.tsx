import { Box, LinkV2, Logo } from '@island.is/island-ui/core'

import * as styles from './PageCard.css'
import { PageCenter } from '../PageCenter/PageCenter'
import { useLocale } from '@island.is/localization'
import { generic } from '../../messages'

type PageCardWrapperProps = {
  headerSlot: React.ReactNode
  headerColorScheme: 'primary' | 'success' | 'warning' | 'error'
  bodySlot: React.ReactNode
}

const getHeaderBackgroundClassName = (
  colorScheme: PageCardWrapperProps['headerColorScheme'],
) => {
  switch (colorScheme) {
    case 'primary':
      return styles.purpleBackground
    case 'success':
      return styles.greenBackground
    case 'warning':
      return styles.yellowBackground
    case 'error':
      return styles.redBackground
  }
}

export const PageCard = ({
  headerSlot,
  bodySlot,
  headerColorScheme = 'primary',
}: PageCardWrapperProps) => {
  const { locale, formatMessage, changeLanguage } = useLocale()

  const handleLanguageChange = () => {
    changeLanguage(locale === 'is' ? 'en' : 'is')
  }

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
          <Box
            paddingX={[3, 4]}
            paddingY={[3, 4]}
            className={getHeaderBackgroundClassName(headerColorScheme)}
            flexDirection="row"
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
          >
            {headerSlot}
          </Box>
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
            <LinkV2 href="https://island.is/skilmalar-island-is" skipTab>
              <Logo width={87} />
            </LinkV2>
            <Box display="flex" columnGap={2}>
              <LinkV2 href="#" color="blue400" className={styles.link}>
                {formatMessage(
                  locale === 'en'
                    ? generic.footerLocaleIS
                    : generic.footerLocaleEN,
                )}
              </LinkV2>
              <span className={styles.linkSeparator} />
              <LinkV2
                href="https://island.is/adstod"
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
