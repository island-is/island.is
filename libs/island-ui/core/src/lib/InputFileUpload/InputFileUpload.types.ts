export type UploadFileStatus = 'error' | 'done' | 'uploading'

export interface UploadFile {
  name: string
  url?: string
  status?: UploadFileStatus
  percent?: number
  originalFileObj?: File | Blob
  error?: string
}
