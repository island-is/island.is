export type FileResponse = {
  fileName: string
  data: string
  fileType: string
}

export type FileResponseWithType = {
  type: string
  file: FileResponse
}
