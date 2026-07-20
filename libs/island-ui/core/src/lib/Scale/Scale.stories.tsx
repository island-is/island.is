import React, { useEffect, useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { withFigma } from '../../utils/withFigma'
import { Scale, type ScaleProps } from './Scale'

const config: Meta<typeof Scale> = {
  title: 'Form/Scale',
  component: Scale,
  parameters: withFigma('Scale'),
  argTypes: {
    id: { description: 'Scale field id', control: { type: 'text' } },
    label: { description: 'Label text', control: { type: 'text' } },
    min: { description: 'Minimum selectable value', control: { type: 'number' } },
    max: { description: 'Maximum selectable value', control: { type: 'number' } },
    value: { description: 'Selected value', control: { type: 'text' } },
    step: { description: 'Step interval between values', control: { type: 'number' } },
    minLabel: { description: 'Text shown below minimum value', control: { type: 'text' } },
    maxLabel: { description: 'Text shown below maximum value', control: { type: 'text' } },
    showLabels: { description: 'Show min and max labels', control: { type: 'boolean' } },
    required: { description: 'Is the field required', control: { type: 'boolean' } },
    disabled: { description: 'Is the field disabled', control: { type: 'boolean' } },
    error: { description: 'Error message', control: { type: 'text' } },
    onChange: { table: { disable: true } },
  },
}

export default config

type ScaleStory = StoryObj<typeof Scale>

const InteractiveScale = (args: ScaleProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null | undefined>(
    args.value,
  )

  useEffect(() => {
    setSelectedValue(args.value)
  }, [args.value])

  return (
    <Scale
      {...args}
      value={selectedValue}
      onChange={(nextValue) => {
        setSelectedValue(nextValue)
      }}
    />
  )
}

export const Default: ScaleStory = {
  render: (args) => <InteractiveScale {...args} />,
  args: {
    id: 'scale-default',
    label: 'How satisfied are you with the service?',
    min: 1,
    max: 10,
    step: 1,
    minLabel: 'Not satisfied',
    maxLabel: 'Very satisfied',
    showLabels: true,
    required: false,
    disabled: false,
    value: undefined,
    error: undefined,
  },
}

export const Required: ScaleStory = {
  ...Default,
  args: {
    ...Default.args,
    required: true,
  },
}

export const Disabled: ScaleStory = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
    value: '7',
  },
}

export const WithError: ScaleStory = {
  ...Default,
  args: {
    ...Default.args,
    error: 'Please select a value before continuing',
  },
}

export const WithoutEdgeLabels: ScaleStory = {
  ...Default,
  args: {
    ...Default.args,
    showLabels: false,
    minLabel: undefined,
    maxLabel: undefined,
  },
}

export const CustomStep: ScaleStory = {
  ...Default,
  args: {
    ...Default.args,
    min: 0,
    max: 100,
    step: 10,
    minLabel: '0%',
    maxLabel: '100%',
  },
}