import { Box, Icon, ModalBase } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PropsWithChildren } from 'react'
import { emailsMsg } from '../../lib/messages'
import * as styles from './Modal.css'

type ModalProps = {
  baseId: string
  isVisible: boolean
  onClose(): void
}

export const Modal = ({
  baseId,
  isVisible,
  onClose,
  children,
}: PropsWithChildren<ModalProps>) => {
  const { formatMessage } = useLocale()

  return (
    <ModalBase
      baseId={baseId}
      isVisible={isVisible}
      modalLabel={formatMessage(emailsMsg.verificationCodeButtonAria)}
      removeOnClose
      preventBodyScroll={false}
      className={styles.modalBase}
    >
      <Box className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label={formatMessage(emailsMsg.close)}
        >
          <Icon icon="close" color="blue600" />
        </button>
        {children}
      </Box>
    </ModalBase>
  )
}
