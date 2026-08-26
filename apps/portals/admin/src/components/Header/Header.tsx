import { Link, useLocation } from 'react-router-dom'

import {
  Box,
  Hidden,
  Logo,
  FocusableBox,
  Inline,
  GridContainer,
} from '@island.is/island-ui/core'
import {
  TranslationWorkspaceHeaderActions,
  TranslationWorkspaceHeaderAutosave,
  TranslationWorkspaceHeaderBackButton,
  isApplicationTranslationWorkspacePath,
  isSharedNamespaceTranslationPath,
  useTranslationWorkspaceHeaderBridgeOptional,
} from '@island.is/portals/admin/application-system'
import { PortalPageLoader } from '@island.is/portals/core'
import { UserMenu } from '@island.is/shared/components'

import { ModuleSwitcher } from '../ModuleSwitcher/ModuleSwitcher'
import * as styles from './Header.css'

const LogoLink = () => (
  <Link to={'/'}>
    <FocusableBox component="div">
      <Hidden above="md">
        <Logo width={40} iconOnly />
      </Hidden>
      <Hidden below="lg">
        <Logo width={160} />
      </Hidden>
    </FocusableBox>
  </Link>
)

const HeaderUserMenu = () => (
  <UserMenu
    showLanguageSwitcher={false}
    iconOnlyMobile
    showActorButton={false}
  />
)

export const Header = () => {
  const { pathname } = useLocation()
  const hasWorkspaceChrome = Boolean(
    useTranslationWorkspaceHeaderBridgeOptional()?.workspaceChrome,
  )
  const isWorkspace =
    hasWorkspaceChrome ||
    isApplicationTranslationWorkspacePath(pathname) ||
    isSharedNamespaceTranslationPath(pathname)

  return (
    <>
      <PortalPageLoader />
      <header className={isWorkspace ? styles.workspaceHeader : styles.header}>
        <GridContainer>
          {isWorkspace ? (
            <div className={styles.workspaceBar}>
              <div className={styles.lead}>
                <LogoLink />
                <div className={styles.switcher}>
                  <ModuleSwitcher />
                </div>
                <TranslationWorkspaceHeaderBackButton />
              </div>
              <TranslationWorkspaceHeaderAutosave />
              <div className={styles.trail}>
                <TranslationWorkspaceHeaderActions />
                <HeaderUserMenu />
              </div>
            </div>
          ) : (
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              width="full"
            >
              <Inline alignY="center">
                <LogoLink />
                <ModuleSwitcher />
              </Inline>
              <Hidden print>
                <Box
                  display="flex"
                  alignItems="center"
                  flexWrap="nowrap"
                  marginLeft={1}
                >
                  <HeaderUserMenu />
                </Box>
              </Hidden>
            </Box>
          )}
        </GridContainer>
      </header>
    </>
  )
}

export default Header
