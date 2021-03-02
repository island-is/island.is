import React from 'react'
import { useIntl } from 'react-intl'
import {
  Box,
  Text,
  AlertMessage,
  Button,
  ModalBase,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'
import { FileSignatureStatus } from '../fileSignatureReducer'
import * as style from './Modal.treat'

interface SignatureModalProps {
  signatureStatus: FileSignatureStatus
  onClose: () => void
  modalOpen: boolean
  controlCode?: string
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
        {(() => {
          switch (signatureStatus) {
            case FileSignatureStatus.REQUEST:
              return (
                <>
                  <Box marginBottom={2}>
                    <SkeletonLoader width="50%" height={30} />
                  </Box>
                  <SkeletonLoader repeat={2} space={1} />
                </>
              )
            case FileSignatureStatus.UPLOAD:
              return (
                <>
                  <Text variant="h2" marginBottom={2}>
                    {formatMessage(signatureModal.security.numberLabel)}
                    <span className={style.controlCode}>{controlCode}</span>
                  </Text>
                  <Text>{formatMessage(signatureModal.security.message)}</Text>
                </>
              )
            case FileSignatureStatus.REQUEST_ERROR:
            case FileSignatureStatus.UPLOAD_ERROR:
              // TODO: Extract to a seperate error component when we start handling different errors
              return (
                <>
                  <AlertMessage
                    type="error"
                    title={formatMessage(signatureModal.defaultError.title)}
                    message={formatMessage(signatureModal.defaultError.message)}
                  />
                  <Box marginTop={3} justifyContent="center">
                    <Button onClick={onClose} variant="primary">
                      {formatMessage(signatureModal.general.closeButtonLabel)}
                    </Button>
                  </Box>
                </>
              )
            default:
              return null
          }
        })()}
      </Box>
    </ModalBase>
  )
}

export default SignatureModal
