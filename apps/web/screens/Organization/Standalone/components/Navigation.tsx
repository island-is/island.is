import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import {
  Box,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { LanguageToggler, SearchInput } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'

export interface NavigationProps {
  logo?: string
  title?: string
  fullWidth?: boolean
  logoAltText?: string
  isSubpage?: boolean
  customTitleColor?: string
}

export const Navigation: React.FC<React.PropsWithChildren<NavigationProps>> = ({
  logo,
  title,
  fullWidth,
  logoAltText,
  isSubpage = false,
  customTitleColor = 'dark400',
}) => {
  const { activeLocale } = useI18n()
  const { width } = useWindowSize()
  const logoProvided = !!logo
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.lg)
  }, [width])
  return (
    <Box display="flex" alignItems="center" justifyContent="spaceBetween">
      {logoProvided && (
        <>
          <Box display="flex" alignItems="center">
            <img src={logo} alt={logoAltText} />
            <Text variant={isSubpage && isMobile ? 'h4' : 'h2'} as="h1">
              <span style={{ color: customTitleColor }}>{title}</span>
            </Text>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="flexEnd">
            <SearchInput size="medium" activeLocale={activeLocale} />
            <Box marginLeft={[1, 1, 1, 2]}>
              <LanguageToggler />
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
