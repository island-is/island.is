import React from 'react'
import { Roles } from '../../../lib/constants'
import { FileSignatureStatus, ReducerState } from '../fileSignatureReducer'
import ErrorMessage from './ErrorMessage'
import ControlCode from './ControlCode'
import Skeleton from './SkeletonLoader'

interface SignatureModalProps {
  fileSignatureState: ReducerState
  onClose: () => void
  controlCode: string
  role: Roles
}

const ModalConditionalContent = ({
  fileSignatureState,
  controlCode,
  onClose,
  role,
}: SignatureModalProps) => {
  switch (fileSignatureState.status) {
    case FileSignatureStatus.REQUEST:
      return <Skeleton />
    case FileSignatureStatus.SUCCESS:
      return role === Roles.ParentA ? (
        <div>Success for parent A</div>
      ) : (
        <div>Success for parent B</div>
      )
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
