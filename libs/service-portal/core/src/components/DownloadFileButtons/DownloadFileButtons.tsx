import React from 'react'
import { Box, Button, BoxProps } from '@island.is/island-ui/core'

type DownloadButton = {
  text: string
  onClick?: () => void
}

interface Props {
  buttons?: DownloadButton[]
  BoxProps?: BoxProps
}

const DlButton = ({ text, onClick }: DownloadButton) => {
  return (
    <Button
      colorScheme="default"
      icon="arrowForward"
      iconType="filled"
      onClick={onClick}
      preTextIconType="filled"
      size="small"
      type="button"
      variant="text"
    >
      {text}
    </Button>
  )
}

export const DownloadFileButtons = ({ buttons, BoxProps }: Props) => {
  if (buttons) {
    return (
      <Box {...BoxProps}>
        {buttons.map((item, i) => (
          <React.Fragment key={item.text}>
            {i !== 0 && <Box display="inlineFlex" marginLeft={2} />}
            <DlButton {...item} />
          </React.Fragment>
        ))}
      </Box>
    )
  }
}

export default DownloadFileButtons
