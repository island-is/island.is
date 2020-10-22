import React, { FC } from 'react'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import * as styles from './Blockquote.treat'

export const Blockquote: FC = ({ children }) => (
  <Box
    display="flex"
    width="full"
    paddingY={3}
    paddingX={4}
    alignItems="center"
    background="purple100"
    className={styles.blockquote}
  >
    <Text variant="intro" as="span">
      {children}
    </Text>
  </Box>
)
