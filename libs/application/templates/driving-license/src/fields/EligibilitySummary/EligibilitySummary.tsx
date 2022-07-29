import React, { FC, useEffect } from 'react'
import type { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import ReviewSection from './ReviewSection'
import { useFormContext } from 'react-hook-form'
import { extractReasons } from './extractReasons'
import { useEligibility } from './useEligibility'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

export const EligibilitySummary: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { eligibility, loading, error } = useEligibility(application)

  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()

  useEffect(() => {
    setValue('requirementsMet', eligibility?.isEligible || false)
  }, [eligibility?.isEligible, setValue])

  if (loading) {
    return <Text>Sæki upplýsingar...</Text>
  }

  if (error || !eligibility) {
    return <Text>Villa kom upp við að sækja upplýsingar</Text>
  }
  console.log(eligibility)
  const requirements = extractReasons(eligibility)

  return (
    <Box marginBottom={10} marginTop={4}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      >
        <Text variant="h3">
          {formatText(field.title, application, formatMessage)}
        </Text>
      </Box>
      <Box marginTop={4} marginBottom={8}>
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
