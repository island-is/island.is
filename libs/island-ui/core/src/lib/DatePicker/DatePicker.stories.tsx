import React from 'react'
import { withDesign } from 'storybook-addon-designs'

import { withFigma } from '../../utils/withFigma'
import { DatePicker } from './DatePicker'

export default {
  title: 'Form/DatePicker',
  component: DatePicker,
  decorators: [withDesign],
  parameters: withFigma({
    desktop:
      'https://www.figma.com/file/pDczqgdlWxgn3YugWZfe1v/UI-Library-%E2%80%93-%F0%9F%96%A5%EF%B8%8F-Desktop?node-id=50%3A155',
    mobile:
      'https://www.figma.com/file/rU3mPM1cLfHa3u7TWuutPQ/UI-Library-%E2%80%93-%F0%9F%93%B1Mobile?node-id=53%3A1536',
  }),
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

export const BlueBackground = () => {
  return (
    <div style={{ height: 600 }}>
      <DatePicker
        label="Blue"
        placeholderText="Pick a date"
        backgroundColor="white"
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
