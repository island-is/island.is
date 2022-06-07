import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { ValueType } from 'react-select'
import { ParsedUrlQuery } from 'querystring'

import {
  Box,
  Text,
  Button,
  RadioButton,
  Select,
  Link,
  GridColumn,
  GridRow,
  GridContainer,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import {
  GetNamespaceQuery,
  Stepper as StepperSchema,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'

import {
  renderStepperAndStepConfigErrors,
  StepperHelper,
} from '../StepperHelper/StepperHelper'
import {
  getStepperMachine,
  resolveStepType,
  getStepOptions,
  STEP_TYPES,
  StepOption,
  getStepBySlug,
  StepperMachine,
  getStepQuestion,
  getCurrentStepAndStepType,
  validateStepperConfig,
  validateStepConfig,
} from '../utils'

import * as styles from './Stepper.css'

const ANSWER_DELIMITER = ','
export const STEPPER_HELPER_ENABLED_KEY = 'show-stepper-config-helper'

const STEPPER_HELPER_ENABLED =
  isRunningOnEnvironment('dev') || isRunningOnEnvironment('local')

interface StepperProps {
  stepper: StepperSchema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionsFromNamespace: { slug: string; data: Record<string, any>[] }[]
  scrollUpWhenNextStepAppears?: boolean
  namespace: GetNamespaceQuery['getNamespace']
}

interface StepOptionSelectItem {
  label: string
  value: string
  transition: string
}

interface QuestionAndAnswer {
  question: string
  answer: string
  slug: string
}

const getInitialStateAndAnswersByQueryParams = (
  stepper: StepperSchema,
  stepperMachine: StepperMachine,
  query: ParsedUrlQuery,
  activeLocale: string,
  optionsFromNamespace: StepperProps['optionsFromNamespace'],
) => {
  let initialState = stepperMachine.initialState
  const questionsAndAnswers: QuestionAndAnswer[] = []

  const answerString = (query?.answers ?? '') as string

  // If the query parameter is not a string then we just skip checking further
  if (typeof answerString !== 'string')
    return { initialState, questionsAndAnswers }

  const answers = answerString.split(ANSWER_DELIMITER)

  for (const answer of answers) {
    const stateNode = stepperMachine.states[initialState.value as string]
    const step = getStepBySlug(stepper, stateNode.config.meta.stepSlug)
    const stepType = resolveStepType(step)

    if (stepType === STEP_TYPES.ANSWER) break

    const options = getStepOptions(step, activeLocale, optionsFromNamespace)
    const selectedOption = options.find((o) => o.slug === answer)
    if (!selectedOption) break

    initialState = stepperMachine.transition(
      initialState,
      selectedOption.transition,
    )

    const stepQuestion = getStepQuestion(step)
    if (stepQuestion) {
      questionsAndAnswers.push({
        question: stepQuestion,
        answer: selectedOption.label,
        slug: selectedOption.slug,
      })
    }
  }

  return { initialState, questionsAndAnswers }
}

const StepperWrapper = (
  StepperComponent: React.ComponentType<StepperProps>,
) => {
  const Component = (props: StepperProps) => {
    const configErrors = validateStepperConfig(props.stepper)
    const steps =
      props.stepper?.steps
        ?.map((s) => s.slug)
        ?.map((s) => getStepBySlug(props.stepper, s)) ?? []

    const stepConfigErrors = steps.map((step) => ({
      step,
      errors: validateStepConfig(step),
    }))

    if (
      configErrors.size > 0 ||
      stepConfigErrors.some(({ errors }) => errors.size > 0)
    ) {
      return STEPPER_HELPER_ENABLED
        ? renderStepperAndStepConfigErrors(
            props.stepper,
            configErrors,
            stepConfigErrors,
          )
        : null
    }

    return <StepperComponent {...props} />
  }

  return Component
}

const Stepper = ({
  stepper,
  optionsFromNamespace,
  namespace,
  scrollUpWhenNextStepAppears = true,
}: StepperProps) => {
  const router = useRouter()
  const { activeLocale } = useI18n()

  const n = useNamespace(namespace)

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_, setCounter] = useState(0)

  const stepperMachine = useMemo(() => getStepperMachine(stepper), [stepper])

  const { initialState, questionsAndAnswers } = useMemo(() => {
    return getInitialStateAndAnswersByQueryParams(
      stepper,
      stepperMachine,
      router.query,
      activeLocale,
      optionsFromNamespace,
    )
  }, [
    activeLocale,
    router.query,
    stepper,
    stepperMachine,
    optionsFromNamespace,
  ])

  const [currentState, setCurrentState] = useState(initialState)

  useEffect(() => {
    setCurrentState(initialState)
  }, [initialState])

  // Since this gets it's value from useMemo then it can be undefined on the first pass, so be vary of that
  const { currentStep, currentStepType } = useMemo(
    () => getCurrentStepAndStepType(stepper, currentState),
    [stepper, currentState],
  )

  const [showStepperConfigHelper, setShowStepperConfigHelper] = useState(false)

  useEffect(() => {
    const hasSeenHelperBefore = JSON.parse(
      localStorage.getItem(STEPPER_HELPER_ENABLED_KEY) ?? 'false',
    )
    setShowStepperConfigHelper(STEPPER_HELPER_ENABLED && hasSeenHelperBefore)
  }, [])

  const isOnFirstStep = stepperMachine.initialState.value === currentState.value
  const [selectedOption, setSelectedOption] = useState<StepOption | null>(null)
  const stepOptions = useMemo<StepOption[]>(
    () => getStepOptions(currentStep, activeLocale, optionsFromNamespace),
    [activeLocale, currentStep, optionsFromNamespace],
  )

  const [
    hasClickedContinueWithoutSelecting,
    setHasClickedContinueWithoutSelecting,
  ] = useState<boolean>(false)

  const [transitionErrorMessage, setTransitionErrorMessage] = useState('')

  useEffect(() => {
    setSelectedOption(null)
  }, [router.asPath])

  useEffect(() => {
    let previousAnswerIsValid = false
    const { previousAnswer } = router.query

    // Select the option that was previously selected if we want to change an answer
    if (previousAnswer && selectedOption === null) {
      const option = stepOptions.find((o) => o.slug === previousAnswer) ?? null
      setSelectedOption(option)
      previousAnswerIsValid = option !== null
    }

    // Select the first item by default if we have a dropdown
    if (
      currentStepType === STEP_TYPES.QUESTION_DROPDOWN &&
      selectedOption === null &&
      stepOptions.length > 0 &&
      !previousAnswerIsValid
    ) {
      setSelectedOption(stepOptions[0])
    }
  }, [
    router.query,
    currentStepType,
    selectedOption,
    stepOptions,
    router.asPath,
  ])

  const renderQuestionsAndAnswers = (
    questionsAndAnswers: QuestionAndAnswer[],
    urlWithoutQueryParams: string,
  ) => {
    const accumulatedAnswers = []

    return questionsAndAnswers.map(({ question, answer, slug }, i) => {
      const previouslyAccumulatedAnswers = [...accumulatedAnswers]
      accumulatedAnswers.push(slug)
      const query = {
        answers: `${previouslyAccumulatedAnswers.join(ANSWER_DELIMITER)}`,
        previousAnswer: slug,
      }
      return (
        <Box
          key={i}
          paddingBottom={2}
          marginTop={2}
          marginBottom={2}
          className={styles.answerRowContainer}
        >
          <Box marginRight={2}>
            <Text variant="h4" color="purple600">
              {question}
            </Text>
          </Box>
          <Box marginRight={2}>
            <Text color="purple600">{answer}</Text>
          </Box>
          <Box textAlign="right">
            <Link
              shallow={true}
              href={{
                pathname: urlWithoutQueryParams,
                query: query,
              }}
            >
              <Button variant="text" icon="pencil" size="small" nowrap={true}>
                {n('changeSelection', 'Breyta')}
              </Button>
            </Link>
          </Box>
        </Box>
      )
    })
  }

  const ContinueButton = () => (
    <Box marginTop={3}>
      <Button
        onClick={() => {
          if (selectedOption === null) {
            setHasClickedContinueWithoutSelecting(true)
            return
          }
          setHasClickedContinueWithoutSelecting(false)

          setCurrentState((prevState) => {
            const newState = stepperMachine.transition(
              currentState,
              selectedOption.transition,
            )

            const transitionWorked = newState.value !== prevState.value
            const onTheInitialStep =
              prevState.value === stepperMachine.initialState.value

            const pathnameWithoutQueryParams = router.asPath.split('?')[0]
            const previousAnswers =
              router.query?.answers &&
              typeof router.query?.answers === 'string' &&
              !onTheInitialStep
                ? router.query.answers.concat(ANSWER_DELIMITER)
                : ''

            router
              .push({
                pathname: pathnameWithoutQueryParams,
                query: {
                  answers: `${previousAnswers}${selectedOption.slug}`,
                },
              })
              .then(() => {
                if (scrollUpWhenNextStepAppears) window.scrollTo(0, 0)
              })

            if (!transitionWorked) {
              setTransitionErrorMessage(
                n(
                  'couldNotLoadNextStep',
                  'Því miður gekk ekki að hlaða niður næsta skrefi',
                ),
              )
            } else {
              setTransitionErrorMessage('')
            }

            return newState
          })
        }}
        size="small"
      >
        {n('continue', 'Áfram')}
      </Button>
    </Box>
  )

  const QuestionTitle = () => (
    <Box
      marginBottom={3}
      marginTop={1}
      onClick={(ev) => {
        // If the user clicks four times in a row on the question title, we enable the helper if we're not in production
        if (ev.detail === 4) {
          localStorage.setItem(STEPPER_HELPER_ENABLED_KEY, JSON.stringify(true))
          setShowStepperConfigHelper(STEPPER_HELPER_ENABLED)

          // Force a re-render so that the StepperHelper gets rendered
          setCounter((c) => c + 1)
        }
      }}
    >
      {richText(currentStep.subtitle as SliceType[])}
    </Box>
  )

  const renderCurrentStepOptions = () => {
    if (currentStepType === STEP_TYPES.QUESTION_RADIO)
      return stepOptions.map(function (option, i) {
        const key = `step-option-${i}`
        return (
          <Box key={key} marginBottom={3}>
            <RadioButton
              name={key}
              hasError={
                hasClickedContinueWithoutSelecting && selectedOption === null
              }
              label={option.label}
              checked={option.slug === selectedOption?.slug}
              onChange={() => setSelectedOption(option)}
            />
          </Box>
        )
      })

    if (currentStepType === STEP_TYPES.QUESTION_DROPDOWN)
      return (
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '10/12', '8/12']}>
              <Select
                size="sm"
                name="step-option-select"
                noOptionsMessage={n('noOptions', 'Enginn valmöguleiki')}
                value={{
                  label: selectedOption?.label ?? '',
                  value: selectedOption?.slug ?? '',
                }}
                onChange={(option: ValueType<StepOptionSelectItem>) => {
                  const stepOptionSelectItem = option as StepOptionSelectItem
                  const newSelectedOption = {
                    label: stepOptionSelectItem.label,
                    slug: stepOptionSelectItem.value,
                    transition: stepOptionSelectItem.transition,
                  }
                  setSelectedOption(newSelectedOption)
                }}
                options={stepOptions.map((option) => ({
                  label: option.label,
                  value: option.slug,
                  transition: option.transition,
                }))}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      )
  }

  return (
    <Box className={styles.container}>
      {currentStep && <QuestionTitle />}

      {renderCurrentStepOptions()}
      {transitionErrorMessage && (
        <Text marginBottom={2} marginTop={2} color="red400">
          {transitionErrorMessage}
        </Text>
      )}
      {stepOptions?.length > 0 && <ContinueButton />}

      {!isOnFirstStep && (
        <Box
          marginTop={10}
          background="purple100"
          borderRadius="large"
          padding="containerGutter"
        >
          <Box display="flex" alignItems="center" justifyContent="spaceBetween">
            <Text variant="h3" marginBottom={3} color="purple600">
              {n('yourAnswers', 'Svörin þín')}
            </Text>
            <Box marginBottom={3} textAlign="right">
              <Link shallow={true} href={router.asPath.split('?')[0]}>
                <Button variant="text" icon="reload" size="small" nowrap={true}>
                  {n('startAgain', 'Byrja aftur')}
                </Button>
              </Link>
            </Box>
          </Box>
          {renderQuestionsAndAnswers(
            questionsAndAnswers,
            router.asPath.split('?')[0],
          )}
        </Box>
      )}

      {showStepperConfigHelper && (
        <StepperHelper
          stepper={stepper}
          currentState={currentState}
          currentStep={currentStep}
          stepperMachine={stepperMachine}
          optionsFromNamespace={optionsFromNamespace}
        />
      )}
    </Box>
  )
}

export default StepperWrapper(Stepper)
