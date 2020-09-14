import React from 'react'
import Link from './Link'
import ArrowLinkComponent from './ArrowLink/ArrowLink'
import ExternalLinkComponent from './ExternalLink/ExternalLink'
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

export const ExternalLink = () => (
  <Box background="blue400" padding={4}>
    <ExternalLinkComponent href="https://external.is">
      External link
    </ExternalLinkComponent>
  </Box>
)

export const ExternalLinkBlue = () => (
  <Box padding={4}>
    <ExternalLinkComponent href="https://external.is" color="blue400">
      External link
    </ExternalLinkComponent>
  </Box>
)
