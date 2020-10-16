import React from 'react'
import { ProgressMeter } from './ProgressMeter'
import { useToggle } from 'react-use'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'

export default {
  title: 'Components/ProgressMeter',
  component: ProgressMeter,
}

export const Default = () => {
  return <ProgressMeter progress={0.5} />
}

export const RedColorScheme = () => {
  return <ProgressMeter progress={0.4} colorScheme="red" />
}

export const RoseColorScheme = () => {
  return <ProgressMeter progress={0.3} colorScheme="rose" />
}

export const AnimatesOnChange = () => {
  const [on, toggle] = useToggle(true)
  return (
    <Stack space="gutter">
      <Button onClick={toggle} variant="text">
        Change progress
      </Button>
      <ProgressMeter progress={on ? 0.01 : 1} />
    </Stack>
  )
}
