import { Box, LinkV2, Logo } from '@island.is/island-ui/core'

import * as styles from './PageCard.css'
import { PageCenter } from '../PageCenter/PageCenter'

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
  return (
    <PageCenter verticalCenter={false}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        rowGap={2}
        width="full"
        className={styles.container}
      >
        <Box marginTop={[8, 8, 15]} className={styles.cardContainer}>
          <Box
            paddingX={[3, 4]}
            paddingTop={2}
            paddingBottom={4}
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
            paddingTop={4}
            paddingBottom={2}
            display="flex"
            width="full"
            flexDirection="column"
            justifyContent="spaceBetween"
          >
            {bodySlot}
          </Box>
        </Box>
        <footer className={styles.footer}>
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <LinkV2 href="https://island.is/skilmalar-island-is" skipTab>
              <Logo width={120} />
            </LinkV2>
            <Box display="flex" columnGap={2}>
              <LinkV2 href="#" color="blue400">
                English
              </LinkV2>
              <span className={styles.linkSeparator} />
              <LinkV2
                href="https://island.is/minar-sidur-adgangsstyring"
                color="blue400"
              >
                Aðstoð
              </LinkV2>
            </Box>
          </Box>
        </footer>
      </Box>
    </PageCenter>
  )
}
