import React from 'react'

import { withFigma } from '../../utils/withFigma'
import { DatePicker } from './DatePicker'
import { Text } from '../Text/Text'

export default {
  title: 'Form/DatePicker',
  component: DatePicker,
  parameters: withFigma('DatePicker'),
}

const Template = (args) => <DatePicker {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Dagsetning',
  placeholderText: 'Veldu dagsetningu',
  locale: 'is',
  required: true,
  handleChange: (date: Date) => console.log(date),
}

const Wrap: React.FC = ({ children }) => (
  <div style={{ height: 600 }}>{children}</div>
)

export const Basic = () => {
  return (
    <Wrap>
      <DatePicker
        label="Date"
        placeholderText="Pick a date"
        handleChange={(date: Date) => console.log(date)}
      />
    </Wrap>
  )
}

export const WithSelectedDate = () => (
  <>
    <Wrap>
      <DatePicker
        label="Date"
        placeholderText="Pick a date"
        selected={new Date()}
        handleChange={(date: Date) => console.log(date)}
      />
    </Wrap>
  </>
)

export const LocaleIS = () => {
  return (
    <>
      <Wrap>
        <DatePicker
          label="Dagsetning"
          placeholderText="Veldu dagsetningu"
          locale="is"
          handleChange={(date: Date) => console.log(date)}
        />
      </Wrap>
    </>
  )
}

export const SelectYear = () => {
  const toDay = new Date()
  return (
    <>
      <Wrap>
        <DatePicker
          label="Date"
          placeholderText="Pick a year"
          minYear={toDay.getFullYear() - 10}
          maxYear={toDay.getFullYear() + 2}
          handleChange={(date: Date) => console.log(date)}
        />
        <Text variant="small" marginTop={3}>
          Selecting a year will only work if <code>minYear</code> and{' '}
          <code>maxYear</code> are set and <code>maxYear</code> is higher then{' '}
          <code>minYear</code>
        </Text>
      </Wrap>
    </>
  )
}

export const MinimumDate = () => {
  return (
    <div style={{ height: 600 }}>
      <DatePicker
        label="Minimum date is today"
        placeholderText="Pick a date"
        minDate={new Date()}
        handleChange={(date: Date) => console.log(date)}
      />
    </div>
  )
}

export const BlueBackground = () => {
  return (
    <div style={{ height: 600 }}>
      <DatePicker
        label="Blue"
        placeholderText="Pick a date"
        backgroundColor="blue"
        handleChange={(date: Date) => console.log(date)}
      />
    </div>
  )
}

export const SizeSmall = () => {
  return (
    <div style={{ height: 600 }}>
      <DatePicker
        label="Small"
        placeholderText="Pick a date"
        size="sm"
        handleChange={(date: Date) => console.log(date)}
      />
    </div>
  )
}

export const WithErrors = () => (
  <>
    <Wrap>
      <DatePicker
        label="Date"
        placeholderText="Pick a date"
        selected={new Date()}
        hasError
        errorMessage="This date is somewhat incorrect"
        handleChange={(date: Date) => console.log(date)}
      />
    </Wrap>
  </>
)
