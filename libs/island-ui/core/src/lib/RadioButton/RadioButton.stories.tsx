import React, { useState } from 'react'
import { RadioButton } from './RadioButton'
import { Box } from '../Box'
import { ContentBlock } from '../ContentBlock'
import { Stack } from '../Stack/Stack'

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
}

export const Default = () => {
  const [radioButton, setRadioButton] = useState('')
  return (
    <ContentBlock>
      <Box padding={[1, 2, 3]}>
        <Stack space={4}>
          <RadioButton
            name="RadioButton1"
            id="1"
            label="RadioButton label"
            value="1"
            onChange={({ target }) => {
              setRadioButton(target.value)
            }}
            checked={radioButton === '1'}
          />
          <RadioButton
            name="RadioButton1"
            id="2"
            label="RadioButton label"
            value="2"
            onChange={({ target }) => {
              setRadioButton(target.value)
            }}
            checked={radioButton === '2'}
          />
        </Stack>
      </Box>
    </ContentBlock>
  )
}

export const Checked = () => {
  return (
    <ContentBlock>
      <Box padding={[1, 2, 3]}>
        <RadioButton
          name="RadioButton2"
          label="This one is checked"
          onChange={() => {
            console.log('nope')
          }}
          checked
        />
      </Box>
    </ContentBlock>
  )
}
