import React, { FC } from 'react'
import { Box, DropdownMenu } from '@island.is/island-ui/core'
import * as styles from './DropdownExport.treat'

interface Props {
  onGetCSV: () => void
  onGetExcel: () => void
  dropdownItems?: {
    onClick?: () => void
    title: string
  }[]
}

const DropdownExport: FC<Props> = ({
  onGetCSV,
  onGetExcel,
  dropdownItems = [],
}) => {
  return (
    <Box className={styles.buttonWrapper}>
      <DropdownMenu
        icon="ellipsisHorizontal"
        menuLabel="Fleiri möguleikar"
        items={[
          {
            onClick: () => onGetCSV(),
            title: 'Sækja sem CSV',
          },
          {
            onClick: () => onGetExcel(),
            title: 'Sækja sem Excel',
          },
          ...dropdownItems,
        ]}
        title="Meira"
      />
    </Box>
  )
}

export default DropdownExport
