import React from 'react'
import { Box } from '../Box'
import { ContentBlock } from '../ContentBlock'
import { DatePicker } from './DatePicker'

export default {
  title: 'Form/DatePicker',
  component: DatePicker,
}

const Wrap: React.FC = ({ children }) => (
  <Box padding={2}>
    <ContentBlock width="medium">{children}</ContentBlock>
  </Box>
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

export const Locales = () => {
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
      <Wrap>
        <DatePicker
          label="Data"
          placeholderText="Wybierz datę"
          locale="pl"
          handleChange={(date: Date) => console.log(date)}
        />
      </Wrap>
    </>
  )
}

export const MinimumDate = () => {
  return (
    <Box padding={2}>
      <ContentBlock width="medium">
        <DatePicker
          label="Minimum date is today"
          placeholderText="Pick a date"
          minDate={new Date()}
          handleChange={(date: Date) => console.log(date)}
        />
      </ContentBlock>
    </Box>
  )
}
