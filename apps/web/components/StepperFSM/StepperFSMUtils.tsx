import {
  AnyEventObject,
  Machine,
  MachineConfig,
  State,
  StateMachine,
} from 'xstate'

import { Step, Stepper } from '@island.is/api/schema'

// TODO: Look into disabling no-explicit-any for next N Lines
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepperState = State<
  any,
  AnyEventObject,
  any,
  { value: any; context: any }
>

// TODO: Look into disabling no-explicit-any for next N Lines
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepperMachine = StateMachine<
  any,
  any,
  AnyEventObject,
  { value: any; context: any }
>

interface StepperConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xStateFSM: MachineConfig<any, any, AnyEventObject>
}

interface StateMeta {
  stepSlug: string
}

interface StepperConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xStateFSM: MachineConfig<any, any, AnyEventObject>
}

interface StateMeta {
  stepSlug: string
}

const getStepBySlug = (stepper: Stepper, slug: string): Step => {
  return stepper.steps.find((step) => step.slug === slug)
}

// The following code discards the state node ID keys and merges the meta data, as
// demonstrated in the documentation, see https://xstate.js.org/docs/guides/states.html#state-meta-data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mergeMeta(meta: any) {
  return Object.keys(meta).reduce((acc, key) => {
    const value = meta[key]

    // Assuming each meta value is an object
    Object.assign(acc, value)

    return acc
  }, {})
}

const getStateMeta = (state: StepperState): StateMeta => {
  return mergeMeta(state.meta) as StateMeta
}

const getCurrentStep = (stepper: Stepper, currentState: StepperState): Step => {
  return getStepBySlug(stepper, getStateMeta(currentState).stepSlug)
}

const getStepperMachine = (stepper: Stepper): StepperMachine => {
  const stepperConfig: StepperConfig = JSON.parse(
    stepper.config,
  ) as StepperConfig
  return Machine(stepperConfig.xStateFSM)
}

const STEP_TYPES = {
  QUESTION_RADIO: 'question-radio',
  QUESTION_DROPDOWN: 'question-dropdown',
  ANSWER: 'answer',
}

const resolveStepType = (step: Step): string => {
  if (
    step.stepType &&
    step.stepType.toLowerCase().includes('question') &&
    step.stepType.toLowerCase().includes('radio')
  ) {
    return STEP_TYPES.QUESTION_RADIO
  }
  if (
    step.stepType &&
    step.stepType.toLowerCase().includes('question') &&
    step.stepType.toLowerCase().includes('dropdown')
  ) {
    return STEP_TYPES.QUESTION_DROPDOWN
  }
  if (step.stepType && step.stepType.toLowerCase().includes('answer')) {
    return STEP_TYPES.ANSWER
  }
  return null
}

export { STEP_TYPES }
export {
  getStepBySlug,
  getCurrentStep,
  getStateMeta,
  getStepperMachine,
  resolveStepType,
}
export type { StepperConfig, StateMeta, StepperState }
