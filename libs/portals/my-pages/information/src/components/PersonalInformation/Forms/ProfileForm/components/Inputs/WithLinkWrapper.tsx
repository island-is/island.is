import React, { ReactNode } from 'react'
import { Box, Icon, LinkV2 as Link, Text } from '@island.is/island-ui/core'
import * as styles from './WithLinkWrapper.css'

interface WithLinkWrapperProps {
  input: ReactNode
  link: {
    href: string
    title: string
  }
}

export const WithLinkWrapper = ({ input, link }: WithLinkWrapperProps) => (
  <Box
    display="flex"
    width="full"
    flexDirection={['column', 'column', 'column', 'row']}
    columnGap={3}
    rowGap={2}
  >
    {input}
    <Link
      href={link.href}
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
          {link.title}
        </Text>
        <Icon icon="open" type="outline" color="currentColor" size="small" />
      </Box>
    </Link>
  </Box>
)
