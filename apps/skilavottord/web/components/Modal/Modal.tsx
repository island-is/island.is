import React, { FC, useEffect } from 'react'
import {
  Button,
  Box,
  Text,
  Stack,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import * as styles from './Modal.treat'

export interface ModalProps {
  show?: boolean
  onCancel?: () => void
  onContinue?: () => void
  title: string
  text: string
  continueButtonText: string
  cancelButtonText: string
}

export const Modal: FC<ModalProps> = ({
  show,
  onCancel,
  onContinue,
  title,
  text,
  continueButtonText,
  cancelButtonText,
}: ModalProps) => {
  useEffect(() => {
    document.body.style.overflowY = 'auto'
    if (show) {
      document.body.style.overflowY = 'hidden'
    }
  }, [show])

  return (
    <>
      {show && (
        <Box className={styles.container}>
          <Box className={styles.overlay} />
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['12/12', '8/12', '8/12', '8/12']}
                offset={['0', '2/12', '2/12', '2/12']}
              >
                <Box
                  paddingY={[12, 10, 10, 10]}
                  paddingX={[3, 0, 0, 0]}
                  className={styles.modalContainer}
                  background="white"
                  borderRadius="large"
                >
                  <Box className={styles.modalClose}>
                    <Button
                      colorScheme="negative"
                      circle
                      icon="close"
                      size="large"
                      onClick={onCancel}
                    />
                  </Box>
                  <GridColumn
                    span={['8/8', '6/8', '6/8', '6/8']}
                    offset={['0', '1/8', '1/8', '1/8']}
                  >
                    <Stack space={[6, 4, 4, 4]}>
                      <Stack space={2}>
                        <Text variant="h1">{title}</Text>
                        <Text variant="intro">{text}</Text>
                      </Stack>
                      <Box display="flex" justifyContent="spaceBetween">
                        <Button variant="ghost" onClick={onCancel} fluid>
                          {cancelButtonText}
                        </Button>
                        <Box paddingX={[3, 3, 3, 15]}></Box>
                        <Button onClick={onContinue} fluid>
                          {continueButtonText}
                        </Button>
                      </Box>
                    </Stack>
                  </GridColumn>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
    </>
  )
}
