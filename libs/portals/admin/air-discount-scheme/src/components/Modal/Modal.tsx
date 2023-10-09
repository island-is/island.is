import React, { FC } from 'react'
import HtmlParser from 'react-html-parser'

import {
  Button,
  Box,
  Text,
  Stack,
  GridContainer,
  GridRow,
  GridColumn,
  ModalBase,
  Inline,
  Icon,
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
  return !show ? null : (
    <ModalBase
      baseId={`confirm-modal`}
      modalLabel={t.title}
      preventBodyScroll
      hideOnClickOutside
      hideOnEsc
      initialVisibility
      className={styles.modal}
      onVisibilityChange={(isVisible: boolean) => {
        if (!isVisible) onCancel?.()
      }}
    >
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '10/12', '10/12', '8/12']}
            offset={['0', '1/12', '1/12', '2/12']}
          >
            <Box
              padding={[3, 3, 6, 10]}
              paddingTop={[8, 8, 10, 12]}
              background="white"
              borderRadius="large"
              boxShadow="strong"
              position="relative"
            >
              <Stack space={[2, 2, 4]}>
                <Text variant="h2">{t.title}</Text>
                <Text variant="intro">{HtmlParser(t.info)}</Text>
                <Inline
                  justifyContent="spaceBetween"
                  collapseBelow={'sm'}
                  space={2}
                  reverse
                >
                  <Button fluid onClick={onContinue}>
                    {t.buttons.continue}
                  </Button>
                  <Button fluid variant="ghost" onClick={onCancel}>
                    {t.buttons.cancel}
                  </Button>
                </Inline>
              </Stack>

              <Box position="absolute" top={4} right={4} aria-hidden>
                <button onClick={onCancel}>
                  <Icon icon="close" type="outline" size="large" />
                </button>
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </ModalBase>
  )
}

export default Modal
