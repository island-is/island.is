import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text, ModalBase } from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'
import { FileSignatureStatus } from '../fileSignatureReducer'
import ModalConditionalContent from './ModalConditionalContent'
import * as style from './Modal.treat'

interface SignatureModalProps {
  signatureStatus: FileSignatureStatus
  onClose: () => void
  modalOpen: boolean
  controlCode: string
}

const SignatureModal = ({
  controlCode,
  signatureStatus,
  modalOpen,
  onClose,
}: SignatureModalProps) => {
  const { formatMessage } = useIntl()
  const hasError = [
    FileSignatureStatus.REQUEST_ERROR,
    FileSignatureStatus.UPLOAD_ERROR,
  ].includes(signatureStatus)
  return (
    <ModalBase
      baseId="signatureDialog"
      className={style.modal}
      modalLabel={formatMessage(signatureModal.general.title)}
      isVisible={modalOpen}
      onVisibilityChange={(visibility: boolean) => {
        if (!visibility) {
          onClose()
        }
      }}
      // When there is NO error it should not be possible to close the modal
      hideOnEsc={hasError}
      // Passing in tabIndex={0} when there is no tabbable element inside the modal
      tabIndex={!hasError ? 0 : undefined}
    >
      <Box
        className={style.modalContent}
        boxShadow="large"
        borderRadius="standard"
        background="white"
        paddingX={[3, 3, 5, 12]}
        paddingY={[3, 3, 4, 10]}
      >
        <Text variant="h1" marginBottom={2}>
          {formatMessage(signatureModal.general.title)}
        </Text>
        <ModalConditionalContent
          onClose={onClose}
          controlCode={controlCode}
          signatureStatus={signatureStatus}
        />
      </Box>
    </ModalBase>
  )
}

export default SignatureModal
