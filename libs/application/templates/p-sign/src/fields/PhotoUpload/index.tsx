import React from 'react'
import { Box, Stack } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Application, FieldBaseProps } from '@island.is/application/core'
import Photo from '../Photo'
import { FileUploadController } from '@island.is/shared/form-fields'

interface PhotoUploadProps {
  application: Application
}

const PhotoUpload = ({ application }: PhotoUploadProps & FieldBaseProps) => {
  const { formatMessage } = useLocale()

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
