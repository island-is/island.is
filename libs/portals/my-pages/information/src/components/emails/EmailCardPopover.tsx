import { Box } from '@island.is/island-ui/core'
import { PropsWithChildren } from 'react'
import { useIntl } from 'react-intl'
import { PopoverStateReturn, Popover as ReakitPopover } from 'reakit/Popover'
import { msg } from '../../lib/messages'

type PopoverProps = PropsWithChildren<PopoverStateReturn>

export const EmailCardPopover = ({
  children,
  ...popoverState
}: PopoverProps) => {
  const { formatMessage } = useIntl()

  return (
    <Box
      component={ReakitPopover}
      background="white"
      borderRadius="large"
      boxShadow="large"
      aria-label={formatMessage(msg.emailCardPopover)}
      borderColor="white"
      zIndex={10}
      {...popoverState}
    >
      {children}
    </Box>
  )
}
