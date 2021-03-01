import React from 'react'
import {
  Box,
  Text,
  AlertMessage,
  Button,
  ModalBase,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { FileSignatureStatus } from '../fileSignatureReducer'
import * as style from './Modal.treat'

interface SignatureModalProps {
  signatureStatus: FileSignatureStatus
  onClose?: any
  modalOpen?: boolean
  controlCode?: string
}

const SignatureModal = ({
  controlCode,
  signatureStatus,
  modalOpen,
  onClose,
}: SignatureModalProps) => {

  const hasError = [
    FileSignatureStatus.REQUEST_ERROR,
    FileSignatureStatus.UPLOAD_ERROR,
  ].includes(signatureStatus)
  return (
    <ModalBase
      baseId="signatureDialog"
      className={style.modal}
      modalLabel="Rafræn undirritun"
      isVisible={modalOpen}
      onVisibilityChange={(visibility: boolean) => {
        if (!visibility) {
          onClose
        }
      }}
      // When there is an error it should not be possible to close the modal
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
          Rafræn undirritun
        </Text>
        <>
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
                      Öryggistala:{' '}
                      <span className={style.controlCode}>{controlCode}</span>
                    </Text>
                    <Text>
                      Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu
                      ef sama öryggistala birtist í símanum þínum.
                    </Text>
                  </>
                )
              case FileSignatureStatus.REQUEST_ERROR:
              case FileSignatureStatus.UPLOAD_ERROR:
                // TODO: Extract to a seperate error component when we start handling different errors
                return (
                  <>
                    <AlertMessage
                      type="error"
                      title="Villa kom upp við undirritun"
                      message="Það hefur eitthvað farið úrskeiðis við undirritun, vinsamlegast reynið aftur."
                    />
                    <Box marginTop={3} justifyContent="center">
                      <Button onClick={onClose} variant="primary">
                        Loka
                      </Button>
                    </Box>
                  </>
                )
              default:
                return null
            }
          })()}
        </>
      </Box>
    </ModalBase>
  )
}

export default SignatureModal
