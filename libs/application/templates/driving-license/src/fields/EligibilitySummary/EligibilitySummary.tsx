import React, { FC, useEffect } from 'react'

import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { m } from '../../lib/messages'

import { FieldBaseProps } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import ReviewSection, { ReviewSectionState, Step } from './ReviewSection'
import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { useFormContext } from 'react-hook-form'

const extractReasons = (eligibility: ApplicationEligibility): Step[] => {
  return eligibility.requirements.map(({ key, requirementMet }) =>
    requirementKeyToStep(key, requirementMet),
  )
}

// TODO: we need a better way of getting the translated string in here, outside
// of react. Possibly we should just make a more flexible results screen.
// This string ends up being used as the paramejter displayed as the error message
// for the failed dataprovider
const requirementKeyToStep = (key: string, isRequirementMet: boolean): Step => {
  const step = {
    state: isRequirementMet
      ? ReviewSectionState.complete
      : ReviewSectionState.requiresAction,
  }

  switch (key) {
    case RequirementKey.DrivingSchoolMissing:
      return {
        ...step,
        title: m.requirementUnmetDrivingSchoolTitle,
        description: m.requirementUnmetDrivingSchoolDescription,
      }
    case RequirementKey.DrivingAssessmentMissing:
      return {
        ...step,
        title: m.requirementUnmetDrivingAssessmentTitle,
        description: m.requirementUnmetDrivingAssessmentDescription,
      }
    case RequirementKey.DeniedByService:
      return {
        ...step,
        title: m.requirementUnmetDeniedByServiceTitle,
        description: m.requirementUnmetDeniedByServiceDescription,
      }
    default:
      throw new Error('Unknown requirement reason - should not happen')
  }
}

const EligibilitySummary: FC<FieldBaseProps> = ({ application }) => {
  const {
    eligibility: { data: eligibilityData },
  } = application.externalData
  const { setValue } = useFormContext()

  const eligibility = (eligibilityData as unknown) as ApplicationEligibility
  const steps = extractReasons(eligibility)

  useEffect(() => {
    setValue('requirementsMet', eligibility.isEligible)
  }, [eligibility, setValue])

  return (
    <Box marginBottom={10}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      ></Box>

      <Box marginTop={7} marginBottom={8}>
        {steps.map((step, i) => {
          return (
            <ReviewSection
              key={i}
              application={application}
              index={i + 1}
              step={step}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export { EligibilitySummary }
