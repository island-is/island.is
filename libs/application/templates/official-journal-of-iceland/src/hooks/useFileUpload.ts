import { UploadFile } from '@island.is/island-ui/core'
import { UPLOAD_ATTACHMENTS_MUTATION } from '../graphql/queries'
import { useMutation } from '@apollo/client'
import { useState } from 'react'

type UseFileUploadProps = {
  applicationId: string
}

export const useFileUpload = ({ applicationId }: UseFileUploadProps) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploadAttachments] = useMutation(UPLOAD_ATTACHMENTS_MUTATION)

  const uploadFiles = async (files: UploadFile[]) => {
    files.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        try {
          const binaryStr = reader.result

          if (!binaryStr || typeof binaryStr === 'string') {
            return
          }

          const buff = Buffer.from(binaryStr)
          const base64 = buff.toString('base64')

          console.log({
            applicationId: applicationId,
            base: base64,
          })

          uploadAttachments({
            variables: {
              input: {
                applicationId: applicationId,
                base64: base64,
              },
            },
          })
        } catch (e) {
          console.log(e)
        }
      }
      reader.readAsArrayBuffer(file.originalFileObj as Blob)
    })
  }

  return { files, uploadFiles }
}
