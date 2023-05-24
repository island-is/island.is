import React from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import {
  Box,
  Text,
  ModalBase,
  Logo,
  SkeletonLoader,
  Icon,
  Button,
} from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'
import { FileSignatureStatus, ReducerState } from '../fileSignatureReducer'
import * as styles from './Modal.css'

interface SignatureModalProps {
  fileSignatureState: ReducerState
  onClose: () => void
  controlCode: string
}

const SignatureModal = ({
  fileSignatureState,
  controlCode,
  onClose,
}: SignatureModalProps) => {
  const { formatMessage } = useIntl()
  const { status, modalOpen, content } = fileSignatureState
  const hasError = [
    FileSignatureStatus.REQUEST_ERROR,
    FileSignatureStatus.UPLOAD_ERROR,
  ].includes(status)
  const isRequest = status === FileSignatureStatus.REQUEST
  const isUpload = status === FileSignatureStatus.UPLOAD
  const isSuccess = status === FileSignatureStatus.SUCCESS
  return (
    <ModalBase
      baseId="signatureDialog"
      className={styles.modal}
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
      <Box className={styles.modalContent}>
        <Box className={styles.logoWrapper}>
          <Logo id="modal" iconOnly={true} />
        </Box>
        <Text variant="h2" marginBottom={1} lineHeight="md">
          {formatMessage(content.title)}
        </Text>
        {isRequest ? (
          <>
            <SkeletonLoader height={20} space={1} />
            <SkeletonLoader height={20} width="50%" space={1} />
          </>
        ) : (
          content.message && <Text>{formatMessage(content.message)}</Text>
        )}
        {/* We only show the box when there is no error */}
        {!hasError && (
          <Box className={styles.controlCodeContainer}>
            {/* isUpload and isSuccess can never both be 'true' */}
            {isUpload && (
              <>
                <Text lineHeight="xl" variant="small">
                  {formatMessage(signatureModal.security.numberLabel)}
                </Text>
                <Text lineHeight="sm" variant="h1">
                  {controlCode}
                </Text>
              </>
            )}
            {isSuccess && (
              <Icon
                className={styles.iconContainer}
                color="blue400"
                icon="checkmarkCircle"
                size="large"
                type="filled"
              />
            )}
          </Box>
        )}
        <Box marginTop={6} display="flex" justifyContent="center">
          {hasError ? (
            <Button
              onClick={onClose}
              fluid={true}
              variant="ghost"
              colorScheme="destructive"
            >
              {formatMessage(signatureModal.general.closeButtonLabel)}
            </Button>
          ) : (
            <div
              className={cn(styles.loader.general, {
                [styles.loader.noLoader]: isRequest,
              })}
            >
              <div className={styles.loadingDot} />
              <div className={styles.loadingDot} />
              <div className={styles.loadingDot} />
            </div>
          )}
        </Box>
      </Box>
    </ModalBase>
  )
}

export default SignatureModal
