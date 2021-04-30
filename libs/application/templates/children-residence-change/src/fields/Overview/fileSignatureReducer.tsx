import { MessageDescriptor } from '@formatjs/intl'
import { signatureModal } from '../../lib/messages'

export enum FileSignatureStatus {
  INITIAL = 'INITIAL',
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

export type ContentTypes = 'warning' | 'error' | 'info' | 'success'

const modalContent: {
  [key in Exclude<
    FileSignatureStatus,
    ErrorStatus | FileSignatureStatus.INITIAL
  >]: ModalContent
} = {
  [FileSignatureStatus.REQUEST]: {
    title: signatureModal.general.title,
    type: 'info',
  },
  [FileSignatureStatus.UPLOAD]: {
    title: signatureModal.general.title,
    message: signatureModal.security.message,
    type: 'info',
  },
  [FileSignatureStatus.SUCCESS]: {
    title: signatureModal.success.title,
    message: signatureModal.success.message,
    type: 'success',
  },
}

export const errorMessages: {
  [key: number]: ModalContent
} = {
  400: {
    title: signatureModal.userCancelledWarning.title,
    message: signatureModal.userCancelledWarning.message,
    type: 'warning',
  },
  404: {
    title: signatureModal.noElectronicIdError.title,
    message: signatureModal.noElectronicIdError.message,
    type: 'error',
  },
  408: {
    title: signatureModal.timeOutWarning.title,
    message: signatureModal.timeOutWarning.message,
    type: 'warning',
  },
  500: {
    title: signatureModal.defaultError.title,
    message: signatureModal.defaultError.message,
    type: 'error',
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
  type: ContentTypes
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
    type: modalContent[FileSignatureStatus.REQUEST].type,
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
      const content = modalContent[action.type]
      const { title, type } = content
      return {
        ...state,
        status: FileSignatureStatus.REQUEST,
        modalOpen: true,
        content: { title, type },
      }
    }
    case FileSignatureActionTypes.UPLOAD: {
      const content = modalContent[action.type]
      const { title, message, type } = content
      return {
        ...state,
        status: FileSignatureStatus.UPLOAD,
        content: { title, type, message },
      }
    }
    case FileSignatureActionTypes.SUCCESS: {
      const content = modalContent[action.type]
      const { title, message, type } = content
      return {
        ...state,
        status: FileSignatureStatus.SUCCESS,
        modalOpen: true,
        content: { title, type, message },
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
          type: error.type,
        },
      }
    }
    default: {
      return initialFileSignatureState
    }
  }
}
