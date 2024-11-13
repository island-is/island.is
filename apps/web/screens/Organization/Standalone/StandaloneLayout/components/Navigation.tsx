import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { LanguageToggler, SearchInput } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'

import { MobileMenu } from './MobileMenu'
import * as styles from './Navigation.css'

export interface NavigationProps {
  logo?: string
  title?: string
  fullWidth?: boolean
  logoAltText?: string
  isSubpage?: boolean
  customTitleColor?: string
  links: { label: string; href: string }[]
}

export const Navigation: React.FC<React.PropsWithChildren<NavigationProps>> = ({
  logo,
  title,
  logoAltText,
  isSubpage = false,
  customTitleColor = 'dark400',
  links,
}) => {
  const { activeLocale } = useI18n()
  const { width } = useWindowSize()
  const logoProvided = !!logo
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.lg)
  }, [width])
  return (
    <GridContainer>
      <GridRow className={styles.gridRow} alignItems="center">
        {logoProvided && (
          <>
            <GridColumn span={['3/12']}>
              <Box display="flex" alignItems="center">
                <img src={logo} alt={logoAltText} className={styles.logo} />
                <Text variant="h2" as="h1">
                  <span style={{ paddingLeft: 20 }}>{title}</span>
                </Text>
              </Box>
            </GridColumn>
            <GridColumn span={['6/12']}>
              <Hidden below="lg">
                <Box display="flex" justifyContent="center">
                  {links.map((link, index) => (
                    <LinkV2 key={link.label} href={link.href}>
                      <Text variant="h4" color="blue600">
                        <span style={{ paddingLeft: index > 0 ? 20 : 0 }}>
                          {link.label}
                        </span>
                      </Text>
                    </LinkV2>
                  ))}
                </Box>
              </Hidden>
            </GridColumn>
            <GridColumn span={['3/12']}>
              <Hidden below="lg">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flexEnd"
                >
                  <SearchInput size="medium" activeLocale={activeLocale} />
                  <Box marginLeft={[1, 1, 1, 2]}>
                    <LanguageToggler />
                  </Box>
                </Box>
              </Hidden>
              <Hidden above="md">
                <MobileMenu links={links} />
              </Hidden>
            </GridColumn>
          </>
        )}
      </GridRow>
    </GridContainer>
  )
}
