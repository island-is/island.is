import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UploadFile } from '@island.is/island-ui/core'
import {
  CreateFileMutation,
  CreatePresignedPostMutation,
} from '@island.is/judicial-system-web/graphql'
import { Case, PresignedPost } from '@island.is/judicial-system/types'

export const useS3Upload = (workingCase?: Case) => {
  const [files, setFiles] = useState<UploadFile[]>([])

  useEffect(() => {
    setFiles(workingCase?.files || [])
  }, [workingCase])

  const [createPresignedPostMutation] = useMutation(CreatePresignedPostMutation)

  const [createFileMutation] = useMutation(CreateFileMutation)

  const createPresignedPost = async (
    filename: string,
  ): Promise<PresignedPost> => {
    const { data: presignedPostData } = await createPresignedPostMutation({
      variables: { input: { caseId: workingCase?.id, fileName: filename } },
    })

    return presignedPostData?.createPresignedPost
  }

  const getFileIndexInFiles = (file: UploadFile) => {
    return files.includes(file)
      ? files.findIndex((fileInFiles) => fileInFiles.name === file.name)
      : files.length
  }

  const updateFile = (file: UploadFile) => {
    const newFiles = [...files]

    newFiles[getFileIndexInFiles(file)] = file

    setFiles(newFiles)
  }

  const addFileToCase = async (size: number, key: string) => {
    if (workingCase) {
      await createFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            key,
            size,
          },
        },
      })
    }
  }

  const createFormData = (
    presignedPost: PresignedPost,
    file: UploadFile,
  ): FormData => {
    const formData = new FormData()
    Object.keys(presignedPost.fields).forEach((key) =>
      formData.append(key, presignedPost.fields[key]),
    )
    formData.append('file', file as File)

    return formData
  }

  const uploadToS3 = (file: UploadFile, presignedPost: PresignedPost) => {
    const request = new XMLHttpRequest()
    request.withCredentials = true
    request.responseType = 'json'

    request.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        file.percent = (evt.loaded / evt.total) * 100
        file.status = 'uploading'

        updateFile(file)
      }
    })

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        file.status = 'done'

        updateFile(file)

        if (file.size && file.key) {
          addFileToCase(file.size, file.key)
        }
      } else {
        file.status = 'error'
        updateFile(file)
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file))
  }

  const onChange = (newFiles: File[]) => {
    const newUploadFiles = newFiles as UploadFile[]

    setFiles([...files, ...newUploadFiles])

    newUploadFiles.forEach(async (file) => {
      const presignedPost = await createPresignedPost(file.name)

      if (!presignedPost) {
        return
      }

      file.key = presignedPost.fields.key

      updateFile(file)

      uploadToS3(file, presignedPost)
    })
  }

  const onRemove = () => console.log('Rmove')

  return { files, onChange, onRemove }
}
