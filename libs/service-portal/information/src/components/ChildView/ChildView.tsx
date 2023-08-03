import { Box } from '@island.is/island-ui/core'

import * as styles from './ChildView.css'
import { FC } from 'react'

interface Props {
  children: Array<React.ReactElement>
}

export const ChildView: FC<Props> = ({ children }) => (
  <Box className={styles.pageWrapper}>{children}</Box>
)
