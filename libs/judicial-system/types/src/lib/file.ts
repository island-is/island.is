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

export interface CaseFile {
  id: string
  created: string
  modified: string
  caseId: string
  name: string
  key: string
  size: number
}

export interface CreateFile {
  key: string
  size: number
}
