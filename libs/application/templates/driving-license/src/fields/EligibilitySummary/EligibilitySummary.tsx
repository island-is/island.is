import React, { FC, useEffect } from 'react'
import type { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import ReviewSection from './ReviewSection'
import { useFormContext } from 'react-hook-form'
import { extractReasons } from './extractReasons'
import { useEligibility } from './useEligibility'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { CurrentLicenseProviderResult } from '../../dataProviders/CurrentLicenseProvider'
import { DrivingLicenseFakeData } from '../../lib/constants'
import { ContentCard } from './ContentCard'
import { getApplicationInfo } from '../../lib/utils'
import { m } from '../../lib/messages'

export const EligibilitySummary: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const fakeData = getValueViaPath<DrivingLicenseFakeData>(
    application.answers,
    'fakeData',
  )
  const currentLicense = getValueViaPath<CurrentLicenseProviderResult>(
    application.externalData,
    'currentLicense.data',
  )
  const { applicationFor, currentM, nextM } = getApplicationInfo(currentLicense)

  const { eligibility, loading, error } = useEligibility({
    fakeData,
    applicationFor,
    currentLicense,
  })

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
  const requirements = extractReasons(eligibility)

  return (
    <Box>
      {currentM.rightsDescription && (
        <ContentCard
          application={application}
          content={{
            title: currentM.title,
            description: currentM.rightsDescription,
          }}
        />
      )}
      <Text variant="h3" marginTop={4} marginBottom={4}>
        {formatText(m.canApplyFor, application, formatMessage)}
      </Text>
      {nextM.applicationDescription && (
        <ContentCard
          application={application}
          content={{
            title: nextM.title,
            description: nextM.applicationDescription,
          }}
        />
      )}
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
    </Box>
  )
}
