import React, { useState } from 'react'
import { Box, Stack } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Application, FieldBaseProps } from '@island.is/application/core'
import Photo from '../Photo'
import { FileUploadController } from '@island.is/shared/form-fields'
import { GET_FILE_CONTENT_AS_BASE64 } from '@island.is/application/graphql'
import { useWatch } from 'react-hook-form'
import { useQuery } from '@apollo/client'

interface PhotoUploadProps {
  application: Application
}

const PhotoUpload = ({ application }: PhotoUploadProps & FieldBaseProps) => {
  const { formatMessage } = useLocale()

  /*const attachment = (application.attachments as unknown) as Array<{
    key: string
    name: string
  }>

  const attachmentLoaded = useWatch({
    name: 'attachments',
    defaultValue: attachment,
  })

  const { data } = useQuery(
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
  )*/

  return (
    <Box marginTop={4}>
      <Stack space={5}>
        <Photo application={application} bulletsView={true} />
        <FileUploadController
          application={application}
          id="attachments"
          header={formatMessage(m.qualityPhotoFileUploadTitle)}
          description={formatMessage(m.qualityPhotoFileUploadDescription)}
          buttonLabel={formatMessage(m.qualityPhotoUploadButtonLabel)}
        />
      </Stack>
    </Box>
  )
}

export default PhotoUpload
