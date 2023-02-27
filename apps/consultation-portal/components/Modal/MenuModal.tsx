import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Stack,
  useBoxStyles,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { MenuLogo } from '../svg'

import * as styles from './MenuModal.css'

const MenuModal = ({ baseId, modalLabel }) => {
  const [isVisible, setIsVisible] = useState(false)
  const gridContainerStyles = useBoxStyles({
    component: 'div',
    background: 'blue100',
    height: 'full',
  })
  const fullHeight = useBoxStyles({ component: 'div', height: 'full' })

  return (
    <>
      <Button icon="menu" variant="utility" onClick={() => setIsVisible(true)}>
        Valmynd
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
                  justifyContent="flexEnd"
                  position="relative"
                >
                  <div className={styles.mainContainer}>
                    <Box
                      display="flex"
                      justifyContent="spaceBetween"
                      alignItems="center"
                    >
                      <Box>
                        <MenuLogo />
                      </Box>
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
                          Loka
                        </Button>
                      </Box>
                    </Box>
                    <Box paddingTop={6}>
                      <Stack space={2}>
                        <Button
                          size="small"
                          fluid
                          variant="utility"
                          onClick={() => console.log}
                        >
                          Öll mál
                        </Button>
                        <Button
                          size="small"
                          fluid
                          variant="utility"
                          onClick={() => console.log}
                        >
                          Áskriftir
                        </Button>
                        <Button
                          size="small"
                          fluid
                          variant="utility"
                          onClick={() => console.log}
                        >
                          Mínar umsagnir
                        </Button>
                        <Button size="small" fluid onClick={() => console.log}>
                          Innskráning
                        </Button>
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
