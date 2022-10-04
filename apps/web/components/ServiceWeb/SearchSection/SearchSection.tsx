import React from 'react'
import { Box, Text, Hidden } from '@island.is/island-ui/core'
import { ServiceWebSearchInput } from '@island.is/web/components'
import { TextModes } from '../types'

import * as styles from './SearchSection.css'

interface SearchSectionProps {
  title?: string
  logoTitle?: string
  logoUrl?: string
  textMode?: TextModes
  searchPlaceholder?: string
}

export const SearchSection = ({
  title = '',
  logoTitle = '',
  logoUrl,
  textMode,
  searchPlaceholder,
}: SearchSectionProps) => {
  const dark = textMode === 'dark'

  return (
    <Box
      paddingX={[3, 3, 6]}
      paddingTop={[3, 3, 3, 10]}
      paddingBottom={[15, 15, 3]}
      className={styles.container}
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
      {!!title && (
        <>
          {logoTitle && (
            <Hidden above="md">
              <Box marginBottom={3}>
                <Text
                  as="span"
                  variant="eyebrow"
                  {...(dark ? {} : { color: 'white' })}
                >
                  {logoTitle}
                </Text>
              </Box>
            </Hidden>
          )}
          <Box marginBottom={[4, 4, 4, 6]}>
            <Text variant="h1" as="h1" {...(dark ? {} : { color: 'white' })}>
              {title}
            </Text>
          </Box>
        </>
      )}
      <ServiceWebSearchInput placeholder={searchPlaceholder} />
    </Box>
  )
}

export default SearchSection
