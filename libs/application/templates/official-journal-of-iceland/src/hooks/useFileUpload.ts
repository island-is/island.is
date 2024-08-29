import { UploadFile } from '@island.is/island-ui/core'
import {
  ADD_APPLICATION_ATTACHMENT_MUTATION,
  GET_PRESIGNED_URL_MUTATION,
} from '../graphql/queries'
import { useMutation } from '@apollo/client'
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
  const [files, setFiles] = useState<UploadFile[]>([])

  const [getPresignedUrlMutation] = useMutation<{
    officialJournalOfIcelandApplicationGetPresignedUrl: GetPresignedUrlResponse
  }>(GET_PRESIGNED_URL_MUTATION)

  const [addApplicationMutation] = useMutation<{
    officialJournalOfIcelandApplicationAddAttachment: AddAttachmentResponse
  }>(ADD_APPLICATION_ATTACHMENT_MUTATION)

  /**
   *
   * @param newFiles comes from the onChange function on the fileInput component
   */
  const onChange = (newFiles: UploadFile[]) => {
    newFiles.forEach(async (file) => {
      const type = file?.type?.split('/')[1]
      const name = file?.name?.split('.').slice(0, -1).join('.')

      if (!type || !name) {
        return
      }

      const url = await getPresignedUrl(name, type)

      if (!url) {
        throw new Error('Failed to get presigned URL')
      }

      try {
        const { success } = await uploadToS3(url, file as File)

        if (!success) {
          throw new Error('Failed to upload to S3')
        }

        await addApplicationAttachments(url, file as File)
      } catch (e) {
        console.error(e)
      }
    })
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
          type: attachmentType,
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
   * @param url presigned URL
   * @param file file to upload
   * @param onSuccess callback function to run on success
   */
  const uploadToS3 = async (url: string, file: File) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.size.toString(),
      },
      body: file,
    })

    if (response.ok) {
      return { success: true }
    }

    return { success: false }
  }

  /**
   * Adds a record in the database for the uploaded file with the presigned URL.
   * Used after the file has been successfully uploaded to S3
   * @param url presigned URL
   * @param file file to upload
   */
  const addApplicationAttachments = async (url: string, file: File) => {
    const type = file?.type?.split('/')[1]
    const name = file?.name?.split('.').slice(0, -1).join('.')
    if (!type || !name) {
      return
    }

    addApplicationMutation({
      variables: {
        input: {
          applicationId: applicationId,
          type: attachmentType,
          name: name,
          url: url,
          size: file.size,
          fileType: type,
        },
      },
    })
  }

  return { files, onChange }
}
