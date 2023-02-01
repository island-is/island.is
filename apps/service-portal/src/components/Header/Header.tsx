import React, { useState } from 'react'
import {
  Box,
  Hidden,
  Button,
  Logo,
  FocusableBox,
} from '@island.is/island-ui/core'
import * as styles from './Header.css'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { UserMenu } from '@island.is/shared/components'
import { m } from '@island.is/service-portal/core'
import { Link, useNavigate } from 'react-router-dom'
import { useListDocuments } from '@island.is/service-portal/graphql'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

interface Props {
  position: number
}
export const Header = ({ position }: Props) => {
  const { formatMessage } = useLocale()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { unreadCounter } = useListDocuments()
  const navigate = useNavigate()
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  const badgeActive: keyof typeof styles.badge =
    unreadCounter > 0 ? 'active' : 'inactive'

  return (
    <div className={styles.placeholder}>
      {/*  Inline style to dynamicly change position of header because of alert banners */}
      <header className={styles.header} style={{ top: position }}>
        <Box width="full" paddingX={[3, 3, 3, 6, 6]}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            width="full"
          >
            <Link to={ServicePortalPath.MinarSidurRoot}>
              <FocusableBox component="div">
                <Hidden above="sm">
                  <Logo width={24} height={22} iconOnly id="header-mobile" />
                </Hidden>
                <Hidden below="md">
                  <Logo width={136} height={22} id="header" />
                </Hidden>
              </FocusableBox>
            </Link>
            <Hidden print>
              <Box
                display="flex"
                alignItems="center"
                flexWrap="nowrap"
                marginLeft={[1, 1, 2]}
              >
                <Box marginRight={[1, 1, 2]} position="relative">
                  <Link to={ServicePortalPath.ElectronicDocumentsRoot}>
                    <Button
                      variant="utility"
                      colorScheme="white"
                      size="small"
                      icon="mail"
                      iconType="outline"
                    >
                      {!isMobile && formatMessage(m.documents)}
                    </Button>
                  </Link>
                  <Box
                    borderRadius="circle"
                    className={cn(styles.badge[badgeActive])}
                  ></Box>
                </Box>
                <Box marginRight={[1, 2]}>
                  <Button
                    variant="utility"
                    colorScheme="white"
                    icon="dots"
                    onClick={() => navigate('/')}
                  >
                    {!isMobile && formatMessage(m.overview)}
                  </Button>
                </Box>
                <UserMenu
                  fullscreen
                  setUserMenuOpen={setUserMenuOpen}
                  userMenuOpen={userMenuOpen}
                />
              </Box>
            </Hidden>
          </Box>
        </Box>
      </header>
    </div>
  )
}

export default Header
