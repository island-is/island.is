import React, { FC } from 'react'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import * as styles from './Blockquote.css'

export const Blockquote: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => (
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
