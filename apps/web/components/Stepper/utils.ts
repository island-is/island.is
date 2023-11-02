import {
  AnyEventObject,
  Machine,
  MachineConfig,
  State,
  StateMachine,
} from 'xstate'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { Step, Stepper } from '@island.is/web/graphql/schema'
import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

const sourceNamespacesThatNeedToBeSorted = ['Countries']

/* eslint-disable @typescript-eslint/no-explicit-any */
type StepperState = State<
  any,
  AnyEventObject,
  any,
  { value: any; context: any }
>

type StepperMachine = StateMachine<
  any,
  any,
  AnyEventObject,
  { value: any; context: any }
>

interface StepperConfig {
  xStateFSM: MachineConfig<any, any, AnyEventObject>
}

interface StepperConfig {
  xStateFSM: MachineConfig<any, any, AnyEventObject>
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
  value: string
}

interface StateMeta {
  stepSlug: string
}

interface StateMeta {
  stepSlug: string
}

const getStepBySlug = (stepper: Stepper, slug: string): Step | undefined => {
  return stepper.steps?.find((step) => step.slug === slug)
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

const getCurrentStep = (
  stepper: Stepper,
  currentState: StepperState,
): Step | undefined => {
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

  if (!stepperConfig?.xStateFSM?.states) {
    errors.add('States missing from config')
    return errors
  }

  if (!stepperConfig?.xStateFSM?.initial) {
    errors.add('Initial state missing from config')
    return errors
  }

  if (
    !stepperConfig?.xStateFSM?.states?.[
      stepperConfig?.xStateFSM?.initial as string
    ]
  ) {
    errors.add('Initial state missing from states object in config')
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
    const transitionsConfig =
      (state?.config?.on as Record<string, string>) || {}

    for (const transition of Object.keys(transitionsConfig)) {
      const transitionStateName = transitionsConfig[transition]

      if (!stateNames.includes(transitionStateName)) {
        errors.add(`State with name: "${transitionStateName}" does not exist`)
      }
    }
  }

  return errors
}

const validateStepConfig = (step: Step) => {
  const errors: Set<string> = new Set<string>()

  if (resolveStepType(step) === STEP_TYPES.ANSWER) return errors

  if (!step.config) {
    errors.add('Missing config!')
    return errors
  }

  let stepConfig: StepConfig

  try {
    stepConfig = JSON.parse(step?.config) as StepConfig
  } catch (error) {
    errors.add('Config could not be parsed')
    return errors
  }

  if (!stepConfig.options && !stepConfig.optionsFromSource) {
    errors.add('Neither options nor optionsFromSource provided')
    return errors
  }

  if (stepConfig.optionsFromSource) {
    const expectedFields: (keyof StepOptionsFromSourceCMS)[] = [
      'labelFieldEN',
      'labelFieldIS',
      'sourceNamespace',
      'transitions',
    ]
    for (const field of expectedFields)
      if (!stepConfig.optionsFromSource[field])
        errors.add(`optionsFromSource is missing a "${field}" field`)

    if (errors.size > 0) return errors

    for (const transition of stepConfig.optionsFromSource.transitions) {
      if (!transition.criteria && !transition.criteriaExclude)
        errors.add('Not all transitions have a criteria')
      if (!transition.transition)
        errors.add('Not all transitions have a "transition" field')
      if (errors.size > 0) return errors
    }
  } else if (stepConfig.options) {
    for (const option of stepConfig.options) {
      const expectedFields: (keyof StepOptionCMS)[] = [
        'labelEN',
        'labelIS',
        'transition',
        'optionSlug',
      ]
      for (const field of expectedFields)
        if (!option[field])
          errors.add(`Not all options have a "${field}" field`)
    }
  }

  return errors
}

const getStepperMachine = (stepper: Stepper): StepperMachine => {
  const stepperConfig: StepperConfig = JSON.parse(
    stepper.config ? stepper.config : '',
  ) as StepperConfig
  return Machine(stepperConfig.xStateFSM)
}

const STEP_TYPES = {
  QUESTION_RADIO: 'question-radio',
  QUESTION_DROPDOWN: 'question-dropdown',
  ANSWER: 'answer',
}

const resolveStepType = (step: Step | undefined): string => {
  if (!step) return ''

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
  return ''
}

const getStepOptions = (
  step: Step,
  lang = 'en',
  optionsFromNamespace: {
    slug: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>[]
  }[] = [],
): StepOption[] => {
  if (!step || step.config === '') return []
  const stepConfig: StepConfig = JSON.parse(
    step.config ? step.config : '{}',
  ) as StepConfig

  if (
    typeof stepConfig.optionsFromSource === 'object' &&
    stepConfig.optionsFromSource !== null &&
    stepConfig.optionsFromSource !== undefined &&
    optionsFromNamespace
  ) {
    const stepOptions = optionsFromNamespace.find(
      (value) => value.slug === step.slug,
    )
    if (!stepOptions || !stepOptions.data) return []

    const { labelFieldEN, labelFieldIS, optionSlugField, transitions } =
      stepConfig.optionsFromSource

    const parsedOptions = stepOptions.data.map((o) => {
      const label = lang === 'en' ? o[labelFieldEN] : o[labelFieldIS]
      let stepTransition = ''

      transitions.sort(
        (
          a: StepOptionsFromSourceTransitionCMS,
          b: StepOptionsFromSourceTransitionCMS,
        ) => {
          if (!a.priority && !b.priority) return 0
          if (!a.priority) return 1
          if (!b.priority) return -1
          return a.priority - b.priority
        },
      )

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
          stepTransition = transition
          break
        }
      }
      return {
        label: label,
        transition: stepTransition,
        value: o[optionSlugField],
      }
    })

    if (
      sourceNamespacesThatNeedToBeSorted.includes(
        stepConfig.optionsFromSource?.sourceNamespace,
      )
    ) {
      parsedOptions.sort((a, b) => a.label?.localeCompare(b.label))
    }

    return parsedOptions
  }

  if (!stepConfig.options) return []

  return stepConfig.options.map((o) => {
    const label = lang === 'en' ? o.labelEN : o.labelIS
    return {
      label: label,
      transition: o.transition,
      value: o.optionSlug,
    }
  })
}

const getStepOptionsSourceNamespace = (step: Step): string => {
  if (!step || step.config === '') return ''
  const stepConfig: StepConfig = JSON.parse(
    step.config ? step.config : '{}',
  ) as StepConfig
  if (stepConfig.optionsFromSource)
    return stepConfig.optionsFromSource.sourceNamespace
  return ''
}

const stepContainsQuestion = (step: Step) => {
  return (
    step.subtitle &&
    step.subtitle.length > 0 &&
    step.stepType !== STEP_TYPES.ANSWER &&
    step.subtitle[0].__typename === 'Html' &&
    step.subtitle[0].document.content.length > 0 &&
    step.subtitle[0].document.content[0].content &&
    step.subtitle[0].document.content[0].content.length > 0
  )
}

const getStepQuestion = (step: Step): string => {
  if (stepContainsQuestion(step) && step.subtitle?.[0].__typename === 'Html') {
    return step.subtitle[0].document.content[0].content[0].value
  }
  return ''
}

const getStepOptionsFromUIConfiguration = async (
  stepper: Stepper,
  apolloClient: ApolloClient<NormalizedCacheObject>,
) => {
  const stepOptions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>[]
    slug: string
  }[] = []

  const queries = (stepper.steps ?? []).map((step) => {
    const stepOptionsNameSpace = getStepOptionsSourceNamespace(step as Step)
    if (!stepOptionsNameSpace) return null
    return apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: stepOptionsNameSpace,
            lang: 'is',
          },
        },
      })
      .then((content) => {
        // map data here to reduce data processing in component
        return content.data.getNamespace
          ? JSON.parse(content.data.getNamespace.fields)
          : {}
      })
  })

  const dataArray = await Promise.all(queries)

  for (let i = 0; i < dataArray.length; i += 1) {
    stepOptions.push({
      slug: stepper.steps?.[i].slug ?? '',
      data: dataArray[i],
    })
  }

  return stepOptions.filter(Boolean)
}

export { STEP_TYPES }
export {
  getStepBySlug,
  getCurrentStep,
  getStateMeta,
  getStepperMachine,
  resolveStepType,
  getStepOptions,
  getStepOptionsFromUIConfiguration,
  getStepQuestion,
  getStepOptionsSourceNamespace,
  getCurrentStepAndStepType,
  validateStepperConfig,
  validateStepConfig,
}
export type {
  StepperConfig,
  StateMeta,
  StepperState,
  StepOption,
  StepperMachine,
}
