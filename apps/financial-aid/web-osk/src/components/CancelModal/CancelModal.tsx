import React from 'react'
import { Text, Box, Button, ModalBase, Icon } from '@island.is/island-ui/core'

import * as styles from './CancelModal.css'

import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/hooks/useLogOut'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const CancelModal = ({ isVisible, setIsVisible }: Props) => {
  const logOut = useLogOut()

  return (
    <ModalBase
      baseId="cancelForm"
      isVisible={isVisible}
      onVisibilityChange={(visibility) => {
        if (visibility !== isVisible) {
          setIsVisible(visibility)
        }
      }}
      className={styles.modalBase}
    >
      {({
        closeModal,
      }: {
        closeModal: () => React.Dispatch<React.SetStateAction<boolean>>
      }) => (
        <Box onClick={closeModal} className={styles.modalContainer}>
          <Box
            position="relative"
            background="white"
            borderRadius="large"
            paddingY={[8, 8, 12]}
            paddingX={[3, 3, 15]}
            className={styles.modal}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsVisible(false)
              }}
              className={styles.exitModal}
            >
              <Icon
                color="currentColor"
                icon="close"
                size="medium"
                type="filled"
              />
            </button>
            <Text variant="h1" marginBottom={2}>
              Ertu viss um að þú viljir hætta við?
            </Text>
            <Text variant="intro" marginBottom={[5, 5, 7]}>
              Þú þarft að fylla umsóknina út að nýju ef þú ákveður að koma
              aftur.
            </Text>

            <Box
              display="flex"
              justifyContent="spaceBetween"
              className={styles.buttonContainer}
            >
              <Box marginBottom={2} marginRight={2}>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsVisible(false)
                  }}
                >
                  Nei, ég vil halda áfram
                </Button>
              </Box>
              <Box marginBottom={2}>
                <Button
                  colorScheme="destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    logOut()
                  }}
                >
                  Já, hætta við
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </ModalBase>
  )
}

export default CancelModal
