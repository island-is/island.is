import React from 'react'

import {
  ArrowLink,
  Box,
  Bullet,
  BulletList,
  Divider,
  Text,
} from '@island.is/island-ui/core'

import { Step, Stepper } from '@island.is/api/schema'

import {
  StepperState,
  resolveStepType,
  getStepOptions,
} from './StepperFSMUtils'
import { useI18n } from '@island.is/web/i18n'

interface StepperHelperProps {
  stepper: Stepper
  currentState: StepperState
  currentStep: Step
}

export const StepperHelper: React.FC<StepperHelperProps> = ({
  stepper,
  currentState,
  currentStep,
}) => {
  const contentfulSpace = process.env.CONTENTFUL_SPACE || '8k0h54kbe6bj'
  const getContentfulLink = (step: Step) => {
    return `https://app.contentful.com/spaces/${contentfulSpace}/entries/${step.id}`
  }

  const { activeLocale } = useI18n()

  return (
    <>
      <Box marginTop={15}></Box>
      <Divider />
      <Text variant="h1" marginTop={5}>
        Helper
      </Text>
      <Text variant="h2" marginTop={2}>
        Current State
      </Text>
      <Text variant="h5">State name</Text>
      <Text>{currentState.value}</Text>
      <Text variant="h5">State transitions</Text>
      <BulletList type="ul">
        {currentState.nextEvents.map(function (nextEvent, i) {
          return <Bullet key={i}>{nextEvent}</Bullet>
        })}
      </BulletList>
      <Text variant="h4">Current Step</Text>
      <Text>Title: {currentStep?.title}</Text>
      <Text>Slug: {currentStep?.slug}</Text>
      <Text>Type: {resolveStepType(currentStep)}</Text>
      {currentStep && (
        <ArrowLink href={getContentfulLink(currentStep)}>Contentful</ArrowLink>
      )}
      <Text variant="h5">Step options</Text>
      {getStepOptions(currentStep, activeLocale).map((o) => {
        const optionTransitionIsValid = currentState.nextEvents.some(
          (t) => t === o.transition,
        )
        return (
          <Box marginBottom={2} key={o.slug}>
            <Text>Label: {o.label}</Text>
            <Text>Slug: {o.slug}</Text>
            <Text>
              Transition: {o.transition} {optionTransitionIsValid ? '✅' : '❌'}
            </Text>
          </Box>
        )
      })}
      <Text variant="h2" marginTop={2}>
        Available Steps
      </Text>
      <BulletList type="ul">
        {stepper.steps.map(function (step, i) {
          return (
            <Bullet key={i}>
              {step.slug}
              <Bullet>{step.title}</Bullet>
            </Bullet>
          )
        })}
      </BulletList>
    </>
  )
}
