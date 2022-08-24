import { UploadFile, UploadFileStatus } from '@island.is/island-ui/core/types'
export interface PresignedPost {
  url: string
  fields: { [key: string]: string }
}

export interface CreatePresignedPost {
  fileName: string
  type: string
}

export interface DeleteFile {
  id: string
  caseId: string
}

export interface DeleteFileResponse {
  success: boolean
}

export interface GetSignedUrl {
  id: string
  caseId: string
}

export interface SignedUrl {
  url: string
}

export interface UploadFileToCourt {
  id: string
  caseId: string
}

export interface UploadFileToCourtResponse {
  success: boolean
}

export enum CaseFileState {
  STORED_IN_RVG = 'STORED_IN_RVG',
  STORED_IN_COURT = 'STORED_IN_COURT',
  DELETED = 'DELETED',
}

export enum CaseFileSubtype {
  COVER_LETTER = 'COVER_LETTER',
  INDICTMENT = 'INDICTMENT',
  CRIMINAL_RECORD = 'CRIMINAL_RECORD',
  COST_BREAKDOWN = 'COST_BREAKDOWN',
  CASE_FILE_CONTENTS = 'CASE_FILE_CONTENTS',
  CASE_FILE = 'CASE_FILE',
}

export type CaseFileStatus =
  | 'done-broken'
  | 'not-uploaded'
  | 'broken'
  | 'case-not-found'
  | 'unsupported'

export interface CaseFile extends UploadFile {
  id?: string
  created: string
  modified: string
  caseId: string
  state?: CaseFileState
  status?: UploadFileStatus | CaseFileStatus
  subtype?: CaseFileSubtype
}

export interface CreateFile {
  type: string
  key: string
  size: number
}
