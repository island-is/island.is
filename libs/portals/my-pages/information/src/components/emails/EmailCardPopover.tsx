import { Box } from '@island.is/island-ui/core'
import { PropsWithChildren } from 'react'
import { useIntl } from 'react-intl'
import { Popover } from '@ariakit/react'
import { emailsMsg } from '../../lib/messages'
import * as styles from './EmailCard/EmailCardPopover.css'

export const EmailCardPopover = ({ children }: PropsWithChildren) => {
  const { formatMessage } = useIntl()

  return (
    <Popover
      render={
        <Box
          background="white"
          borderRadius="large"
          className={styles.menu}
          borderColor="white"
          zIndex={10}
        />
      }
      aria-label={formatMessage(emailsMsg.emailCardPopover)}
    >
      {children}
    </Popover>
  )
}
