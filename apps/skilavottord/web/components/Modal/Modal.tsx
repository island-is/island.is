import React, { FC, ReactNode } from 'react'
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

  document.body.style.overflowY = 'auto'

  if (show) {
    window.scrollTo(0, 0)
    document.body.style.overflowY = 'hidden'
  }

  return (
    <>
      {show && (
        <div className={styles.container}>
          <div className={styles.overlay}></div>
          <GridContainer>
            <GridRow>
              <GridColumn span="8/12" offset="2/12">
                <Box paddingY={[3, 8, 8, 10]} className={styles.modal}>
                  <button onClick={onCancel} className={styles.modalClose}>
                    <Icon type="close" />
                  </button>
                  <GridColumn span="6/8" offset="1/8">
                    <Stack space={4}>
                      <Stack space={2}>
                        <Typography variant="h1">{t.title}</Typography>
                        <Typography variant="intro">{t.info}</Typography>
                      </Stack>
                      <Box
                        width="full"
                        display="inlineFlex"
                        justifyContent="spaceBetween"
                      >
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
        </div>
      )}
    </>
  )
}
