import cn from 'classnames'
import { Box, Text, Hidden } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { ServiceWebSearchInput } from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { TextModes } from '../types'

import * as styles from './SearchSection.css'

interface SearchSectionProps {
  title?: string
  logoTitle?: string
  logoUrl?: string
  textMode?: TextModes
  searchPlaceholder?: string
  namespace: Record<string, string>
  showLogoOnMobileDisplays?: boolean
}

export const SearchSection = ({
  title = '',
  logoTitle = '',
  logoUrl,
  textMode,
  searchPlaceholder,
  namespace,
  showLogoOnMobileDisplays = true,
}: SearchSectionProps) => {
  const n = useNamespace(namespace)

  const textProps: { color?: Colors } =
    textMode === 'dark'
      ? {}
      : { color: textMode === 'light' ? 'white' : 'blueberry600' }

  return (
    <Box
      paddingX={[3, 3, 6]}
      paddingTop={[3, 3, 3, 10]}
      paddingBottom={[15, 15, 3]}
      className={cn([
        styles.container,
        { [styles.responsiveContainer]: !!logoUrl && showLogoOnMobileDisplays },
      ])}
    >
      {!!logoUrl && (
        <Hidden below="lg">
          <Box marginBottom={6} className={styles.logoWrapper}>
            <Box className={styles.logo}>
              <img className={styles.logoImg} alt={logoTitle} src={logoUrl} />
            </Box>
          </Box>
        </Hidden>
      )}
      {!!logoUrl && showLogoOnMobileDisplays && (
        <Hidden above="md">
          <Box marginBottom={2} className={styles.mobileLogoWrapper}>
            <Box className={styles.mobilelogo}>
              <img className={styles.logoImg} alt={logoTitle} src={logoUrl} />
            </Box>
          </Box>
        </Hidden>
      )}
      {!!title && (
        <Box textAlign="center" marginBottom={[4, 4, 4, 6]}>
          <Text variant="h1" as="h1" {...textProps}>
            {title}
          </Text>
        </Box>
      )}
      <ServiceWebSearchInput
        placeholder={searchPlaceholder}
        nothingFoundText={n('nothingFoundText', 'Ekkert fannst')}
      />
    </Box>
  )
}

export default SearchSection
