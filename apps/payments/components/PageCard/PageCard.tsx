import { usePathname } from 'next/navigation'

import { Box, LinkV2, Logo } from '@island.is/island-ui/core'

import * as styles from './PageCard.css'
import { PageCenter } from '../PageCenter/PageCenter'
import { useLocale } from '@island.is/localization'
import { generic } from '../../messages'

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
  const { locale, formatMessage } = useLocale()

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
              <LinkV2
                href={getPath(locale, path)}
                color="blue400"
                className={styles.link}
              >
                {formatMessage(
                  locale === 'en'
                    ? generic.footerLocaleIS
                    : generic.footerLocaleEN,
                )}
              </LinkV2>
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
