import React, { ReactNode } from 'react'
import { Box, Icon, Link, Text } from '@island.is/island-ui/core'
import * as styles from './ReadOnlyWithLinks.css'

interface ReadonlyWithLinkProps {
  input: ReactNode
  link: string
  linkTitle: string
}

export const ReadOnlyWithLinks = ({
  input,
  link,
  linkTitle,
}: ReadonlyWithLinkProps) => (
  <Box
    display="flex"
    width="full"
    flexDirection={['column', 'column', 'column', 'row']}
    columnGap={3}
    rowGap={2}
  >
    {input}
    <Link
      href={link}
      underlineVisibility="always"
      underline="small"
      color="blue400"
      className={styles.linkContainer}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        columnGap="smallGutter"
      >
        <Text variant="eyebrow" color="blue400">
          {linkTitle}
        </Text>
        <Icon icon="open" type="outline" color="currentColor" size="small" />
      </Box>
    </Link>
  </Box>
)
