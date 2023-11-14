import React from 'react'
import { ArrowLink, Box, Input } from '@island.is/island-ui/core'
import * as styles from './ReadOnlyWithLinks.css'
interface ReadonlyWithLinkProps {
  title: string
  value: string
  verified: boolean
  link: string
  linkTitle: string
}
export function ReadOnlyWithLinks({
  title,
  value,
  verified,
  link,
  linkTitle,
}: ReadonlyWithLinkProps) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      flexDirection={['column', 'row']}
      alignItems={['flexStart', 'flexEnd']}
      justifyContent={['flexStart', 'flexStart']}
      columnGap={3}
      rowGap={1}
    >
      <Input
        name="email"
        placeholder={title}
        value={value}
        size="xs"
        label={title}
        icon={(verified && { name: 'checkmark' }) || undefined}
        readOnly
      />
      <Box className={styles.linkContainer}>
        <ArrowLink href={link} color="blue400">
          {linkTitle}
        </ArrowLink>
      </Box>
    </Box>
  )
}
