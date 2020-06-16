import React, { FC, useState, useEffect } from 'react'
import { AsyncSearch } from './AsyncSearch'
import { Stack, Box } from '../..'
import { boolean } from '@storybook/addon-knobs'

export default {
  title: 'Components/AsyncSearch',
  component: AsyncSearch,
}

const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
  { label: 'Banana', value: 'banana' },
  { label: 'Fæðingarorlof', value: 'faedingarorlof' },
  { label: 'Atvinna', value: 'atvinna' },
  { label: 'Ferðagjöf', value: 'ferdagjof' },
  { label: 'Vottorð', value: 'vottord' },
]

let timer = null

export const Basic: FC = () => {
  const [options, setOptions] = useState([])
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)

  const simulateAsync = boolean('Simulate async', false)
  const colored = boolean('Colored', false)
  const large = boolean('Large', false)

  const update = (value) => {
    const newOpts = items.filter((item) => {
      return (
        value === '' || item.label.toLowerCase().includes(value.toLowerCase())
      )
    })

    setLoading(false)

    if (!value) {
      setOptions([])
      return false
    }

    setOptions(newOpts)
  }

  useEffect(() => {
    if (value !== null) {
      if (simulateAsync) {
        clearTimeout(timer)
        setLoading(true)
        timer = setTimeout(() => update(value), 600)
      } else {
        update(value)
      }
    }
  }, [value, simulateAsync])

  return (
    <Box padding={2}>
      <Stack space={2}>
        <AsyncSearch
          options={options}
          colored={colored}
          size={large ? 'large' : 'medium'}
          placeholder="Type in something"
          onInputValueChange={(inputValue) => setValue(inputValue)}
          loading={loading}
        />
      </Stack>
    </Box>
  )
}
