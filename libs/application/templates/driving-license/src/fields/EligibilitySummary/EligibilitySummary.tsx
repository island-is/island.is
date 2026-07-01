import React, { FC, useEffect } from 'react'
import type { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  LoadingDots,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import ReviewSection from './ReviewSection'
import { useFormContext } from 'react-hook-form'
import { extractReasons } from './extractReasons'
import { useEligibility } from './useEligibility'
import { m } from '../../lib/messages'

export const EligibilitySummary: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { setValue, watch } = useFormContext()
  const { lang, formatMessage } = useLocale()

  // The redesign flags are written by hidden inputs on this same screen
  // (sectionRequirements.ts), so `application.answers` is still stale on
  // first render. Read live form state first, fall back to answers for
  // returning visits after the value has been persisted.
  const is65RenewalRedesignEnabled =
    watch('is65RenewalRedesignEnabled') === true ||
    getValueViaPath(application.answers, 'is65RenewalRedesignEnabled') === true

  const isBTempRedesignEnabled =
    watch('isBTempRedesignEnabled') === true ||
    getValueViaPath(application.answers, 'isBTempRedesignEnabled') === true

  const { eligibility, loading, error } = useEligibility(
    application,
    is65RenewalRedesignEnabled,
    isBTempRedesignEnabled,
  )

  useEffect(() => {
    setValue('requirementsMet', eligibility?.isEligible || false)
  }, [eligibility?.isEligible, setValue])

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        paddingY={4}
        role="status"
        aria-live="polite"
      >
        <VisuallyHidden>{formatMessage(m.loadingEligibility)}</VisuallyHidden>
        <LoadingDots />
      </Box>
    )
  }

  if (error || !eligibility) {
    return (
      <Box role="alert">
        <Text>{formatMessage(coreErrorMessages.failedDataProvider)}</Text>
      </Box>
    )
  }

  const requirements = extractReasons(eligibility, lang)

  return (
    <Box marginBottom={10}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        justifyContent="spaceBetween"
      ></Box>
      <Box marginTop={3} marginBottom={8}>
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
