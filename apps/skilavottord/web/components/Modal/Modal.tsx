import React, { FC, useEffect } from 'react'
import {
  Button,
  Box,
  Typography,
  Stack,
  Icon,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import * as styles from './Modal.treat'
import { useI18n } from '@island.is/skilavottord-web/i18n'

export interface ModalProps {
  show?: boolean
  onCancel?: () => void
  onContinue?: () => void
}

export const Modal: FC<ModalProps> = ({
  show,
  onCancel,
  onContinue,
}: ModalProps) => {
  const {
    t: { cancelModal: t },
  } = useI18n()

  useEffect(() => {
    document.body.style.overflowY = 'auto'
    if (show) {
      document.body.style.overflowY = 'hidden'
    }
  }, [show])

  return (
    <>
      {show && (
        <Box
          className={styles.container}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
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
                  className={styles.modal}
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
                    <Stack space={4}>
                      <Stack space={2}>
                        <Typography variant="h1">{t.title}</Typography>
                        <Typography variant="intro">{t.info}</Typography>
                      </Stack>
                      <Box display="flex" justifyContent="spaceBetween">
                        <Button
                          variant="ghost"
                          width="fixed"
                          onClick={onCancel}
                        >
                          {t.buttons.cancel}
                        </Button>
                        <Button
                          variant="normal"
                          width="fixed"
                          onClick={onContinue}
                        >
                          {t.buttons.continue}
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
