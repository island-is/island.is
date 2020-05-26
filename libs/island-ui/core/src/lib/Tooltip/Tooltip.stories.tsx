import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { Tooltip } from './Tooltip'
import { Inline } from '../Inline/Inline'
import { Box } from '../Box/Box'
import Typography from '../Typography/Typography'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
}

const tooltipText =
  'Check out this cool tooltip. It has some text in it that you can read for more details.'

export const WithDefaultIcon = () => (
  <Box padding="gutter">
    <Typography variant="p" as="span">
      Here is some text that has a tooltip with the default icon at the end of
      it.{' '}
      <Tooltip
        colored={boolean('Colored', false)}
        placement="right"
        as="button"
        text={tooltipText}
      />
    </Typography>
  </Box>
)

export const WithChildren = () => (
  <>
    <Box padding="gutter">
      <Typography variant="p" as="span">
        Here is some text that has a tooltip wrapped around{' '}
        <Tooltip
          colored={boolean('Colored', false)}
          placement="top"
          as="span"
          text={tooltipText}
        >
          <span>this text</span>
        </Tooltip>
        .
      </Typography>
    </Box>
    <Box padding="gutter">
      <Inline space={1}>
        <Typography variant="p" as="span">
          Here is some text.
        </Typography>
        <Tooltip
          colored={boolean('Colored', false)}
          placement="bottom"
          text={tooltipText}
        />
      </Inline>
    </Box>
  </>
)
