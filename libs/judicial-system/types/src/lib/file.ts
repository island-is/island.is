export interface PresignedPost {
  url: string
  fields: { [key: string]: string }
}

export interface CreatePresignedPost {
  fileName: string
}

export interface DeleteFile {
  id: string
}

export interface DeleteFileResponse {
  success: boolean
}

export interface GetSignedUrl {
  caseId: string
  id: string
}

export interface SignedUrl {
  url: string
}

export enum CaseFileState {
  STORED_IN_RVG = 'STORED_IN_RVG',
  STORED_IN_COURT = 'STORED_IN_COURT',
  BOKEN_LINK = 'BOKEN_LINK',
  DELETED = 'DELETED',
}

export interface CaseFile {
  id: string
  created: string
  modified: string
  caseId: string
  name: string
  state: CaseFileState
  key: string
  size: number
  court_key?: string
}

export interface CreateFile {
  key: string
  size: number
}
