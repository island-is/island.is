import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { DatePicker } from './DatePicker'

export default {
  title: 'Form/DatePicker',
  component: DatePicker,
}
const Template = (args) => <DatePicker {...args} />

export const Primary = Template.bind({})
Primary.args = {
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
export const LocalePL = () => {
  return (
    <Wrap>
      <DatePicker
        label="Data"
        placeholderText="Wybierz datę"
        locale="pl"
        handleChange={(date: Date) => console.log(date)}
      />
    </Wrap>
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
