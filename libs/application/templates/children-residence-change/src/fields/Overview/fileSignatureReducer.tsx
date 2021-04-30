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

export enum ContentTypes {
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
}

const modalContent: {
  [key in Exclude<FileSignatureStatus, ErrorStatus>]: ModalContent
} = {
  [FileSignatureStatus.REQUEST]: {
    title: signatureModal.general.title,
    type: ContentTypes.INFO,
  },
  [FileSignatureStatus.UPLOAD]: {
    title: signatureModal.general.title,
    message: signatureModal.security.message,
    type: ContentTypes.INFO,
  },
  [FileSignatureStatus.SUCCESS]: {
    title: signatureModal.success.title,
    message: signatureModal.success.message,
    type: ContentTypes.SUCCESS,
  },
}

export const errorMessages: {
  [key: number]: ModalContent
} = {
  400: {
    title: signatureModal.userCancelledWarning.title,
    message: signatureModal.userCancelledWarning.message,
    type: ContentTypes.WARNING,
  },
  404: {
    title: signatureModal.noElectronicIdError.title,
    message: signatureModal.noElectronicIdError.message,
    type: ContentTypes.ERROR,
  },
  408: {
    title: signatureModal.timeOutWarning.title,
    message: signatureModal.timeOutWarning.message,
    type: ContentTypes.WARNING,
  },
  500: {
    title: signatureModal.defaultError.title,
    message: signatureModal.defaultError.message,
    type: ContentTypes.ERROR,
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
      return {
        ...state,
        ...initialFileSignatureState,
        modalOpen: true,
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
