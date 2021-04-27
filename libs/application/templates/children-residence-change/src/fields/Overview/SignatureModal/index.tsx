import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text, ModalBase } from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'
import { Roles } from '../../../lib/constants'
import { FileSignatureStatus, ReducerState } from '../fileSignatureReducer'
import ModalConditionalContent from './ModalConditionalContent'
import * as style from './Modal.treat'

interface SignatureModalProps {
  fileSignatureState: ReducerState
  onClose: () => void
  controlCode: string
  role: Roles
}

const SignatureModal = ({
  fileSignatureState,
  controlCode,
  onClose,
  role,
}: SignatureModalProps) => {
  const { formatMessage } = useIntl()
  const hasError = [
    FileSignatureStatus.REQUEST_ERROR,
    FileSignatureStatus.UPLOAD_ERROR,
  ].includes(fileSignatureState.status)
  return (
    <ModalBase
      baseId="signatureDialog"
      className={style.modal}
      modalLabel={formatMessage(signatureModal.general.title)}
      isVisible={fileSignatureState.modalOpen}
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
          fileSignatureState={fileSignatureState}
          onClose={onClose}
          controlCode={controlCode}
          role={role}
        />
      </Box>
    </ModalBase>
  )
}

export default SignatureModal
