import React from 'react'
import { Machine } from 'xstate'
import { useMachine } from '@xstate/react'

import { Query } from '@island.is/web/graphql/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'

import * as style from './StepperFSM.css'

interface StepperConfig {
  xStateFSM: any
}

interface StepperProps {
  stepper: Query['getProjectPage']['stepper']
  startAgainLabel: string
  answerLabel: string
  backLabel: string
}

export const StepperFSM = ({ stepper }: StepperProps) => {
  const stepperMachine = Machine({
    id: 'toggle',
    initial: 'inactive',
    states: {
      inactive: { on: { TOGGLE: 'active' } },
      active: { on: { TOGGLE: 'inactive' } },
    },
  })
  // TODO: Remove @xstate/fsm dependency
  // TODO: Use machine config from Contentful
  // const stepperConfig : StepperConfig = JSON.parse(stepper.config) as StepperConfig
  const [currentState, send] = useMachine(stepperMachine)

  return (
    <Box className={style.container}>
      {stepper.config}
      <Text>Current state: {currentState.value}</Text>
      <Button
        onClick={() => {
          send('TOGGLE')
        }}
      >
        Toggle
      </Button>
    </Box>
  )
}
