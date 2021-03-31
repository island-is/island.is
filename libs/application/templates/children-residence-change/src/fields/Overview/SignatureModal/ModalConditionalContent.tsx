import React from 'react'
import { FileSignatureStatus } from '../fileSignatureReducer'
import ErrorMessage from './ErrorMessage'
import ControlCode from './ControlCode'
import Skeleton from './SkeletonLoader'

interface SignatureModalProps {
  signatureStatus: FileSignatureStatus
  onClose: () => void
  controlCode: string
  errorCode?: number
}

const ModalCondidionalContent = ({
  controlCode,
  signatureStatus,
  onClose,
  errorCode,
}: SignatureModalProps) => {
  switch (signatureStatus) {
    case FileSignatureStatus.REQUEST:
      return <Skeleton />
    case FileSignatureStatus.UPLOAD:
      return <ControlCode controlCode={controlCode} />
    case FileSignatureStatus.REQUEST_ERROR:
    case FileSignatureStatus.UPLOAD_ERROR:
      return <ErrorMessage errorCode={errorCode} onClose={onClose} />
    default:
      return null
  }
}

export default ModalCondidionalContent
