import React from 'react'
import Link from './Link'
import _ArrowLink from './ArrowLink/ArrowLink'
import _ExternalLink from './ExternalLink/ExternalLink'
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

export const DefaultBlue = () => (
  <Box padding={4}>
    <Link href="/something" color="blue400">
      Default
    </Link>
  </Box>
)

export const ArrowLink = () => (
  <Box padding={4}>
    <_ArrowLink href="/something">Arrow link</_ArrowLink>
  </Box>
)

export const ExternalLink = () => (
  <Box background="blue400" padding={4}>
    <_ExternalLink href="https://external.is">External link</_ExternalLink>
  </Box>
)

export const ExternalLinkBlue = () => (
  <Box padding={4}>
    <_ExternalLink href="https://external.is" color="blue400">
      External link
    </_ExternalLink>
  </Box>
)
