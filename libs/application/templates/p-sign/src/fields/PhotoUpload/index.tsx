import React, { useState } from 'react'
import { Box, InputFileUpload, Stack } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Application, FieldBaseProps } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import Photo from '../Photo'

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

  return (
    <Box marginTop={4}>
      <Stack space={5}>
        <Photo application={application} img={image} bulletsView={true} />
        <Box>
          <InputFileUpload
            fileList={fileName}
            header={formatMessage(m.qualityPhotoFileUploadTitle)}
            description={formatMessage(m.qualityPhotoFileUploadDescription)}
            buttonLabel={formatMessage(m.qualityPhotoUploadButtonLabel)}
            accept=".jpeg, .png, .jpg"
            onChange={onChange}
            onRemove={() => {
              setFileName([])
              setImage('')
              updateApp('', '')
            }}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default PhotoUpload
