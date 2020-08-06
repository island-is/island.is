import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

import * as styles from './ApplicationName.treat'

const ApplicationName: FC<{ name: string; icon?: string }> = ({
  name,
  icon,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      paddingTop={4}
      paddingBottom={4}
      paddingLeft={5}
      className={styles.root}
    >
      {icon && <img src={icon} />}
      <Box marginLeft={icon ? 1 : 0}>
        <Typography variant="h4">{name}</Typography>
      </Box>
    </Box>
  )
}

export default ApplicationName
