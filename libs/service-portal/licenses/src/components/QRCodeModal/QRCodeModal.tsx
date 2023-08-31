import React, { FC } from 'react'
import * as styles from './QRCodeModal.css'
import { Box, ModalBase, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

interface Props {
  id: string
  onCloseModal: () => void
  toggleClose?: boolean
  expires?: string
}

export const QRCodeModal: FC<React.PropsWithChildren<Props>> = ({
  id,
  toggleClose,
  expires,
  children,
  onCloseModal,
}) => {
  const { formatMessage } = useLocale()
  return (
    <ModalBase
      baseId={id}
      initialVisibility={false}
      className={styles.modal}
      toggleClose={toggleClose}
      isVisible={toggleClose}
    >
      <Box
        background="white"
        padding={3}
        display="flex"
        alignItems={['center', 'flexStart']}
        flexDirection={['columnReverse', 'row']}
        justifyContent="spaceBetween"
      >
        <Box className={styles.closeButton}>
          <Button
            circle
            colorScheme="negative"
            icon="close"
            onClick={onCloseModal}
            size="medium"
          />
        </Box>
        <Box className={styles.code} marginRight={3}>
          {children}
        </Box>
        <Box marginRight={7} marginY={2}>
          <Box marginY={1}>
            <Text variant="h3">{formatMessage(m.sendLicenseToPhone)}</Text>
          </Box>
          <Text>{formatMessage(m.qrCodeText)}</Text>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default QRCodeModal
