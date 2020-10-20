import React, { FC, useRef, ReactNode } from 'react'
import HtmlParser from 'react-html-parser'
import {
  Box,
  Typography,
  Icon,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import * as styles from './Modal.treat'
import { useClickAway } from 'react-use'

interface ModalProps {
  show?: boolean
  onCancel?: () => void
  onContinue?: () => void
  onClickOutside?: () => void
  children?: ReactNode
  title: string
}

const Modal: FC<ModalProps> = ({
  show,
  title,
  onCancel,
  onClickOutside,
  children,
}: ModalProps) => {
  const ref = useRef<HTMLElement>(null)
  useClickAway(ref, () => {
    if (onClickOutside) {
      onClickOutside()
    }
  })
  return (
    <>
      {show && (
        <Box className={styles.container}>
          <Box className={styles.overlay} background="blue100" />
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['12/12', '12/12', '6/12', '6/12']}
                offset={['0', '0', '3/12', '3/12']}
              >
                <Box
                  display="flex"
                  padding={[1, 1, 4, 4]}
                  className={styles.modal}
                  ref={ref}
                >
                  <GridColumn span={'8/8'} offset={'0'}>
                    <Box
                      width="full"
                      display="inlineFlex"
                      justifyContent="spaceBetween"
                      paddingBottom={[1, 1, 2, 6]}
                    >
                      <Typography variant="h2">{title}</Typography>
                      <button onClick={onCancel} className={styles.modalClose}>
                        <Icon type="close" color="blue400" />
                      </button>
                    </Box>
                    {children}
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

export default Modal
