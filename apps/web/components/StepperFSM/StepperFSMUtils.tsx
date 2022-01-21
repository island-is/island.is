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

interface StepOptionCMS {
  label_is: string
  label_en: string
  transition: string
  option_slug: string
}

interface StepOptionsFromSourceTransitionCMS {
  criteria: Record<string, boolean>
  transition: string
}

interface StepOptionsFromSourceCMS {
  source_namespace: string
  label_is_field: string
  label_en_field: string
  option_slug_field: string
  transitions: StepOptionsFromSourceTransitionCMS[]
}

interface StepConfig {
  options: StepOptionCMS[]
  options_from_source?: StepOptionsFromSourceCMS
}

interface StepOption {
  label: string
  transition: string
  slug: string
}

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

const getCurrentStepAndStepType = (
  stepper: Stepper,
  currentState: StepperState,
) => {
  const currentStep = getCurrentStep(stepper, currentState)
  return {
    currentStep: currentStep,
    currentStepType: resolveStepType(currentStep),
  }
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
  if (!step) return null

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

const getStepOptions = (
  step: Step,
  lang = 'en',
  optionsFromNamespace: { slug: string; data: [] }[] = null,
): StepOption[] => {
  if (!step || step.config === '') return []
  const stepConfig: StepConfig = JSON.parse(step.config) as StepConfig

  if (stepConfig.options_from_source && optionsFromNamespace) {
    const stepOptions = optionsFromNamespace.find(
      (value) => value.slug === step.slug,
    )
    if (!stepOptions) return []
    return stepOptions.data.map((o) => {
      const {
        label_en_field,
        label_is_field,
        option_slug_field,
        transitions,
      } = stepConfig.options_from_source
      const label = lang === 'is' ? o[label_is_field] : o[label_en_field]
      let stepTransition = ''

      for (const { criteria, transition } of transitions) {
        if (Object.keys(criteria).every((key) => o[key] === criteria[key])) {
          if (stepTransition !== '') {
            // TODO: there are two or more possible transitions, maybe do something here or leave it to the helper
          }
          stepTransition = transition
          break
        }
      }

      if (stepTransition === '') {
        // TODO: There is no transition, maybe do something here or leave it to the helper
      }

      return {
        label: label,
        transition: stepTransition,
        slug: o[option_slug_field],
      }
    })
  }

  return stepConfig.options.map((o) => {
    const label = lang === 'is' ? o.label_is : o.label_en
    return {
      label: label,
      transition: o.transition,
      slug: o.option_slug,
    }
  })
}

const getStepOptionsSourceNamespace = (step: Step): string => {
  if (!step || step.config === '') return ''
  const stepConfig: StepConfig = JSON.parse(step.config) as StepConfig
  if (stepConfig.options_from_source)
    return stepConfig.options_from_source.source_namespace
  return ''
}

const stepContainsQuestion = (step: Step) => {
  return (
    step.subtitle &&
    step.subtitle.length > 0 &&
    step.subtitle[0].__typename === 'Html' &&
    step.subtitle[0].document.content.length > 0 &&
    step.subtitle[0].document.content[0].content &&
    step.subtitle[0].document.content[0].content.length > 0
  )
}

const getStepQuestion = (step: Step) => {
  if (stepContainsQuestion(step)) {
    return step.subtitle[0].document.content[0].content[0].value
  }
  return ''
}

export { STEP_TYPES }
export {
  getStepBySlug,
  getCurrentStep,
  getStateMeta,
  getStepperMachine,
  resolveStepType,
  getStepOptions,
  getStepQuestion,
  getStepOptionsSourceNamespace,
  getCurrentStepAndStepType,
}
export type {
  StepperConfig,
  StateMeta,
  StepperState,
  StepOption,
  StepperMachine,
}
