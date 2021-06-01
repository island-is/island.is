import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'

import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import ReviewSection, { ReviewSectionState } from './ReviewSection'
import { dateFormat } from '@island.is/shared/constants'

interface Step {
  title: string
  description: string
  state: ReviewSectionState
}

const steps: Step[] = [
  {
    state: ReviewSectionState.complete,
    title: 'all good things',
    description: 'some days are like das',
  },
  {
    state: ReviewSectionState.inProgress,
    title: 'Da day we all met',
    description: 'some days are like das',
  },
  {
    state: ReviewSectionState.requiresAction,
    title: 'here is some good else is good',
    description: 'some days are like das',
  },
]

const EligibilitySummary: FC<FieldBaseProps> = ({ application }) => {

  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={10}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      >
      </Box>

      <Box marginTop={7} marginBottom={8}>
        {steps.map((step, i) => {
          return (
            <ReviewSection
              key={step.title}
              application={application}
              index={i + 1}
              {...step}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export { EligibilitySummary }
