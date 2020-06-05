import React from 'react'
import { Badge } from './Badge'
import { Button, Box, Stack } from '../..'

import avatarImage from '../../assets/avatar.jpg'

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
      <Stack space={2}>
        <Badge number={5}>
          <Button variant="menu" leftImage={avatarImage} icon="cheveron">
            Button here
          </Button>
        </Badge>
        <Badge number={12}>
          <Button size="large" icon="caret">
            Button here
          </Button>
        </Badge>
        <Badge number={38}>
          <Button variant="ghost" icon="arrow">
            Button here
          </Button>
        </Badge>
      </Stack>
    </Box>
  )
}
