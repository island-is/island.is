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
  RESET = 'RESET',
  REQUEST = 'REQUEST',
  UPLOAD = 'UPLOAD',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

type Action =
  | { type: Exclude<FileSignatureActionTypes, FileSignatureActionTypes.ERROR> }
  | {
      type: FileSignatureActionTypes.ERROR
      error: number
      status: ErrorStatus
    }

export type ReducerState =
  | { status: Exclude<FileSignatureStatus, ErrorStatus>; modalOpen: boolean }
  | {
      status: ErrorStatus
      errorCode: number
      modalOpen: boolean
    }

export const initialFileSignatureState: ReducerState = {
  status: FileSignatureStatus.INITIAL,
  modalOpen: false,
}

export const fileSignatureReducer = (
  state: ReducerState,
  action: Action,
): ReducerState => {
  switch (action.type) {
    case FileSignatureActionTypes.RESET: {
      return { ...state, status: FileSignatureStatus.INITIAL, modalOpen: false }
    }
    case FileSignatureActionTypes.REQUEST: {
      return { ...state, status: FileSignatureStatus.REQUEST, modalOpen: true }
    }
    case FileSignatureActionTypes.UPLOAD: {
      return { ...state, status: FileSignatureStatus.UPLOAD }
    }
    case FileSignatureActionTypes.SUCCESS: {
      return { ...state, status: FileSignatureStatus.SUCCESS, modalOpen: false }
    }
    case FileSignatureActionTypes.ERROR: {
      return {
        ...state,
        status: action.status,
        errorCode: action.error,
      }
    }
    default: {
      return initialFileSignatureState
    }
  }
}
