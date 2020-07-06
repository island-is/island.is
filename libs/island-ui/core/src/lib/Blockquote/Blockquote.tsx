import React, { FC } from 'react'
import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'

import * as styles from './Blockquote.treat'

export const Blockquote: FC = ({ children }) => {
  return (
    <Box
      display="flex"
      width="full"
      paddingY={3}
      paddingX={4}
      alignItems="center"
      background="purple100"
      className={styles.blockquote}
    >
      <Typography variant="intro" as="span">
        {children}
      </Typography>
    </Box>
  )
}

export default Blockquote
