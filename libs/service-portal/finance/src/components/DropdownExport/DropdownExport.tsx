import React, { FC, ReactElement } from 'react'
import { Box, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import * as styles from './DropdownExport.css'
import DisabledItem from './DisabledItem'

interface Props {
  onGetCSV: () => void
  onGetExcel: () => void
  dropdownItems?: {
    onClick?: () => void
    title: string
    render?: (
      element: ReactElement,
      index: number,
      className: string,
    ) => ReactElement
  }[]
}
const DropdownExport: FC<Props> = ({
  onGetCSV,
  onGetExcel,
  dropdownItems = [],
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box className={styles.buttonWrapper}>
      <DropdownMenu
        icon="ellipsisHorizontal"
        menuLabel={formatMessage(m.moreOptions)}
        items={[
          {
            onClick: () => onGetCSV(),
            title: formatMessage(m.getAsCsv),
          },
          {
            onClick: () => onGetExcel(),
            title: formatMessage(m.getAsExcel),
          },
          ...dropdownItems,
        ]}
        title={formatMessage(m.more)}
      />
    </Box>
  )
}

export default DropdownExport
