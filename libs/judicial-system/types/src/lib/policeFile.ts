export interface PoliceCaseFile {
  id: string
  name: string
  policeCaseNumber: string
  chapter?: number
  displayDate?: string
}

export interface UploadPoliceCaseFile {
  id: string
  name: string
}

export interface UploadPoliceCaseFileResponse {
  key: string
  size: number
}
