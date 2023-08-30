import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  AccordionItem,
  ArrowLink,
  Box,
  Button,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { Step, Stepper } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { scrollTo } from '@island.is/web/hooks/useScrollSpy'
import {
  StepperState,
  resolveStepType,
  getStepOptions,
  getStepBySlug,
  getStateMeta,
  StepperMachine,
} from '../utils'
import { STEPPER_HELPER_ENABLED_KEY } from '../Stepper/Stepper'

import * as styles from './StepperHelper.css'

const SUCCESS_SYMBOL = '✔️'
const ERROR_SYMBOL = '❌'

// Be careful when editing this, if you remove an object then the indexing will go out of bounds
const headings = [
  {
    headingId: 'stepper',
    headingTitle: 'Stepper',
  },
  {
    headingId: 'current-step',
    headingTitle: 'Current step',
  },
  {
    headingId: 'all-states',
    headingTitle: 'All states',
  },
  {
    headingId: 'all-steps',
    headingTitle: 'All steps',
  },
]

const getContentfulLink = ({ id }: Step | Stepper) => {
  const contentfulSpace = process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj'
  return `https://app.contentful.com/spaces/${contentfulSpace}/entries/${id}`
}

interface FieldProps {
  name?: string
  value?: string
  symbol?: string
  ariaLabel?: string
  symbolHoverText?: string
  symbolOnRight?: boolean
}

const Field: FC<React.PropsWithChildren<FieldProps>> = ({
  name,
  value,
  symbol,
  ariaLabel = 'symbol',
  symbolHoverText,
  symbolOnRight = true,
}) => {
  const symbolComponent = (
    <span title={symbolHoverText} role="img" aria-label={ariaLabel}>
      {symbolOnRight && ' '}
      {symbol}
      {!symbolOnRight && ' '}
    </span>
  )
  return (
    <Box>
      {symbol && !symbolOnRight && symbolComponent}
      {name && <span className={styles.bold}>{name}:</span>}
      {value && (
        <span>
          {name && ' '}
          {value}
        </span>
      )}
      {symbol && symbolOnRight && symbolComponent}
    </Box>
  )
}

const getAllStateStepSlugs = (stepperMachine: StepperMachine) => {
  const allStateStepSlugs: string[] = []
  for (const stateName in stepperMachine.states) {
    const state = stepperMachine.states[stateName]
    const slug = state?.meta?.stepSlug
    if (slug) allStateStepSlugs.push(slug)
  }
  return allStateStepSlugs
}

interface ErrorField {
  message: string
  fieldName?: string
  fieldValue?: string
  messageId?: string
}

export const renderErrors = (errors: ErrorField[]) => {
  return (
    <Box>
      <Field
        value={`${errors.length} error${errors.length !== 1 ? 's' : ''} found`}
        symbol={errors.length > 0 ? ERROR_SYMBOL : SUCCESS_SYMBOL}
      />
      <Box marginLeft={4}>
        {errors.map((error, index) => (
          <div
            key={index}
            className={`${error.messageId ? styles.error : ''} ${
              styles.fitBorder
            }`}
            onClick={() => {
              if (!error.messageId) return
              scrollTo(error.messageId, {
                smooth: true,
              })
            }}
          >
            <Field name={error.fieldName} value={error.fieldValue} />
            <Field value={error.message} symbol={ERROR_SYMBOL} />
          </div>
        ))}
      </Box>
    </Box>
  )
}

export const renderStepperAndStepConfigErrors = (
  stepper: Stepper,
  stepperConfigErrors: Set<string>,
  stepConfigErrors: { step: Step; errors: Set<string> }[],
) => {
  const stepperConfigErrorComponent =
    stepperConfigErrors.size > 0 ? (
      <div className={styles.border}>
        <Text variant="h4">Stepper config errors:</Text>
        <ArrowLink href={getContentfulLink(stepper)}>Contentful</ArrowLink>
        {renderErrors(
          Array.from(stepperConfigErrors).map((e) => ({ message: e })),
        )}
      </div>
    ) : null

  return (
    <Box marginTop={15}>
      <AccordionItem label="Helper" startExpanded={true} id="stepper-helper">
        {stepperConfigErrorComponent}
        {stepConfigErrors
          .filter(({ errors }) => errors.size > 0)
          .map(({ step, errors }, index) => (
            <div key={index} className={styles.border}>
              <Text variant="h5">Step config errors:</Text>
              <ArrowLink href={getContentfulLink(step)}>Contentful</ArrowLink>
              {renderErrors(Array.from(errors).map((e) => ({ message: e })))}
            </div>
          ))}
      </AccordionItem>
    </Box>
  )
}

interface StepperHelperProps {
  stepper: Stepper
  currentState?: StepperState
  currentStep?: Step
  stepperMachine?: StepperMachine
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionsFromNamespace: { slug: string; data: Record<string, any>[] }[]
}

export const StepperHelper: React.FC<
  React.PropsWithChildren<StepperHelperProps>
> = ({
  stepper,
  currentState,
  stepperMachine,
  currentStep,
  optionsFromNamespace,
}) => {
  const router = useRouter()
  const [isHidden, setIsHidden] = useState(false)

  const value = localStorage.getItem(STEPPER_HELPER_ENABLED_KEY)
  if (value) {
    const shouldBeHidden = !JSON.parse(value)
    if (shouldBeHidden !== isHidden) setIsHidden(shouldBeHidden)
  }

  const { activeLocale } = useI18n()
  const currentStepOptions = getStepOptions(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    currentStep, // TODO: currentStep might be undefined: Stefna
    activeLocale,
    optionsFromNamespace,
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const currentStateStepSlug = getStateMeta(currentState)?.stepSlug // TODO: currentState might be undefined: Stefna
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const allStateStepSlugs = getAllStateStepSlugs(stepperMachine) // TODO: stepperMachine might be undefined: Stefna

  const currentStateStepSlugSymbol = getStepBySlug(
    stepper,
    currentStateStepSlug,
  )
    ? SUCCESS_SYMBOL
    : ERROR_SYMBOL

  const currentStateStepSlugSymbolText = getStepBySlug(
    stepper,
    currentStateStepSlug,
  )
    ? 'There is a step with this slug'
    : currentStateStepSlug
    ? 'No step has this slug'
    : 'The slug is missing'

  const [errors, setErrors] = useState<ErrorField[]>([])

  useEffect(() => {
    setErrors([])
  }, [router.asPath])

  if (isHidden) return null

  return (
    <Box
      marginTop={15}
      borderTopWidth="standard"
      borderColor="standard"
      paddingTop={1}
    >
      <AccordionItem id="stepper-helper" label="Helper">
        <Box marginBottom={2}>
          <Button
            onClick={() => {
              localStorage.setItem(STEPPER_HELPER_ENABLED_KEY, 'false')
              setIsHidden(true)
            }}
            variant="text"
            size="small"
          >
            Hide helper
          </Button>
        </Box>

        {renderErrors(errors)}

        <Box marginTop={4} marginBottom={4}>
          <TableOfContents
            tableOfContentsTitle="Table of contents"
            headings={headings}
            onClick={(id) => scrollTo(id, { smooth: true })}
          />
        </Box>

        <Box id={headings[0].headingId}>
          <Text variant="h4">{headings[0].headingTitle}</Text>
          <Box className={styles.border} marginBottom={2}>
            <ArrowLink href={getContentfulLink(stepper)}>Contentful</ArrowLink>
            <Field
              name="Current state name"
              value={currentState?.value as string}
            />
            <Field
              name="Current state stepSlug"
              value={currentStateStepSlug}
              symbol={currentStateStepSlugSymbol}
              symbolHoverText={currentStateStepSlugSymbolText}
            />
            <Field name="Current state transitions" />
            <Box marginLeft={4} marginTop={1}>
              {currentState?.nextEvents.map((nextEvent, i) => {
                const transitionIsUsedSomewhere = currentStepOptions.some(
                  (o) => o.transition === nextEvent,
                )
                const symbolHoverText = transitionIsUsedSomewhere
                  ? 'The current step has an option that uses this transition'
                  : 'The current step does not have an option that uses this transition'
                const ariaLabel = transitionIsUsedSomewhere
                  ? 'success-symbol'
                  : 'warning-symbol'
                const symbol = transitionIsUsedSomewhere
                  ? SUCCESS_SYMBOL
                  : ERROR_SYMBOL
                return (
                  <Box key={i} className={styles.fitBorder} marginBottom={1}>
                    <Field
                      value={nextEvent}
                      ariaLabel={ariaLabel}
                      symbol={symbol}
                      symbolHoverText={symbolHoverText}
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Box id={headings[1].headingId}>
            <Text variant="h4">{headings[1].headingTitle}</Text>
            <Box className={styles.border}>
              {currentStep && (
                <ArrowLink href={getContentfulLink(currentStep)}>
                  Contentful
                </ArrowLink>
              )}
              <Field name="Title" value={currentStep?.title} />
              <Field
                name="Slug"
                value={currentStep?.slug}
                symbol={
                  currentStateStepSlug &&
                  currentStateStepSlug === currentStep?.slug
                    ? SUCCESS_SYMBOL
                    : ERROR_SYMBOL
                }
                symbolHoverText={
                  currentStateStepSlug &&
                  currentStateStepSlug === currentStep?.slug
                    ? 'The current state stepSlug has the same value as this slug'
                    : 'The current state stepSlug is different from this slug'
                }
              />
              <Field name="Type" value={resolveStepType(currentStep)} />
              <Box marginBottom={1}>
                <Field name="Step options" />
              </Box>
              {currentStepOptions.map((o) => {
                const optionTransitionIsValid = currentState?.nextEvents.some(
                  (t) => t === o.transition,
                )
                const transitionSymbol = optionTransitionIsValid
                  ? SUCCESS_SYMBOL
                  : ERROR_SYMBOL
                const symbolHoverText = optionTransitionIsValid
                  ? 'There is a state with this transaction'
                  : 'There is no state with this transaction'

                return (
                  <Box
                    className={styles.fitBorder}
                    marginLeft={4}
                    marginBottom={1}
                    key={o.value}
                  >
                    <Field name="Label" value={o.label} />
                    <Field name="Slug" value={o.value} />
                    <Field
                      name="Transition"
                      value={o.transition}
                      symbol={transitionSymbol}
                      symbolHoverText={symbolHoverText}
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Box id={headings[2].headingId}>
            <Text variant="h4">{headings[2].headingTitle}</Text>
            <Box className={styles.border}>
              {Object.keys(stepperMachine?.states ?? {}).map((stateName, i) => {
                const state = stepperMachine?.states[stateName]
                const stepSlug = state?.meta?.stepSlug ?? ''
                const step = getStepBySlug(stepper, stepSlug)

                const id = `${headings[2].headingId}-${i}-slug`

                const stateSaysWeHaveAnError =
                  errors.find((e) => e.messageId === id) !== undefined

                const hasSlugError = !step

                if (hasSlugError && !stateSaysWeHaveAnError) {
                  setErrors((errors) =>
                    errors.concat({
                      message: 'has a stepSlug error',
                      fieldName: `State with name`,
                      fieldValue: stateName,
                      messageId: id,
                    }),
                  )
                }

                if (!hasSlugError && stateSaysWeHaveAnError) {
                  setErrors((errors) =>
                    errors.filter((e) => e.messageId !== id),
                  )
                }

                return (
                  <Box
                    marginLeft={4}
                    className={styles.fitBorder}
                    marginBottom={1}
                    marginTop={i === 0 ? 1 : 0}
                    key={id}
                    id={id}
                  >
                    <Field name="State name" value={stateName} />
                    <Field
                      name="State stepSlug"
                      value={stepSlug}
                      symbol={!hasSlugError ? SUCCESS_SYMBOL : ERROR_SYMBOL}
                      symbolHoverText={
                        step
                          ? 'There is a step with this slug'
                          : stepSlug
                          ? 'No step has this slug'
                          : 'The slug is missing'
                      }
                    />
                    <Field name="State transitions" />
                    <Box marginLeft={4} marginTop={1}>
                      {Object.keys(state?.config?.on ?? {}).map(
                        (nextEvent, j) => {
                          const stepWithSameSlug = stepper.steps?.find(
                            (s) => s.slug === stepSlug,
                          )
                          const transitionExists =
                            stepWithSameSlug &&
                            getStepOptions(
                              stepWithSameSlug,
                              activeLocale,
                              optionsFromNamespace,
                            ).some((o) => o.transition === nextEvent)

                          const symbolHoverText = stepWithSameSlug
                            ? transitionExists
                              ? 'The step with the same slug has this transition'
                              : 'No step has this transition'
                            : 'No step has the same slug'

                          const id = `${headings[2].headingId}-${i}-${j}-transition`

                          const stateSaysWeHaveAnError =
                            errors.find((e) => e.messageId === id) !== undefined

                          const hasTransitionError = !transitionExists

                          if (hasTransitionError && !stateSaysWeHaveAnError) {
                            setErrors((errors) =>
                              errors.concat({
                                message: 'has a transition error',
                                fieldName: `State with name`,
                                fieldValue: stateName,
                                messageId: id,
                              }),
                            )
                          }

                          if (!hasTransitionError && stateSaysWeHaveAnError) {
                            setErrors((errors) =>
                              errors.filter((e) => e.messageId !== id),
                            )
                          }

                          return (
                            <Box
                              className={styles.fitBorder}
                              marginBottom={1}
                              id={id}
                              key={id}
                            >
                              <Field
                                value={nextEvent}
                                symbol={
                                  transitionExists
                                    ? SUCCESS_SYMBOL
                                    : ERROR_SYMBOL
                                }
                                symbolHoverText={symbolHoverText}
                                ariaLabel={
                                  transitionExists
                                    ? 'success-symbol'
                                    : 'error-symbol'
                                }
                              />
                            </Box>
                          )
                        },
                      )}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Box id={headings[3].headingId}>
            <Text variant="h4">{headings[3].headingTitle}</Text>
            <Box className={styles.border}>
              {(stepper.steps ?? []).map((step, i) => {
                const hasSlugError = !allStateStepSlugs.includes(step.slug)
                const id = `${headings[3].headingId}-${i}-slug`

                const stateSaysWeHaveAnError =
                  errors.find((e) => e.messageId === id) !== undefined

                if (hasSlugError && !stateSaysWeHaveAnError) {
                  setErrors((errors) =>
                    errors.concat({
                      message: 'has a slug error',
                      messageId: id,
                      fieldName: 'Step with title',
                      fieldValue: step.title,
                    }),
                  )
                }

                if (!hasSlugError && stateSaysWeHaveAnError) {
                  setErrors((errors) =>
                    errors.filter((e) => e.messageId !== id),
                  )
                }

                return (
                  <Box
                    marginLeft={4}
                    className={styles.fitBorder}
                    marginBottom={1}
                    key={id}
                    id={id}
                    marginTop={i === 0 ? 1 : 0}
                  >
                    <ArrowLink href={getContentfulLink(step)}>
                      Contentful
                    </ArrowLink>
                    <Field name="Title" value={step.title} />
                    <Field
                      name="Slug"
                      value={step.slug}
                      symbol={!hasSlugError ? SUCCESS_SYMBOL : ERROR_SYMBOL}
                      symbolHoverText={
                        !hasSlugError
                          ? 'There is a state with this slug'
                          : 'No state has this slug'
                      }
                    />
                    <Field name="Type" value={resolveStepType(step)} />
                    <Field name="Step options" />
                    {getStepOptions(
                      step,
                      activeLocale,
                      optionsFromNamespace,
                    ).map((o, j) => {
                      const nameOfStateWithSameSlug = Object.keys(
                        stepperMachine?.states ?? {},
                      ).find((stateName) => {
                        const state = stepperMachine?.states[stateName]
                        return (state?.meta?.stepSlug ?? '') === step.slug
                      })

                      const stateWithSameSlug = nameOfStateWithSameSlug
                        ? stepperMachine?.states[nameOfStateWithSameSlug]
                        : null

                      const optionTransitionIsValid = Object.keys(
                        stateWithSameSlug?.on ?? {},
                      ).some((transition) => transition === o.transition)

                      const transitionSymbol = optionTransitionIsValid
                        ? SUCCESS_SYMBOL
                        : ERROR_SYMBOL

                      const transitionSymbolHoverText = stateWithSameSlug
                        ? optionTransitionIsValid
                          ? 'The state with the same slug has this transition'
                          : 'The state with the same slug does not have this transaction'
                        : 'There is no state with the same slug'

                      const hasError = !optionTransitionIsValid
                      const id = `${headings[3].headingId}-${i}-option-${j}`

                      const stateSaysWeHaveAnError =
                        errors.find((e) => e.messageId === id) !== undefined

                      if (hasError && !stateSaysWeHaveAnError) {
                        setErrors((errors) =>
                          errors.concat({
                            message: `has a transition error`,
                            messageId: id,
                            fieldName: 'Step with title',
                            fieldValue: step.title,
                          }),
                        )
                      }

                      if (!hasError && stateSaysWeHaveAnError) {
                        setErrors((errors) =>
                          errors.filter((e) => e.messageId !== id),
                        )
                      }

                      return (
                        <Box
                          className={styles.fitBorder}
                          marginLeft={4}
                          marginBottom={1}
                          key={id}
                          id={id}
                        >
                          <Field name="Label" value={o.label} />
                          <Field name="Slug" value={o.value} />
                          <Field
                            name="Transition"
                            value={o.transition}
                            symbol={transitionSymbol}
                            symbolHoverText={transitionSymbolHoverText}
                          />
                        </Box>
                      )
                    })}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </AccordionItem>
    </Box>
  )
}
