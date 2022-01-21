import React, { FC } from 'react'

import { AccordionItem, ArrowLink, Box } from '@island.is/island-ui/core'

import { Step, Stepper } from '@island.is/api/schema'

import {
  StepperState,
  resolveStepType,
  getStepOptions,
  getStepBySlug,
  getStateMeta,
  StepperMachine,
} from './StepperFSMUtils'
import { useI18n } from '@island.is/web/i18n'
import * as styles from './StepperFSMHelper.css'

const SUCCESS_SYMBOL = '✔️'
const ERROR_SYMBOL = '❌'

const getContentfulLink = (value: Step | Stepper) => {
  const contentfulSpace = process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj'
  return `https://app.contentful.com/spaces/${contentfulSpace}/entries/${value.id}`
}

interface FieldProps {
  name?: string
  value?: string
  symbol?: string
  ariaLabel?: string
  symbolHoverText?: string
  symbolOnRight?: boolean
}

const Field: FC<FieldProps> = ({
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
    const slug = state?.meta.stepSlug
    if (slug) allStateStepSlugs.push(slug)
  }
  return allStateStepSlugs
}

interface StepperHelperProps {
  stepper: Stepper
  currentState: StepperState
  currentStep: Step
  stepperMachine: StepperMachine
  optionsFromNamespace: { slug: string; data: [] }[]
}

export const StepperHelper: React.FC<StepperHelperProps> = ({
  stepper,
  currentState,
  stepperMachine,
  currentStep,
  optionsFromNamespace,
}) => {
  const { activeLocale } = useI18n()
  const stepOptions = getStepOptions(
    currentStep,
    activeLocale,
    optionsFromNamespace,
  )
  const currentStateStepSlug = getStateMeta(currentState)?.stepSlug
  const allStateStepSlugs = getAllStateStepSlugs(stepperMachine)

  return (
    <Box marginTop={15}>
      <AccordionItem id="stepper-helper" label="Helper">
        <Box marginTop={2}>
          <AccordionItem id="stepper" label="Stepper">
            <Box className={styles.border} marginBottom={2}>
              <ArrowLink href={getContentfulLink(stepper)}>
                Contentful
              </ArrowLink>
              <Field
                name="Current state name"
                value={currentState.value as string}
              />
              <Field
                name="Current state step slug"
                value={currentStateStepSlug}
                symbol={
                  getStepBySlug(stepper, currentStateStepSlug)
                    ? SUCCESS_SYMBOL
                    : ERROR_SYMBOL
                }
                symbolHoverText={
                  getStepBySlug(stepper, currentStateStepSlug)
                    ? 'There is a step with this slug'
                    : currentStateStepSlug
                    ? 'No step has this slug'
                    : 'The slug is missing'
                }
              />
              <Field name="Current state transitions" />
              <Box marginLeft={4} marginTop={1}>
                {currentState.nextEvents.map((nextEvent, i) => {
                  const transitionIsUsedSomewhere = stepOptions.some(
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
                    <Box className={styles.fitBorder} marginBottom={1}>
                      <Field
                        key={i}
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
          </AccordionItem>

          <AccordionItem id="current-step" label="Current Step">
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
                    ? 'The state step slug has the same value as this slug'
                    : 'The state step slug is different from this slug'
                }
              />
              <Field name="Type" value={resolveStepType(currentStep)} />
              <Box marginBottom={1}>
                <Field name="Step options" />
              </Box>
              {stepOptions.map((o) => {
                const optionTransitionIsValid = currentState.nextEvents.some(
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
                    key={o.slug}
                  >
                    <Field name="Label" value={o.label} />
                    <Field name="Slug" value={o.slug} />
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
          </AccordionItem>

          <AccordionItem id="all-states" label="All states">
            <Box className={styles.border}>
              {Object.keys(stepperMachine.states).map((stateName, i) => {
                const state = stepperMachine.states[stateName]
                const stepSlug = state.meta?.stepSlug ?? ''
                return (
                  <Box
                    marginLeft={4}
                    className={styles.fitBorder}
                    marginBottom={1}
                    key={i}
                    marginTop={i === 0 ? 1 : 0}
                  >
                    <Field
                      name="State step slug"
                      value={stepSlug}
                      symbol={
                        getStepBySlug(stepper, stepSlug)
                          ? SUCCESS_SYMBOL
                          : ERROR_SYMBOL
                      }
                      symbolHoverText={
                        getStepBySlug(stepper, stepSlug)
                          ? 'There is a step with this slug'
                          : stepSlug
                          ? 'No step has this slug'
                          : 'The slug is missing'
                      }
                    />
                    <Field name="State transitions" />
                    <Box marginLeft={4} marginTop={1}>
                      {Object.keys(state.config?.on ?? {}).map(
                        (nextEvent, i) => {
                          const transitionExists = stepper.steps.some((step) =>
                            getStepOptions(
                              step,
                              activeLocale,
                              optionsFromNamespace,
                            ).some((o) => o.transition === nextEvent),
                          )
                          return (
                            <Box className={styles.fitBorder} marginBottom={1}>
                              <Field
                                key={i}
                                value={nextEvent}
                                symbol={
                                  transitionExists ? undefined : ERROR_SYMBOL
                                }
                                symbolHoverText={
                                  transitionExists
                                    ? undefined
                                    : 'No step has this transition'
                                }
                                ariaLabel={
                                  transitionExists ? undefined : 'error-symbol'
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
          </AccordionItem>

          <AccordionItem id="all-steps" label="All steps">
            <Box className={styles.border}>
              {stepper.steps.map((step, i) => {
                return (
                  <Box
                    marginLeft={4}
                    className={styles.fitBorder}
                    marginBottom={1}
                    key={i}
                    marginTop={i === 0 ? 1 : 0}
                  >
                    <ArrowLink href={getContentfulLink(step)}>
                      Contentful
                    </ArrowLink>
                    <Field name="Title" value={step.title} />
                    <Field
                      name="Slug"
                      value={step.slug}
                      symbol={
                        allStateStepSlugs.includes(step.slug)
                          ? SUCCESS_SYMBOL
                          : ERROR_SYMBOL
                      }
                      symbolHoverText={
                        allStateStepSlugs.includes(step.slug)
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
                    ).map((o) => {
                      const optionTransitionIsValid = Object.keys(
                        stepperMachine.states,
                      ).some((stateName) =>
                        Object.keys(
                          stepperMachine.states[stateName]?.config?.on ?? {},
                        ).some((transition) => transition === o.transition),
                      )

                      const transitionSymbol = optionTransitionIsValid
                        ? ''
                        : ERROR_SYMBOL
                      const symbolHoverText = optionTransitionIsValid
                        ? undefined
                        : 'There is no state with this transaction'

                      return (
                        <Box
                          className={styles.fitBorder}
                          marginLeft={4}
                          marginBottom={1}
                          key={o.slug}
                        >
                          <Field name="Label" value={o.label} />
                          <Field name="Slug" value={o.slug} />
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
                )
              })}
            </Box>
          </AccordionItem>
        </Box>
      </AccordionItem>
    </Box>
  )
}
