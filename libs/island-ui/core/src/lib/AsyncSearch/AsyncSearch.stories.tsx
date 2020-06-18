import React, { FC, useState, useEffect } from 'react'
import { AsyncSearch } from './AsyncSearch'
import { Stack, Box } from '../..'
import { boolean } from '@storybook/addon-knobs'
import Typography from '../Typography/Typography'
import { blue100 } from '../../theme/colors'

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

export const Features: FC = () => {
  const [options, setOptions] = useState(items)
  const [value, setValue] = useState('')
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

export const Basic: FC = () => {
  return (
    <Box padding={2}>
      <Stack space={2}>
        <AsyncSearch useFilter={true} options={items} />
      </Stack>
    </Box>
  )
}

export const CustomItem: FC = () => {
  const colored = boolean('Colored', false)
  const large = boolean('Large', false)

  const Container = ({ active, colored, children }) => {
    const activeColor = colored ? 'white' : 'blue100'
    const inactiveColor = colored ? 'blue100' : 'white'

    return (
      <Box
        display="flex"
        background={active ? activeColor : inactiveColor}
        flexDirection="column"
        padding={2}
        paddingY={3}
      >
        {children}
      </Box>
    )
  }

  const customItems = [
    { label: 'Apple', value: 'apple' },
    {
      label: 'Skráning nafns',
      value: 'skraning-nafns',
      component: (props) => (
        <Container {...props}>
          <Typography
            variant="eyebrow"
            as="span"
            color={props.active ? 'blue400' : 'dark400'}
          >
            Fjölskyldumál og velferð - Nafn og kyn
          </Typography>
          <Typography variant="intro" as="span">
            Skráning nafns
          </Typography>
        </Container>
      ),
    },
    {
      label: 'Nafnbreyting',
      value: 'nafnbreyting',
      component: (props) => (
        <Container {...props}>
          <Typography
            variant="eyebrow"
            as="span"
            color={props.active ? 'blue400' : 'dark400'}
          >
            Fjölskyldumál og velferð - Nafn og kyn
          </Typography>
          <Typography variant="intro" as="span">
            Nafnbreyting
          </Typography>
        </Container>
      ),
    },
    {
      label: 'Breytt ritun nafns',
      value: 'breytt-ritun-nafns',
      component: (props) => (
        <Container {...props}>
          <Typography
            variant="eyebrow"
            as="span"
            color={props.active ? 'blue400' : 'dark400'}
          >
            Fjölskyldumál og velferð - Nafn og kyn
          </Typography>
          <Typography variant="intro" as="span">
            Breytt ritun nafns
          </Typography>
        </Container>
      ),
    },
    { label: 'Orange', value: 'orange' },
  ]

  return (
    <Box padding={2}>
      <Stack space={2}>
        <AsyncSearch
          colored={colored}
          size={large ? 'large' : 'medium'}
          useFilter={true}
          options={customItems}
        />
      </Stack>
    </Box>
  )
}
