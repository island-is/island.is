import { Box, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import copyToClipboard from 'copy-to-clipboard'
import { ReactNode, useState } from 'react'
import { m } from '../../lib/messages'
import { Tooltip } from '../Tooltip/Tooltip'

export interface CopyButtonProps {
  content: string
}

export const CopyButton = ({ content }: CopyButtonProps): ReactNode => {
  const { formatMessage } = useLocale()
  const [didCopy, setDidCopy] = useState(false)

  const copy = () => {
    copyToClipboard(content)
    setDidCopy(true)
  }

  return (
    <Tooltip
      text={didCopy ? formatMessage(m.copied) : formatMessage(m.copy)}
      onHide={() => setDidCopy(false)}
    >
      <Box
        cursor="pointer"
        marginLeft={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={copy}
      >
        <Icon icon="copy" type="outline" color="blue400" size="small" />
      </Box>
    </Tooltip>
  )
}
