import React from 'react'
import { Box, Text, AsyncSearch, Hidden } from '@island.is/island-ui/core'
import { Image } from '@island.is/web/graphql/schema'

import * as styles from './SearchSection.treat'

interface SearchSectionProps {
  title?: string
  logoTitle?: string
  logoUrl?: string
}

export const SearchSection = ({
  title = '',
  logoTitle = '',
  logoUrl,
}: SearchSectionProps) => {
  return (
    <Box
      paddingX={[3, 3, 6]}
      paddingTop={[0, 0, 0, 10]}
      paddingBottom={3}
      className={styles.container}
    >
      {!!logoUrl && (
        <Hidden below="lg">
          <Box marginBottom={6} className={styles.logo}>
            <img src={logoUrl} />
          </Box>
        </Hidden>
      )}
      {title && (
        <>
          {logoTitle && (
            <Hidden above="md">
              <Box marginBottom={3}>
                <Text as="span" variant="eyebrow" color="white">
                  {logoTitle}
                </Text>
              </Box>
            </Hidden>
          )}
          <Box marginBottom={[4, 4, 4, 6]}>
            <Text variant="h1" as="h1" color="white">
              {title}
            </Text>
          </Box>
        </>
      )}
      <AsyncSearch
        size="large"
        key="ok"
        options={[
          {
            label: 'Hvað tekur langan tíma að fá ökuskírteini?',
            value: 'Hvað tekur langan tíma að fá ökuskírteini?',
          },
          {
            label: 'Hvað er kaupmáli?',
            value: 'Hvað er kaupmáli?',
          },
          {
            label: 'Er til eyðublað fyrir kaupmála?',
            value: 'Er til eyðublað fyrir kaupmála?',
          },
        ]}
        placeholder="Leitaðu á þjónustuvefnum"
      />
    </Box>
  )
}

export default SearchSection
