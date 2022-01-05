import React from 'react'
import { Box, Icon } from '@island.is/island-ui/core'
import { Application, getValueViaPath } from '@island.is/application/core'
import Bullets from '../Bullets'
import { boxStyle } from '../styles.css'
import { GET_FILE_CONTENT_AS_BASE64 } from '@island.is/application/graphql'
import { useWatch } from 'react-hook-form'
import { useQuery } from '@apollo/client'

interface PhotoProps {
  application: Application
  bulletsView: boolean | undefined
}

const Photo = ({ application, bulletsView }: PhotoProps) => {
  const attachment = (application.attachments as unknown) as Array<{
    key: string
    name: string
  }>

  const attachmentLoaded = useWatch({
    name: 'attachments',
    defaultValue: attachment,
  })

  const attachments = getValueViaPath(
    application.answers,
    'attachments',
  ) as Array<{ key: string; name: string }>

  const answersAttachmentKey = attachments ? attachments[0].key : undefined

  const { data } = useQuery(GET_FILE_CONTENT_AS_BASE64, {
    skip: !attachmentLoaded[0]?.key && !answersAttachmentKey,
    variables: {
      input: {
        id: application.id,
        key: attachmentLoaded[0]?.key || answersAttachmentKey,
      },
    },
  })

  return (
    <Box display={['block', 'block', 'flex']}>
      <Box className={boxStyle}>
        {data ? (
          <img
            alt={''}
            src={'data:image/jpeg;' + data.getFileContentAsBase64.content || ''}
            id="myimage"
          />
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
