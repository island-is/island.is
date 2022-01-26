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
  labelIS: string
  labelEN: string
  transition: string
  optionSlug: string
}

interface StepOptionsFromSourceTransitionCMS {
  criteria: Record<string, string | boolean | number>
  criteriaExclude?: Record<string, string | boolean | number>
  priority?: number
  transition: string
}

interface StepOptionsFromSourceCMS {
  sourceNamespace: string
  labelFieldIS: string
  labelFieldEN: string
  optionSlugField: string
  transitions: StepOptionsFromSourceTransitionCMS[]
}

interface StepConfig {
  options: StepOptionCMS[]
  optionsFromSource?: StepOptionsFromSourceCMS
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

const validateStepperConfig = (stepper: Stepper) => {
  const errors: Set<string> = new Set<string>()

  if (!stepper?.config) {
    errors.add('Missing config')
    return errors
  }

  let stepperConfig: StepperConfig

  try {
    stepperConfig = JSON.parse(stepper?.config) as StepperConfig
  } catch (error) {
    errors.add('Config could not be parsed')
    return errors
  }

  if (!stepperConfig?.xStateFSM) {
    errors.add('XStateFSM missing from config')
    return errors
  }

  let machine: StepperMachine

  try {
    machine = getStepperMachine(stepper)
  } catch (error) {
    errors.add('State machine could not be created')
    return errors
  }

  const stateNames = Object.keys(machine.states)

  for (const stateName of stateNames) {
    const state = machine.states[stateName]
    for (const transition of Object.keys(state?.config?.on ?? '{}')) {
      let transitionStateName
      try {
        transitionStateName = state.config.on[transition]
      } catch (error) {
        continue
      }
      if (!stateNames.includes(transitionStateName)) {
        errors.add(`State with name: "${transitionStateName}" does not exist`)
      }
    }
  }

  return errors
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

  if (stepConfig.optionsFromSource && optionsFromNamespace) {
    const stepOptions = optionsFromNamespace.find(
      (value) => value.slug === step.slug,
    )
    if (!stepOptions) return []
    return stepOptions.data.map((o) => {
      const {
        labelFieldEN,
        labelFieldIS,
        optionSlugField,
        transitions,
      } = stepConfig.optionsFromSource
      const label = lang === 'is' ? o[labelFieldIS] : o[labelFieldEN]
      let stepTransition = ''

      transitions.sort((a, b) => {
        if (!a.priority || !b.priority) return 0
        if (a.priority < b.priority) return -1
        return 1
      })

      for (const { criteria, transition, criteriaExclude } of transitions) {
        const everyCriteriaMatches = Object.keys(criteria).every(
          (key) => o[key] === criteria[key],
        )
        const everyExclusionCriteriaMatches =
          !criteriaExclude ||
          Object.keys(criteriaExclude).every(
            (key) => o[key] !== criteriaExclude[key],
          )

        if (everyCriteriaMatches && everyExclusionCriteriaMatches) {
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
        slug: o[optionSlugField],
      }
    })
  }

  return stepConfig.options.map((o) => {
    const label = lang === 'is' ? o.labelIS : o.labelEN
    return {
      label: label,
      transition: o.transition,
      slug: o.optionSlug,
    }
  })
}

const getStepOptionsSourceNamespace = (step: Step): string => {
  if (!step || step.config === '') return ''
  const stepConfig: StepConfig = JSON.parse(step.config) as StepConfig
  if (stepConfig.optionsFromSource)
    return stepConfig.optionsFromSource.sourceNamespace
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
  validateStepperConfig,
}
export type {
  StepperConfig,
  StateMeta,
  StepperState,
  StepOption,
  StepperMachine,
}
