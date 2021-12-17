import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import { UploadFile } from '@island.is/island-ui/core'
import {
  CreateFileMutation,
  CreatePresignedPostMutation,
  DeleteFileMutation,
  UploadPoliceCaseFileMutation,
} from '@island.is/judicial-system-web/graphql'
import { Case, CaseFile } from '@island.is/judicial-system/types'

import { PresignedPost } from '../../graphql/schema'

export const useS3UploadDraft = (workingCase: Case) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>()

  /**
   * Define CRUD mutations for uploading files to S3 as well as
   * creating a presigned post for uploading files to S3.
   * */
  const [uploadPoliceCaseFileMutation] = useMutation(
    UploadPoliceCaseFileMutation,
  )
  const [createPresignedPostMutation] = useMutation(CreatePresignedPostMutation)
  const [createFileMutation] = useMutation(CreateFileMutation)
  const [deleteFileMutation] = useMutation(DeleteFileMutation)

  /**
   * A function that creates the data needed to upload a file to S3
   */
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

  /**
   * A function that deletes a file from S3, removes it from the case, marks the file as
   * deleted in the database and removes it from the local state.
   */
  /**
   * A onChange event handler that is called when files are added to the file input.
   */

  useEffect(() => {
    const copyOfFiles = [...files]

    const setFileKey = (file: UploadFile, key: string) => {
      if (workingCase.caseFiles) {
        const index = workingCase.caseFiles.indexOf(file as CaseFile)
        const copyOfFiles = { ...files }

        if (index > -1) {
          copyOfFiles[index].key = key
          setFiles(copyOfFiles)
        }
      }
    }

    /**
     * A function that uses the CreatePresignedPostMutation to create a presigned post
     */
    const createPresignedPost = async (
      filename: string,
      type: string,
    ): Promise<PresignedPost> => {
      const { data: presignedPostData } = await createPresignedPostMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            fileName: filename,
            type,
          },
        },
      })

      return presignedPostData?.createPresignedPost
    }

    /**
     * A function that takes a file and a presigned post and uploads the file to S3,
     * adds the file to the database, adds the file to the case and adds it to the
     * local state. This function should also register the upload progress to the file
     * object.
     */
    const uploadToS3 = (file: UploadFile, presignedPost: PresignedPost) => {
      const request = new XMLHttpRequest()
      request.withCredentials = true
      request.responseType = 'json'

      console.log(files)

      // request.upload.addEventListener('progress', (evt) => {
      //   if (evt.lengthComputable) {
      //     file.percent = (evt.loaded / evt.total) * 100
      //     file.status = 'uploading'

      //     updateFile(file)
      //   }
      // })

      // request.upload.addEventListener('error', (evt) => {
      //   if (evt.lengthComputable) {
      //     file.percent = 0
      //     file.status = 'error'

      //     updateFile(file)
      //   }
      // })

      // request.addEventListener('load', () => {
      //   if (request.status >= 200 && request.status < 300) {
      //     addFileToCase(file)
      //   } else {
      //     file.status = 'error'
      //     file.percent = 0
      //     updateFile(file)
      //   }
      // })

      // request.open('POST', presignedPost.url)
      // request.send(createFormData(presignedPost, file))
    }

    copyOfFiles.map(async (file) => {
      const presignedPost = await createPresignedPost(
        file.name.normalize(),
        file.type ?? '',
      ).catch(() =>
        setUploadErrorMessage(
          'Upp kom óvænt kerfisvilla. Vinsamlegast reynið aftur.',
        ),
      )

      if (!presignedPost) {
        return
      }

      uploadToS3(file, presignedPost)
    })
  }, [
    createPresignedPostMutation,
    files,
    workingCase.caseFiles,
    workingCase.id,
  ])

  const onChange = async (newFiles: UploadFile[], isRetry?: boolean) => {
    setUploadErrorMessage(undefined)
    if (!isRetry) {
      setFiles([...files, ...newFiles])
    }
  }

  return { files, onChange }
}
