import React, { useState } from 'react'
import { InputSearch } from './InputSearch'
import { withDesign } from 'storybook-addon-designs'
import { Box } from 'reakit/ts'

export default {
  title: 'Core/InputSearch',
  component: InputSearch,
  decorators: [withDesign],
  argTypes: {
    onChange: { action: 'onClick' },
  },
}

const Template = (args) => <InputSearch {...args} />

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Type here to search...',
  id: 'input-id-1',
  loading: false,
  colored: false,
}

export const GetText = () => {
  const [searchString, setSearchString] = useState('')

  const onSearchChange = (inputValue: string) => {
    setSearchString(inputValue)
  }
  return (
    <div>
      <InputSearch
        id="input-id-2"
        placeholder="Search..."
        value={searchString}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <div>{searchString.length > 0 ? `You typed "${searchString}".` : ''}</div>
    </div>
  )
}
