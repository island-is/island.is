import React, { FC, useEffect } from 'react'
import {
  ButtonDeprecated as Button,
  Box,
  Typography,
  Stack,
  IconDeprecated as Icon,
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
          <Box className={styles.overlay} background="blue100" />
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
                  <button onClick={onCancel} className={styles.modalClose}>
                    <Icon type="close" />
                  </button>
                  <GridColumn
                    span={['8/8', '6/8', '6/8', '6/8']}
                    offset={['0', '1/8', '1/8', '1/8']}
                  >
                    <Stack space={[6, 4, 4, 4]}>
                      <Stack space={2}>
                        <Typography variant="h1">{title}</Typography>
                        <Typography variant="intro">{text}</Typography>
                      </Stack>
                      <Box display="flex" justifyContent="spaceBetween">
                        <Button
                          variant="ghost"
                          width="fixed"
                          onClick={onCancel}
                        >
                          {cancelButtonText}
                        </Button>
                        <Box paddingX={3}></Box>
                        <Button
                          variant="normal"
                          width="fixed"
                          onClick={onContinue}
                        >
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
