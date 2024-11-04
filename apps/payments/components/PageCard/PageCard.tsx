import { Box, Link, Logo, Text } from '@island.is/island-ui/core'

import * as styles from './PageCard.css'
import { PageCenter } from '../PageCenter/PageCenter'

type PageCardWrapperProps = {
  label?: string
  children?: React.ReactNode
}

export const PageCard = ({ label, children }: PageCardWrapperProps) => {
  // const { formatMessage, changeLanguage, locale } = useLocale()

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
        <Box
          paddingX={[3, 4]}
          paddingTop={4}
          paddingBottom={5}
          marginTop={[8, 8, 15]}
          className={styles.cardContainer}
        >
          <div className={styles.logo}>
            <Logo iconOnly />
          </div>
          {label && (
            <Box
              display="flex"
              justifyContent="center"
              marginTop={3}
              marginBottom={1}
            >
              <Text color="blue400" variant="eyebrow">
                {label}
              </Text>
            </Box>
          )}
          {children}
        </Box>
        <footer className={styles.footer}>
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <Link href="https://island.is/skilmalar-island-is">
              <Logo width={120} />
            </Link>
            <Box display="flex" columnGap={2}>
              <Link href="todo" onClick={() => alert('todo')}>
                English
              </Link>
              <span className={styles.linkSeparator} />
              <Link href="https://island.is/minar-sidur-adgangsstyring">
                Aðstoð
              </Link>
            </Box>
          </Box>
        </footer>
      </Box>
    </PageCenter>
  )
}
