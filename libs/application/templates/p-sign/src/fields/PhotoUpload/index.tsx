import React, { useState } from 'react'
import { Box, Stack } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Application, FieldBaseProps } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import Photo from '../Photo'
import { FileUploadController } from '@island.is/shared/form-fields'
import { GET_FILE_CONTENT_AS_BASE64 } from '@island.is/application/graphql'
import { useWatch } from 'react-hook-form'
import { useQuery, gql } from '@apollo/client'

interface PhotoUploadProps {
  application: Application
}

const PhotoUpload = ({ application }: PhotoUploadProps & FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [image, setImage] = useState(
    (application.answers.photoAttachment as string) ?? '',
  )
  const [fileName, setFileName] = useState(
    application.answers.attachmentFileName
      ? [
          {
            name: application.answers.attachmentFileName,
            status: 'done',
          } as any,
        ]
      : [],
  )
  const { setValue } = useFormContext()

  const updateApp = async (file: string, name: string) => {
    setValue('photoAttachment', file)
    setValue('attachmentFileName', name)
  }

  const onChange = (newFiles: File[]) => {
    setFileName([{ name: newFiles[0].name, status: 'done' }] as any)
    const fileReader = new FileReader()

    fileReader.onload = function (fileLoadedEvent) {
      const srcData = fileLoadedEvent.target?.result //base64
      setImage(srcData as string)
      updateApp(srcData as string, newFiles[0].name)
    }

    fileReader.readAsDataURL(newFiles[0])
  }
  const attachment = (application.attachments as unknown) as Array<{
    key: string
    name: string
  }>
  const attachmentLoaded = useWatch({
    name: 'attachments',
    // FYI the watch value is not queried unless the value changes after rendering.
    // see react hook form's docs for useWatch for further info.
    defaultValue: attachment,
  })

  const { data = {}, error: queryError, loading } = useQuery(
    GET_FILE_CONTENT_AS_BASE64,
    {
      skip: !attachmentLoaded[0]?.key,
      variables: {
        input: {
          id: application.id,
          key: attachmentLoaded[0]?.key,
        },
      },
    },
  )
  return (
    <Box marginTop={4}>
      <Stack space={5}>
        <Photo application={application} img={image} bulletsView={true} />
        <Box>
          <FileUploadController
            application={application}
            id="attachments"
            header={formatMessage(m.qualityPhotoFileUploadTitle)}
            description={formatMessage(m.qualityPhotoFileUploadDescription)}
            buttonLabel={formatMessage(m.qualityPhotoUploadButtonLabel)}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default PhotoUpload
