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
import * as styles from './Modal.treat'

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
  const hasError = [
    FileSignatureStatus.REQUEST_ERROR,
    FileSignatureStatus.UPLOAD_ERROR,
  ].includes(fileSignatureState.status)
  const isRequest = fileSignatureState.status === FileSignatureStatus.REQUEST
  const isUpload = fileSignatureState.status === FileSignatureStatus.UPLOAD
  return (
    <ModalBase
      baseId="signatureDialog"
      className={styles.modal}
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
      <Box className={styles.modalContent}>
        <Box className={styles.logoWrapper}>
          <Logo id="modal" iconOnly={true} />
        </Box>
        <Text variant="h2" marginBottom={1} lineHeight="md">
          {formatMessage(fileSignatureState.content.title)}
        </Text>
        {isRequest ? (
          <>
            <SkeletonLoader height={20} space={1} />
            <SkeletonLoader height={20} width="50%" space={1} />
          </>
        ) : (
          fileSignatureState.content?.message && (
            <Text>{formatMessage(fileSignatureState.content.message)}</Text>
          )
        )}
        <Box
          className={cn(styles.controlCodeContainer.general, {
            [styles.controlCodeContainer.hide]: hasError,
          })}
        >
          {isUpload ? (
            <>
              <Text lineHeight="xl" variant="small">
                {formatMessage(signatureModal.security.numberLabel)}
              </Text>
              <Text lineHeight="sm" variant="h1">
                {controlCode}
              </Text>
            </>
          ) : (
            <Icon
              className={cn(styles.iconContainer.general, {
                [styles.iconContainer.hideIcon]: isRequest,
              })}
              color="blue400"
              icon="checkmarkCircle"
              size="large"
              type="filled"
            />
          )}
        </Box>
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
