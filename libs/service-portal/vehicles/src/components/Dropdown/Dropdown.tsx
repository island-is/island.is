import React, { FC, ReactElement } from 'react'
import { Box, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './Dropdown.css'
import { messages } from '../../lib/messages'

interface Props {
  dropdownItems?: {
    href?: string
    onClick?: () => void
    title: string
    render?: (
      element: ReactElement,
      index: number,
      className: string,
    ) => ReactElement
  }[]
}
const Dropdown: FC<React.PropsWithChildren<Props>> = ({
  dropdownItems = [],
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box className={styles.buttonWrapper}>
      <DropdownMenu
        menuClassName={styles.container}
        icon="ellipsisHorizontal"
        menuLabel={formatMessage(messages.more)}
        items={dropdownItems}
        title={formatMessage(messages.more)}
      />
    </Box>
  )
}

export default Dropdown
