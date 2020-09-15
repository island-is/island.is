import React, { useState } from 'react'
import { Checkbox } from './Checkbox'
import { Box } from '../Box'
import { ContentBlock } from '../ContentBlock'

export default {
  title: 'Core/Checkbox',
  component: Checkbox,
}

export const Default = () => {
  const [checkbox, setCheckbox] = useState(false)
  return (
    <ContentBlock>
      <Box padding={[1, 2, 3]}>
        <Checkbox
          name="checkbox1"
          label="Checkbox label"
          onChange={({ target }) => {
            setCheckbox(target.checked)
          }}
          checked={checkbox}
        />
      </Box>
    </ContentBlock>
  )
}

export const Checked = () => {
  return (
    <ContentBlock>
      <Box padding={[1, 2, 3]}>
        <Checkbox
          name="checkbox2"
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

export const Large = () => {
  const [checkbox, setCheckbox] = useState(false)

  return (
    <ContentBlock>
      <Box padding={[1, 2, 3]}>
        <Checkbox
          name="checkbox2"
          label="This one is checked"
          onChange={({ target }) => {
            setCheckbox(target.checked)
          }}
          checked={checkbox}
          large
        />
      </Box>
    </ContentBlock>
  )
}
