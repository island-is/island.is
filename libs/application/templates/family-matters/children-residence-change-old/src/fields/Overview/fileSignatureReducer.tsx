import { MessageDescriptor } from '@formatjs/intl'
import { signatureModal } from '../../lib/messages'

export enum FileSignatureStatus {
  REQUEST = 'REQUEST',
  UPLOAD = 'UPLOAD',
  SUCCESS = 'SUCCESS',
  REQUEST_ERROR = 'REQUEST_ERROR',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
}

export type ErrorStatus =
  | FileSignatureStatus.UPLOAD_ERROR
  | FileSignatureStatus.REQUEST_ERROR

export enum FileSignatureActionTypes {
  CLOSE_MODAL = 'CLOSE_MODAL',
  REQUEST = 'REQUEST',
  UPLOAD = 'UPLOAD',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

const modalContent: {
  [key in Exclude<FileSignatureStatus, ErrorStatus>]: ModalContent
} = {
  [FileSignatureStatus.REQUEST]: {
    title: signatureModal.general.title,
  },
  [FileSignatureStatus.UPLOAD]: {
    title: signatureModal.general.title,
    message: signatureModal.security.message,
  },
  [FileSignatureStatus.SUCCESS]: {
    title: signatureModal.success.title,
    message: signatureModal.success.message,
  },
}

export const errorMessages: {
  [key: number]: ModalContent
} = {
  400: {
    title: signatureModal.userCancelledWarning.title,
    message: signatureModal.userCancelledWarning.message,
  },
  404: {
    title: signatureModal.noElectronicIdError.title,
    message: signatureModal.noElectronicIdError.message,
  },
  408: {
    title: signatureModal.timeOutWarning.title,
    message: signatureModal.timeOutWarning.message,
  },
  500: {
    title: signatureModal.defaultError.title,
    message: signatureModal.defaultError.message,
  },
}

export type ErrorTypes = keyof typeof errorMessages

type Action =
  | { type: Exclude<FileSignatureActionTypes, FileSignatureActionTypes.ERROR> }
  | {
      type: FileSignatureActionTypes.ERROR
      error: ErrorTypes
      status: ErrorStatus
    }

interface ModalContent {
  title: MessageDescriptor
  message?: MessageDescriptor
}

export interface ReducerState {
  status: FileSignatureStatus
  modalOpen: boolean
  content: ModalContent
}
export const initialFileSignatureState: ReducerState = {
  status: FileSignatureStatus.REQUEST,
  modalOpen: false,
  content: {
    title: modalContent[FileSignatureStatus.REQUEST].title,
  },
}

export const fileSignatureReducer = (
  state: ReducerState,
  action: Action,
): ReducerState => {
  switch (action.type) {
    case FileSignatureActionTypes.CLOSE_MODAL: {
      return {
        ...state,
        modalOpen: false,
      }
    }
    case FileSignatureActionTypes.REQUEST: {
      return {
        ...state,
        ...initialFileSignatureState,
        modalOpen: true,
      }
    }
    case FileSignatureActionTypes.UPLOAD: {
      const content = modalContent[action.type]
      const { title, message } = content
      return {
        ...state,
        status: FileSignatureStatus.UPLOAD,
        content: { title, message },
      }
    }
    case FileSignatureActionTypes.SUCCESS: {
      const content = modalContent[action.type]
      const { title, message } = content
      return {
        ...state,
        status: FileSignatureStatus.SUCCESS,
        content: { title, message },
      }
    }
    case FileSignatureActionTypes.ERROR: {
      const error = errorMessages[action.error] || errorMessages[500]
      return {
        ...state,
        status: action.status,
        content: {
          title: error.title,
          message: error.message,
        },
      }
    }
    default: {
      return initialFileSignatureState
    }
  }
}
