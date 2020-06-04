import React from 'react'
import { Badge } from './Badge'
import { Button, Box } from '../..'

export default {
  title: 'Components/Badge',
  component: Badge,
}

export const Basic = () => {
  return (
    <Box padding={2}>
      <Badge number={3} />
    </Box>
  )
}

export const DoubleDigits = () => {
  return (
    <Box padding={2}>
      <Badge number={18} />
    </Box>
  )
}

export const Wrapper = () => {
  return (
    <Box padding={2}>
      <Badge number={18}>
        <Button variant="menu" icon="cheveron">
          Button here
        </Button>
      </Badge>
    </Box>
  )
}
