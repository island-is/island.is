import { DescriptionFigma } from '../../utils/withFigma'
import { Box } from '../Box/Box'
import { LinkV2 } from './LinkV2'
import { ArrowLink } from './ArrowLink/ArrowLink'

export default {
  title: 'Core/LinkV2',
  component: LinkV2,
}

export const Default = {
  render: () => (
    <Box padding={4}>
      <LinkV2 href="/something">Default</LinkV2>
    </Box>
  ),

  name: 'Default',
}

export const UnderlineAlwaysVisible = {
  render: () => (
    <Box padding={4}>
      <LinkV2
        href="/something"
        color="blue400"
        underline="normal"
        underlineVisibility="always"
      >
        With underline always visible
      </LinkV2>
    </Box>
  ),

  name: 'UnderlineAlwaysVisible',
}

export const SmallUnderline = {
  render: () => (
    <Box padding={4}>
      <LinkV2 href="/something" color="blue400" underline="small">
        With small underline
      </LinkV2>
    </Box>
  ),

  name: 'SmallUnderline',
}

export const ArrowLinkStory = {
  render: () => (
    <Box padding={4}>
      <ArrowLink href="/something">Arrow link</ArrowLink>
    </Box>
  ),

  name: 'ArrowLink',
}
