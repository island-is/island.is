import { FileUploadStatus, toast, UploadFile } from '@island.is/island-ui/core'
import { useState } from 'react'
import { uuid } from 'uuidv4'

export interface TUploadFile extends UploadFile {
  displayOrder?: number | null
  userGeneratedFileName?: string | null
  submissionDate?: string | null
}

export type S3UploadResponse = {
  url: string
}

export const useUploadFiles = (files: UploadFile[] | null) => {
  const [uploadFiles, setUploadFiles] = useState<TUploadFile[]>(files ?? [])

  const allFilesDoneOrError = uploadFiles.every(
    (file) =>
      file.status === FileUploadStatus.done ||
      file.status === FileUploadStatus.error,
  )

  const someFilesError = uploadFiles.some(
    (file) => file.status === FileUploadStatus.error,
  )

  const addUploadFile = (file: UploadFile) => setUploadFiles((prev) => [...prev, file])

  const addUploadFiles = (
    files: File[],
    overRides?: Partial<TUploadFile>,
    setUserGeneratedFilename = false
  ) => {
    const uploadFiles: TUploadFile[] = files.map((file) => ({
      id: `${file.name}-${uuid()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      percent: 0,
      originalFileObj: file,
      userGeneratedFileName: setUserGeneratedFilename ? file.name : undefined,
      ...overRides
    }))

    setUploadFiles((prev) => [...uploadFiles, ...prev])

    return uploadFiles
  }

  const updateUploadFile = (file: TUploadFile, newId?: string) => {
    setUploadFiles((prev) => prev.map((f) =>
      f.id === file.id ? { ...f, ...file, id: newId ?? file.id } : f,
    ))
  }

  const removeUploadFile = (file: TUploadFile) =>
    setUploadFiles((prev) => prev.filter((f) => f.id !== file.id))

  return {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFile,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile
  }
}

export const useS3Upload = (
  fieldId: string,
  file: UploadFile
) => {

}

export const uploadFileToS3 = (
  file: UploadFile,
  uploadUrl: string,
  fields: Record<string, any>,
): Promise<S3UploadResponse> => {
  return new Promise<S3UploadResponse>((resolve, reject) => {
    const req = new XMLHttpRequest()

    const onError = () => {
      // TODO add a dispatch action to update the file statuus to error

      reject(req.response)
    }

    req.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)

        //TODO add a dispatch action to update the file status to uploading and update the percent
      }
    })

    req.onload = () => {
      if (req.status !== 200 && req.status !== 204) {
        onError()
        return
      }

      resolve({ url: uploadUrl })
    }

    req.addEventListener('error', onError)
    req.upload.addEventListener('error', onError)

    const form = new FormData()

    Object.keys(fields).forEach((key) => form.append(key, fields[key]))

    if (file.originalFileObj) {
      form.append('file', file.originalFileObj)
    }
    req.open('POST', uploadUrl, true)
    req.send(form)
  })
}