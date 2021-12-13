import React from 'react'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

interface PhotoProps {
  application: Application
  img: string
}

const Photo = ({ application, img }: PhotoProps) => {
  const { formatMessage } = useLocale()
  const image = img ? img : (application.answers.photoAttachment as any)
  return (
    <Box>
      {image && (
        <Box marginTop={4} style={{ maxWidth: '191px', maxHeight: '242px' }}>
          <img alt={''} src={image} id="myimage" />
        </Box>
      )}

      {/* if at final step and no image, display alert */}
      {application.answers.deliveryMethod &&
        (!application.answers.photoAttachment ||
          application.answers.photoAttachment === '') && (
          <AlertMessage
            type="error"
            title={formatMessage(m.qualityPhotoNoPhotoAlertMessage)}
            message=""
          />
        )}
    </Box>
  )
}

export default Photo
