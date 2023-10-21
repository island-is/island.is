import React, { FC } from 'react'
import HtmlParser from 'react-html-parser'

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
import * as styles from './Modal.css'

interface ModalProps {
  show?: boolean
  onCancel?: () => void
  onContinue?: () => void
  t: {
    title: string
    info: string
    buttons: {
      cancel: string
      continue: string
    }
  }
}

const Modal: FC<React.PropsWithChildren<ModalProps>> = ({
  show,
  t,
  onCancel,
  onContinue,
}: ModalProps) => {
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
                        <Box marginTop={2}>
                          <Typography variant="intro">
                            {HtmlParser(t.info)}
                          </Typography>
                        </Box>
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

export default Modal
