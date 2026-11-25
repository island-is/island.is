import React, { FC, useEffect } from 'react'
import type { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import ReviewSection from './ReviewSection'
import { extractReasons } from './extractReasons'
import { getStoredTypeEligibility, structuralCandidates } from '../../utils'
import {
  DrivingLicenseApplicationFor,
  DrivingLicenseFakeData,
} from '../../utils/constants'
import { m } from '../../lib/messages'

// Renders the requirement rows for the *selected* license type. The rows are
// computed up front by the `checkEligibility` data provider and stored in
// external data, so this reads them synchronously — no mid-flow query. It also
// writes `requirementsMet`, which gates the "continue" button (dataSchema's
// `requirementsMet.refine`) and the DRAFT→PAYMENT transition.
export const EligibilitySummary: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setSubmitButtonDisabled }) => {
  const { setValue } = useFormContext()
  const { formatMessage, lang } = useLocale()

  // `applicationFor` may not be in persisted answers yet: in the hidden-selection
  // flow the frozen value is written to react-hook-form by the hidden input in
  // sectionRequirements and only persisted to answers on submit, so on this
  // screen's first render answers.applicationFor is still undefined. Resolve it
  // from the same deterministic source the hidden input uses (the single
  // structural candidate) rather than assuming a type, so the byType lookup
  // matches the applicant's actual candidate.
  const fakeData = getValueViaPath<DrivingLicenseFakeData>(
    application.answers,
    'fakeData',
  )
  const applicationFor =
    getValueViaPath<DrivingLicenseApplicationFor>(
      application.answers,
      'applicationFor',
    ) ?? structuralCandidates(application.externalData, fakeData)[0]

  const eligibility = applicationFor
    ? getStoredTypeEligibility(application.externalData, applicationFor)
    : undefined

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

  return (
    <Box marginTop={3} marginBottom={8}>
      {eligibility ? (
        extractReasons(eligibility, lang).map((step, i) => (
          <ReviewSection key={i} step={step} />
        ))
      ) : (
        // Defensive fallback: no stored eligibility for the resolved type.
        // The normal zero-candidate case (e.g. a full-B holder under 65) is
        // already hard-blocked upstream by the `checkEligibility` provider on
        // the external-data step, and every candidate it lets through has a
        // `byType` entry — so this should be unreachable. If the invariant ever
        // breaks (missing/stale eligibility data), explain why rather than
        // rendering an empty box with a disabled Continue.
        <AlertMessage
          type="error"
          title={formatMessage(m.notEligibleTitle)}
          message={formatMessage(m.notEligibleDescription)}
        />
      )}
    </Box>
  )
}
