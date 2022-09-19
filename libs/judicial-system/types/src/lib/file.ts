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

export enum CaseFileCategory {
  COURT_RECORD = 'COURT_RECORD',
  RULING = 'RULING',
  COVER_LETTER = 'COVER_LETTER',
  INDICTMENT = 'INDICTMENT',
  CRIMINAL_RECORD = 'CRIMINAL_RECORD',
  COST_BREAKDOWN = 'COST_BREAKDOWN',
  CASE_FILE_CONTENTS = 'CASE_FILE_CONTENTS',
  CASE_FILE = 'CASE_FILE',
}

export interface CaseFile {
  id: string
  created: string
  modified: string
  caseId: string
  name: string
  type: string
  state: CaseFileState
  key?: string
  size: number
}

export interface CreateFile {
  type: string
  key: string
  size: number
}
