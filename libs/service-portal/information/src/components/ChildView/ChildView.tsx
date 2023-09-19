import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'

import * as styles from './ChildView.css'

interface Props {
  children: Array<React.ReactElement>
}

export const ChildView: FC<React.PropsWithChildren<Props>> = ({ children }) => (
  <Box className={styles.pageWrapper}>{children}</Box>
)
