import React from 'react'
import Link from './Link'
import ArrowLinkComponent from './ArrowLink/ArrowLink'
import { Box } from '../Box'

export default {
  title: 'Core/Link',
  component: Link,
}

export const Default = () => (
  <Box padding={4}>
    <Link href="/something">Default</Link>
  </Box>
)

export const DefaulUnderline = () => (
  <Box padding={4}>
    <Link href="/something" color="blue400" withUnderline>
      Default
    </Link>
  </Box>
)

export const DefaultBlue = () => (
  <Box padding={4}>
    <Link href="/something" color="blue400">
      Default
    </Link>
  </Box>
)

export const ArrowLink = () => (
  <Box padding={4}>
    <ArrowLinkComponent href="/something">Arrow link</ArrowLinkComponent>
  </Box>
)
