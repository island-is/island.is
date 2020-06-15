import React, { FC, useState, useEffect } from 'react'
import { AsyncSearch } from './AsyncSearch'
import { Stack, Box } from '../..'

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
  { label: 'Apple', value: 'apple2' },
  { label: 'Pear', value: 'pear2' },
  { label: 'Orange', value: 'orange3' },
  { label: 'Grape', value: 'grape4' },
  { label: 'Banana', value: 'banana5' },
]

export const Basic = () => {
  return (
    <Box padding={2}>
      <Stack space={2}>
        <AsyncSearch
          options={items}
          label="Normal size"
          placeholder="Here is a placeholder"
        />
        <AsyncSearch
          options={items}
          colored
          label="Large size"
          size="large"
          placeholder="Here is a placeholder"
        />
        <AsyncSearch
          options={items}
          colored
          placeholder="Here is a placeholder"
        />
        <AsyncSearch
          options={items}
          colored
          size="large"
          placeholder="Here is a placeholder"
        />
        <AsyncSearch
          options={items}
          colored
          size="large"
          placeholder="This one is loading"
          onChange={(selection) => {
            console.log('selection:', selection)
          }}
          loading
        />
      </Stack>
    </Box>
  )
}

let timer = null

export const Async: FC = () => {
  const [options, setOptions] = useState([])
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

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
    clearTimeout(timer)
    setLoading(true)
    timer = setTimeout(() => update(value), 600)
  }, [value])

  return (
    <Box padding={2}>
      <Stack space={2}>
        <AsyncSearch
          options={options}
          colored
          size="large"
          placeholder="This one is loading"
          onInputValueChange={(inputValue) => setValue(inputValue)}
          loading={loading}
        />
      </Stack>
    </Box>
  )
}
