import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

import * as styles from './ApplicationName.treat'

const ApplicationName: FC<{ name: string }> = ({ name }) => (
  <Box paddingTop={4} paddingBottom={4} paddingLeft={5} className={styles.root}>
    <Typography variant="h4">{name}</Typography>
  </Box>
)

export default ApplicationName
