import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

import * as styles from './ApplicationName.treat'

const ApplicationName: FC<{ name: string }> = ({ name }) => (
  <Box
    paddingTop={[2, 2, 4]}
    paddingBottom={[2, 2, 4]}
    paddingLeft={[3, 3, 5]}
    className={styles.root}
  >
    <Typography variant="h4">{name}</Typography>
  </Box>
)

export default ApplicationName
