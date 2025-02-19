import React, { FC, ReactElement } from 'react'
import { Box, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './Dropdown.css'
import { vehicleMessage as messages } from '../../lib/messages'

interface Props {
  label?: string
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
  label,
  dropdownItems = [],
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box className={styles.buttonWrapper}>
      <DropdownMenu
        menuClassName={styles.container}
        icon="ellipsisHorizontal"
        menuLabel={label ?? formatMessage(messages.more)}
        items={dropdownItems}
        title={label ?? formatMessage(messages.more)}
      />
    </Box>
  )
}

export default Dropdown
