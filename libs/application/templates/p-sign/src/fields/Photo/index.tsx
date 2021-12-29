import React from 'react'
import { Box, Icon } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'
import Bullets from '../Bullets'
import { boxStyle } from '../styles.css'

interface PhotoProps {
  application: Application
  img: string
  bulletsView: boolean | undefined
}

const Photo = ({ application, img, bulletsView }: PhotoProps) => {
  const image =
    img !== undefined ? img : (application.answers.photoAttachment as string)

  return (
    <Box display={['block', 'block', 'flex']}>
      <Box className={boxStyle}>
        {image ? (
          <img alt={''} src={image} id="myimage" />
        ) : (
          <Box background="dark100">
            <Icon
              color="dark200"
              icon="person"
              size="large"
              type="filled"
              className={boxStyle}
            />
          </Box>
        )}
      </Box>
      {bulletsView && <Bullets application={application} />}
    </Box>
  )
}

export default Photo
