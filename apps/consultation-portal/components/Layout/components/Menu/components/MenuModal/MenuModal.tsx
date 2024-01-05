import {
  Box,
  Button,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Logo,
  ModalBase,
  Stack,
  useBoxStyles,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { menuItems } from '../../components'
import { checkActiveHeaderLink } from '../../../../utils'
import * as styles from './MenuModal.css'
import { useLogIn, useLogOut } from '../../../../../../hooks'
import { useRouter } from 'next/router'
import localization from '../../../../Layout.json'
import { LogoText } from '../../../../../../components'

interface Props {
  baseId: string
  modalLabel: string
  isLoggedIn?: boolean
  isFrontPage?: boolean
}

const MenuModal = ({ baseId, modalLabel, isLoggedIn, isFrontPage }: Props) => {
  const loc = localization.menu.menuModal
  const [isVisible, setIsVisible] = useState(false)
  const LogIn = useLogIn()
  const LogOut = useLogOut()
  const router = useRouter()
  const gridContainerStyles = useBoxStyles({
    component: 'div',
    background: 'blue100',
    height: 'full',
  })
  const fullHeight = useBoxStyles({ component: 'div', height: 'full' })

  return (
    <>
      <Button icon="menu" variant="utility" onClick={() => setIsVisible(true)}>
        {loc.buttonLabel}
      </Button>
      <ModalBase
        baseId={baseId}
        modalLabel={modalLabel}
        className={styles.container}
        backdropWhite
        isVisible={isVisible}
        onVisibilityChange={(visibility) => {
          if (visibility !== isVisible) {
            setIsVisible(visibility)
          }
        }}
      >
        {({ closeModal }: { closeModal: () => void }) => (
          <GridContainer className={gridContainerStyles}>
            <GridRow className={fullHeight}>
              <GridColumn span="12/12">
                <Box
                  paddingTop={3}
                  paddingBottom={3}
                  paddingRight={1}
                  display="flex"
                  justifyContent="center"
                  position="relative"
                >
                  <div className={styles.mainContainer}>
                    <Box
                      display="flex"
                      justifyContent="spaceBetween"
                      alignItems="center"
                    >
                      {isFrontPage ? (
                        <FocusableBox
                          href="https://island.is/"
                          alignItems="center"
                        >
                          <Logo width={28} height={28} iconOnly />
                        </FocusableBox>
                      ) : (
                        <FocusableBox href="/" alignItems="center">
                          <LogoText isSmall />
                        </FocusableBox>
                      )}
                      <Box
                        display="flex"
                        justifyContent="flexEnd"
                        alignItems="center"
                      >
                        <Button
                          icon={'close'}
                          variant="utility"
                          onClick={closeModal}
                        >
                          {loc.closeButtonLabel}
                        </Button>
                      </Box>
                    </Box>
                    <Box paddingTop={4}>
                      <Stack space={2}>
                        {menuItems.map((item, index) => {
                          return (
                            <div
                              key={index}
                              style={{
                                backgroundColor: checkActiveHeaderLink({
                                  router: router,
                                  link: item.href,
                                })
                                  ? '#00E4CA'
                                  : 'transparent',
                                borderRadius: '8px',
                              }}
                            >
                              <FocusableBox key={index} href={item.href}>
                                <Button variant="utility" fluid size="small">
                                  {item.label}
                                </Button>
                              </FocusableBox>
                            </div>
                          )
                        })}
                        <Box paddingY={2}>
                          {isLoggedIn ? (
                            <Button size="small" fluid onClick={LogOut}>
                              {loc.logoutButtonLabel}
                            </Button>
                          ) : (
                            <Button size="small" fluid onClick={LogIn}>
                              {loc.loginButtonLabel}
                            </Button>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  </div>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        )}
      </ModalBase>
    </>
  )
}

export default MenuModal
