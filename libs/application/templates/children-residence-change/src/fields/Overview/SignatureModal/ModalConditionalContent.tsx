import React from 'react'
import { FileSignatureStatus, ReducerState } from '../fileSignatureReducer'
import ErrorMessage from './ErrorMessage'
import ControlCode from './ControlCode'
import Skeleton from './SkeletonLoader'

interface SignatureModalProps {
  fileSignatureState: ReducerState
  onClose: () => void
  controlCode: string
}

const ModalConditionalContent = ({
  fileSignatureState,
  controlCode,
  onClose,
}: SignatureModalProps) => {
  switch (fileSignatureState.status) {
    case FileSignatureStatus.REQUEST:
      return <Skeleton />
    case FileSignatureStatus.UPLOAD:
      return <ControlCode controlCode={controlCode} />
    case FileSignatureStatus.REQUEST_ERROR:
    case FileSignatureStatus.UPLOAD_ERROR:
      return (
        <ErrorMessage
          errorCode={fileSignatureState.errorCode}
          onClose={onClose}
        />
      )
    default:
      return null
  }
}

export default ModalConditionalContent
