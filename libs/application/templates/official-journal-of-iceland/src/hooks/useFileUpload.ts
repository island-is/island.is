import { UploadFileDeprecated } from '@island.is/island-ui/core'
import {
  ADD_APPLICATION_ATTACHMENT_MUTATION,
  DELETE_APPLICATION_ATTACHMENT_MUTATION,
  GET_APPLICATION_ATTACHMENTS_QUERY,
  GET_PRESIGNED_URL_MUTATION,
} from '../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ApplicationAttachmentType } from '../lib/constants'

/**
 *
 * @param applicationId id of the application
 * @param attachmentType type of the attachment used for constructing the presigned URL key
 */
type UseFileUploadProps = {
  applicationId: string
  attachmentType: ApplicationAttachmentType
}

type GetPresignedUrlResponse = {
  url: string
}

type AddAttachmentResponse = {
  success: boolean
}

type ApplicationAttachment = {
  id: string
  fileName: string
  originalFileName: string
  fileFormat: string
  fileExtension: string
  fileLocation: string
  fileSize: number
}

type GetAttachmentsResponse = {
  attachments: ApplicationAttachment[]
}

/**
 * Hook for uploading files to S3
 * @param props UseFileUploadProps
 * @param props.applicationId id of the application
 * @param props.attachmentType type of the attachment used for constructing the presigned URL key
 */
export const useFileUpload = ({
  applicationId,
  attachmentType,
}: UseFileUploadProps) => {
  const [files, setFiles] = useState<UploadFileDeprecated[]>([])

  const [getPresignedUrlMutation] = useMutation<{
    officialJournalOfIcelandApplicationGetPresignedUrl: GetPresignedUrlResponse
  }>(GET_PRESIGNED_URL_MUTATION)

  const [addApplicationMutation] = useMutation<{
    officialJournalOfIcelandApplicationAddAttachment: AddAttachmentResponse
  }>(ADD_APPLICATION_ATTACHMENT_MUTATION, {
    onCompleted() {
      refetch()
    },
  })

  const { refetch } = useQuery<{
    officialJournalOfIcelandApplicationGetAttachments: GetAttachmentsResponse
  }>(GET_APPLICATION_ATTACHMENTS_QUERY, {
    variables: {
      input: {
        applicationId: applicationId,
        attachmentType: attachmentType,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const currentFiles =
        data.officialJournalOfIcelandApplicationGetAttachments.attachments.map(
          (attachment) =>
            ({
              name: attachment.originalFileName,
              size: attachment.fileSize,
              type: attachment.fileFormat,
              key: attachment.fileLocation,
              status: 'done',
            } as UploadFileDeprecated),
        )
      setFiles((prevFiles) => [...prevFiles, ...currentFiles])
    },
    onError() {
      setFiles([])
    },
  })

  const [deleteApplicationAttachmentMutation] = useMutation<{
    officialJournalOfIcelandApplicationDeleteAttachment: AddAttachmentResponse
  }>(DELETE_APPLICATION_ATTACHMENT_MUTATION, {
    onCompleted() {
      refetch()
    },
  })

  /**
   *
   * @param newFiles comes from the onChange function on the fileInput component
   */
  const onChange = (newFiles: UploadFileDeprecated[]) => {
    newFiles.forEach(async (file) => {
      const type = file?.type?.split('/')[1]
      const name = file?.name?.split('.').slice(0, -1).join('.')

      if (!type || !name) {
        return
      }

      const url = await getPresignedUrl(name, type)

      if (!url) {
        file.status = 'error'
        return
      }

      const loc = new URL(url).pathname

      uploadToS3(url, file as File)
      addApplicationAttachments(loc, file as File)

      file.key = loc

      setFiles((prevFiles) => [...prevFiles, file])
    })
  }

  /**
   * Deletes the file from the database and S3
   */
  const onRemove = async (file: UploadFileDeprecated) => {
    deleteApplicationAttachmentMutation({
      variables: {
        input: {
          applicationId: applicationId,
          key: file.key,
        },
      },
    })

    setFiles(files.filter((f) => f.key !== file.key))
  }

  /**
   * Gets a presigned URL for a file
   * @param name name of the file ex. myFile
   * @param type type of the file ex. pdf, doc, docx...
   * @returns
   */
  const getPresignedUrl = async (name: string, type: string) => {
    const { data } = await getPresignedUrlMutation({
      variables: {
        input: {
          attachmentType: attachmentType,
          applicationId: applicationId,
          fileName: name,
          fileType: type,
        },
      },
    })

    return data?.officialJournalOfIcelandApplicationGetPresignedUrl.url
  }

  /**
   * Uploads a file to S3 using a presigned URL
   * Used when a presigned URL has been successfully retrieved
   * @param preSignedUrl presigned URL
   * @param file file to upload
   * @param onSuccess callback function to run on success
   */
  const uploadToS3 = async (preSignedUrl: string, file: File) => {
    await fetch(preSignedUrl, {
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.size.toString(),
      },
      method: 'PUT',
      body: file,
    })
  }

  /**
   * Adds a record in the database for the uploaded file with the presigned URL.
   * Used after the file has been successfully uploaded to S3
   * @param url presigned URL
   * @param file file to upload
   */
  const addApplicationAttachments = (
    url: string,
    file: UploadFileDeprecated,
  ) => {
    const type = file?.type?.split('/')[1]
    const name = file?.name?.split('.').slice(0, -1).join('.')
    if (!type || !name) {
      return
    }

    addApplicationMutation({
      variables: {
        input: {
          applicationId: applicationId,
          attachmentType: attachmentType,
          fileName: name,
          originalFileName: file.name,
          fileFormat: type,
          fileExtension: type,
          fileLocation: url,
          fileSize: file.size,
        },
      },
      onCompleted() {
        file.status = 'done'
      },
      onError() {
        file.status = 'error'
      },
    })
  }

  return { files, onChange, onRemove }
}
