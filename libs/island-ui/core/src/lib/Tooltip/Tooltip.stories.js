import { DescriptionFigma } from '../../utils/withFigma'
import { Inline } from '../Inline/Inline'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Tooltip } from './Tooltip'

const tooltipText =
  'Check out this cool tooltip. It has some text in it that you can read for more details.'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
}

export const Default = {
  render: () => (
    <Box padding="gutter">
      <Text variant="p" as="span">
        Here is some text that has a tooltip with the default icon at the end of
        it. <Tooltip placement="right" as="button" text={tooltipText} />
      </Text>
    </Box>
  ),

  name: 'Default',
}

export const WithChildren = {
  render: () => (
    <Box padding="gutter">
      <Text variant="p" as="span">
        Here is some text that has a tooltip wrapped around{' '}
        <Tooltip placement="top" as="span" text={tooltipText}>
          <span>this text</span>
        </Tooltip>
        .
      </Text>
    </Box>
  ),

  name: 'WithChildren',
}
