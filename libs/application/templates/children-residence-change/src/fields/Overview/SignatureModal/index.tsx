import React from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { Box, Text, ModalBase, Logo } from '@island.is/island-ui/core'
import { signatureModal } from '../../../lib/messages'
import { Roles } from '../../../lib/constants'
import { FileSignatureStatus, ReducerState } from '../fileSignatureReducer'
import ModalConditionalContent from './ModalConditionalContent'
import * as styles from './Modal.treat'

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
      className={styles.modal}
      modalLabel={formatMessage(signatureModal.general.title)}
      isVisible={true}
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
        className={styles.modalContent}
        background="white"
        borderRadius="large"
        position="relative"
      >
        <Box className={styles.logoWrapper}>
          <Logo id="modal" iconOnly={true} />
        </Box>
        <Text variant="h2" marginBottom={1} lineHeight="md">
          {/* {formatMessage(signatureModal.general.title)} */}
          Þú ert að fara að undirrita
        </Text>
        <Text>
          Athugaðu að talan er ekki lykilorðið þitt heldur aðeins öryggistala.
        </Text>
        <Box
          marginTop={4}
          background="blue100"
          borderRadius="large"
          paddingY={2}
          textAlign="center"
        >
          <Text lineHeight="xl" variant="small">
            Öryggistalan þín er:
          </Text>
          <Text lineHeight="sm" variant="h1">
            0000
          </Text>
        </Box>
        {[FileSignatureStatus.UPLOAD, FileSignatureStatus.SUCCESS].includes(
          fileSignatureState.status,
        ) && (
          <div className={cn(styles.loader)}>
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
          </div>
        )}
      </Box>
      {/* <ModalConditionalContent
          fileSignatureState={fileSignatureState}
          onClose={onClose}
          controlCode={controlCode}
          role={role}
        /> */}
    </ModalBase>
  )
}

export default SignatureModal
