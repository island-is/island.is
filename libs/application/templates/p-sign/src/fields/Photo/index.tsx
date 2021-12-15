import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'

interface PhotoProps {
  application: Application
  img: string
}

const Photo = ({ application, img }: PhotoProps) => {
  const image = img ? img : (application.answers.photoAttachment as any)
  return (
    <Box>
      {image && (
        <Box marginTop={4} style={{ maxWidth: '191px', maxHeight: '242px' }}>
          <img alt={''} src={image} id="myimage" />
        </Box>
      )}
    </Box>
  )
}

export default Photo
