import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'

export interface ImageProps {
  url: string
}

export const Audio: FC<ImageProps> = ({ url }) => {
  return (
    <Box>
      <audio>
        <source src={url} type="audio/mp3">
          Your browser does not support the audio element.
        </source>
      </audio>
    </Box>
  )
}

export default Audio
