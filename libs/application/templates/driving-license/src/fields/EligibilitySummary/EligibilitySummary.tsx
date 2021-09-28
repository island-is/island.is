import React, { FC, useEffect } from 'react'
import { m } from '../../lib/messages'
import type { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import ReviewSection, { ReviewSectionState, Step } from './ReviewSection'
import { ApplicationEligibility, RequirementKey } from '../../types/schema'
import { useFormContext } from 'react-hook-form'
import { useQuery, gql } from '@apollo/client'

const extractReasons = (eligibility: ApplicationEligibility): Step[] => {
  return eligibility.requirements.map(({ key, requirementMet }) =>
    requirementKeyToStep(key, requirementMet),
  )
}

const QUERY = gql`
  query EligibilityQuery($input: ApplicationEligibilityInput!) {
    drivingLicenseApplicationEligibility(input: $input) {
      isEligible
      requirements {
        key
        requirementMet
      }
    }
  }
`

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

interface UseEligibilityResult {
  error?: Error
  eligibility?: ApplicationEligibility
  loading: boolean
}

const useEligibility = (applicationFor: 'B-full'|'B-temp'): UseEligibilityResult => {
  const { data = {}, error, loading } = useQuery(QUERY, {
    variables: {
      input: {
        applicationFor,
      }
    }
  })

  if (error) {
    console.error(error)
    // TODO: m.
    return {
      loading: false,
      error: error
    }
  }

  return {
    loading,
    eligibility: data.drivingLicenseApplicationEligibility
  }
}

const EligibilitySummary: FC<FieldBaseProps> = ({ application }) => {
  const applicationFor = application.answers.applicationFor || 'B-full'

  const { eligibility, loading, error } = useEligibility(applicationFor as ('B-full'|'B-temp'))

  const { setValue } = useFormContext()

  useEffect(() => {
    setValue('requirementsMet', eligibility?.isEligible || false)
  }, [eligibility, setValue])

  if (loading) {
    return <Text>Sæki upplýsingar...</Text>
  }

  if (error || !eligibility) {
    return <Text>Villa kom upp við að sækja upplýsingar</Text>
  }

  const requirements = extractReasons(eligibility)

  return (
    <Box marginBottom={10}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      ></Box>

      <Box marginTop={7} marginBottom={8}>
        {requirements.map((requirement, i) => {
          return (
            <ReviewSection
              key={i}
              application={application}
              index={i + 1}
              step={requirement}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export { EligibilitySummary }
