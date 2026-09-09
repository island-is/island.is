import React, { FC, useEffect } from 'react'
import type { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import ReviewSection from './ReviewSection'
import { extractReasons } from './extractReasons'
import { getStoredTypeEligibility } from '../../utils'
import { B_FULL, DrivingLicenseApplicationFor } from '../../utils/constants'

// Renders the requirement rows for the *selected* license type. The rows are
// computed up front by the `checkEligibility` data provider and stored in
// external data, so this reads them synchronously — no mid-flow query. It also
// writes `requirementsMet`, which gates the "continue" button (dataSchema's
// `requirementsMet.refine`) and the DRAFT→PAYMENT transition.
export const EligibilitySummary: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setSubmitButtonDisabled }) => {
  const { setValue } = useFormContext()
  const { lang } = useLocale()

  const applicationFor =
    getValueViaPath<DrivingLicenseApplicationFor>(
      application.answers,
      'applicationFor',
      B_FULL,
    ) ?? B_FULL

  const eligibility = getStoredTypeEligibility(
    application.externalData,
    applicationFor,
  )

  const isEligible = eligibility?.isEligible ?? false

  useEffect(() => {
    setValue('requirementsMet', isEligible)
  }, [isEligible, setValue])

  // When the applicant is not eligible there is nothing to submit — disable the
  // footer's "continue" button so they can't proceed.
  useEffect(() => {
    setSubmitButtonDisabled?.(!isEligible)
    return () => setSubmitButtonDisabled?.(false)
  }, [isEligible, setSubmitButtonDisabled])

  const steps = eligibility ? extractReasons(eligibility, lang) : []

  return (
    <Box marginTop={3} marginBottom={8}>
      {steps.map((step, i) => (
        <ReviewSection
          key={i}
          application={application}
          index={i + 1}
          step={step}
        />
      ))}
    </Box>
  )
}
