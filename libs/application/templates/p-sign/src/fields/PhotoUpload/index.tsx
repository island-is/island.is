import React, { useState } from 'react'
import { Box, InputFileUpload } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Application, FieldBaseProps } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import Photo from '../Photo'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

interface PhotoUploadProps {
  application: Application
}

const PhotoUpload = ({ application }: PhotoUploadProps & FieldBaseProps) => {
  const { lang: locale, formatMessage } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [image, setImage] = useState(
    (application.answers.photoAttachment as any) ?? '',
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

  const updateApp = async (file: any, name: string | undefined) => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            photoAttachment: file,
            attachmentFileName: name,
          },
        },
        locale,
      },
    }).then((_) => {
      setValue('photoAttachment', file)
      setValue('attachmentFileName', name)
    })
  }

  const onChange = (newFiles: File[]) => {
    setFileName([{ name: newFiles[0].name, status: 'done' }] as any)
    const fileReader = new FileReader()

    fileReader.onload = function (fileLoadedEvent) {
      const srcData = fileLoadedEvent.target?.result //base64
      setImage(srcData as string)
      updateApp(srcData, newFiles[0].name)
    }

    fileReader.readAsDataURL(newFiles[0])
  }

  return (
    <Box marginY={5}>
      <Photo application={application} img={image} />
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
  )
}

export default PhotoUpload
