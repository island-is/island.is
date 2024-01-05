import React, { FC, ReactElement } from 'react'
import { Box, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './DropdownExport.css'
import { vehicleMessage as messages } from '../../lib/messages'

interface Props {
  onGetPDF: () => void
  onGetExcel: () => void
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
const DropdownExport: FC<React.PropsWithChildren<Props>> = ({
  onGetExcel,
  onGetPDF,
  dropdownItems = [],
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box className={styles.buttonWrapper}>
      <DropdownMenu
        icon="ellipsisHorizontal"
        menuLabel={formatMessage(messages.myCarsFiles)}
        items={[
          {
            onClick: () => onGetPDF(),
            title: formatMessage(messages.myCarsFilesPDF),
          },

          {
            onClick: () => onGetExcel(),
            title: formatMessage(messages.myCarsFilesExcel),
          },
          ...dropdownItems,
        ]}
        title={formatMessage(messages.myCarsFiles)}
      />
    </Box>
  )
}

export default DropdownExport
