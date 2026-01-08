import {
  Box,
  GridContainer,
  Hidden,
  Icon,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  m,
  ServicePortalPaths,
  useDynamicRoutesWithNavigation,
} from '@island.is/portals/my-pages/core'
import { sharedMessages } from '@island.is/shared/translations'
import cn from 'classnames'
import { ReactElement } from 'react'
import { useWindowSize } from 'react-use'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import * as styles from './Sidemenu.css'
import SidemenuItem from './SidemenuItem'
import { CloseButton } from '../Button/CloseButton/CloseButton'
interface Props {
  setSideMenuOpen: (status: boolean) => void
  sideMenuOpen: boolean
  rightPosition?: number
}
const Sidemenu = ({
  setSideMenuOpen,
  sideMenuOpen,
  rightPosition,
}: Props): ReactElement | null => {
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const onClose = () => {
    setSideMenuOpen(false)
  }

  const content = (
    <Box display="flex" justifyContent="flexEnd">
      <Box
        position="relative"
        background="white"
        padding={2}
        borderRadius="large"
        display="flex"
        flexDirection="column"
        height={isMobile ? 'full' : undefined}
        className={cn(
          isMobile ? styles.fullScreen : styles.dropdown,
          styles.container,
        )}
        style={
          !isMobile
            ? {
                left: rightPosition ?? '75%', // 75% represents a somewhat correct position of the sidebar if the calculation of getBoundingClientRect fails
                transform: 'translateX(-100%)',
              }
            : undefined
        }
      >
        <Box display="flex" flexDirection="column" className={styles.wrapper}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box
              borderRadius="full"
              background="blue100"
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={styles.overviewIcon}
              marginRight={'p2'}
            >
              <Icon icon="dots" />
            </Box>
            <Text variant="h4">{formatMessage(m.overview)}</Text>
          </Box>
          <Box className={styles.navWrapper}>
            {navigation?.children?.map(
              (navRoot, index) =>
                navRoot.path !== ServicePortalPaths.Root &&
                !navRoot.navHide && (
                  <SidemenuItem
                    item={navRoot}
                    setSidemenuOpen={setSideMenuOpen}
                    key={`sidemenu-item-${index}`}
                  />
                ),
            )}
          </Box>
        </Box>
        <Hidden below="md">
          <CloseButton
            onClick={() => setSideMenuOpen(false)}
            aria-label={formatMessage(sharedMessages.close)}
          />
        </Hidden>
      </Box>
    </Box>
  )

  return isMobile ? (
    <Box
      display={sideMenuOpen ? 'flex' : 'none'}
      height="full"
      id="sidemenu-mobile"
    >
      {content}
    </Box>
  ) : (
    <ModalBase
      baseId="service-portal-sidemenu"
      isVisible={sideMenuOpen}
      hideOnClickOutside={true}
      hideOnEsc={true}
      modalLabel={formatMessage(m.menuButtonAria)}
      removeOnClose={true}
      preventBodyScroll={false}
      onVisibilityChange={(visibility: boolean) => {
        if (visibility !== sideMenuOpen) {
          onClose()
        }
      }}
    >
      <GridContainer>{content}</GridContainer>
    </ModalBase>
  )
}

export default Sidemenu
