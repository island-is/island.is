import React, { PropsWithChildren, useState } from 'react'
import { ValueType } from 'react-select'
import { withFigma } from '../../utils/withFigma'
import { PhoneInput } from './PhoneInput'
import { Option } from '../Select/Select'

export default {
  title: 'Form/PhoneInput',
  component: PhoneInput,
  parameters: withFigma('PhoneInput'),
  argTypes: {
    label: { control: 'text', defaultValue: 'Phone' },
    placeholder: { control: 'text', defaultValue: 'This is the placeholder' },
    backgroundColor: {
      options: ['white', 'blue'],
      control: { type: 'radio' },
      defaultValue: 'white',
    },
  },
}

const Wrap = ({ children }: PropsWithChildren<{}>) => (
  <div style={{ height: 300 }}>{children}</div>
)

const countryCodeList = [
  {
    name: 'Iceland',
    format: '###-####',
    flag: '🇮🇸',
    code: 'IS',
    dial_code: '+354',
  },
  {
    name: 'Denmark',
    format: '## ## ## ##',
    flag: '🇩🇰',
    code: 'DK',
    dial_code: '+45',
  },
]

const countryCodes = countryCodeList.map((x) => ({
  label: `${x.name} ${x.dial_code}`,
  value: x.dial_code,
  description: x.flag,
}))

export const Template = (args) => {
  const [value, setValue] = useState('')
  const [selectedCountryCode, setSelectedCountryCode] = useState<
    ValueType<Option>
  >(countryCodes[0])

  const cc = (selectedCountryCode as Option).value.toString()

  const handleCountryCodeChange = (opt: ValueType<Option>) => {
    if (value && !value.startsWith('+')) {
      // Form value has no country code prefix, set it
      setValue(`${(opt as Option).value.toString()}${value}`)
    } else if (value?.startsWith(cc)) {
      // Update existing country code with updated value
      const updatedValue = value.replace(cc, (opt as Option).value.toString())
      setValue(updatedValue)
    }
    setSelectedCountryCode(opt)
  }

  return (
    <Wrap>
      <PhoneInput
        size="md"
        format={
          countryCodeList.find((x) => x.dial_code === cc && !!x.format)?.format
        }
        countryCodes={countryCodes}
        value={value?.replace(cc, '')}
        onChange={(e) => setValue(e.target.value)}
        countryCodeValue={selectedCountryCode}
        onCountryCodeChange={handleCountryCodeChange}
        label="Phone"
        name="Test1"
        {...args}
      />
    </Wrap>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Phone',
  placeholder: 'This is the placeholder',
  name: 'Test2',
}

export const Tooltip = Template.bind({})
Tooltip.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test3',
  tooltip:
    'Bacon ipsum dolor amet ball tip leberkas pork belly pork chop, meatloaf swine jerky doner andouille tenderloin',
}

export const Required = Template.bind({})
Required.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test4',
  required: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'This is the label',
  placeholder: 'This is the placeholder',
  name: 'Test5',
  disabled: true,
}

export const Error = Template.bind({})
Error.args = {
  label: 'Phone',
  placeholder: 'This is the placeholder',
  name: 'Test6',
  hasError: true,
  errorMessage: 'This is the error message',
}

export const ReadOnly = Template.bind({})
ReadOnly.args = {
  label: 'Read only label',
  placeholder: 'Read only',
  name: 'Test7',
  backgroundColor: 'blue',
  readOnly: true,
}

export const WithLabelAbove = Template.bind({})
WithLabelAbove.args = {
  label: 'Phone',
  placeholder: 'This is the placeholder',
  name: 'Test8',
  size: 'xs',
}
