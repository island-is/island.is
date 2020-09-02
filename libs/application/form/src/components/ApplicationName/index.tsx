import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

import SectionNumberColumn from '../SectionNumberColumn'

import * as styles from './ApplicationName.treat'

const ApplicationName: FC<{ name: string; icon?: string }> = ({
  name,
  icon,
}) => {
  return (
    <Box display="flex" alignItems="center" className={styles.root}>
      <SectionNumberColumn />
      {icon && <img src={icon} alt="application-icon" />}
      <Box marginLeft={icon ? 1 : 0}>
        <Typography variant="h4">{name}</Typography>
      </Box>
    </Box>
  )
}

export default ApplicationName
