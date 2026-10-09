import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { regulation } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { SkeletonLoader, Stack } from '@island.is/island-ui/core'
import {
  ReviewWarnings,
  ReviewOverview,
  TextComparison,
} from '../components/regulations'
import { collectRegulationWarnings } from '../utils/regulationValidations'
import { usePrice } from '../hooks/usePrice'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import { useRegulationImpacts } from '../hooks/useRegulationImpacts'
import { useEffect, useMemo, useState } from 'react'

export const RegulationSummaryScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application, setSubmitButtonDisabled } = props

  const { draftId, draftData, draftLoaded, loadDraft } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  const { impacts, impactsLoaded } = useRegulationImpacts({ draftId })
  const isAmending =
    application.answers?.applicationType === 'amending_regulation'

  // The amending text is published as written, while the base changes are
  // applied as recorded, so the user confirms they match before submitting.
  // Kept in local state so it has to be confirmed again on each visit.
  const needsTextConfirmation = isAmending && impacts.length > 0
  const [textConfirmed, setTextConfirmed] = useState(false)
  const {
    price,
    loading: priceLoading,
    error: priceError,
  } = usePrice({
    applicationId: application.id,
  })

  // Load draft data from DB on mount
  useEffect(() => {
    if (draftId && !draftLoaded) {
      loadDraft()
    }
  }, [draftId, draftLoaded, loadDraft])

  // Merge DB-sourced regulation fields into answers for validation
  const enrichedAnswers = useMemo(() => {
    const answers = application.answers ?? {}
    return {
      ...answers,
      regulation: {
        ...(answers.regulation as Record<string, unknown>),
        effectiveDate: draftData.effectiveDate,
        fastTrack: draftData.fastTrack,
        lawChapters: draftData.lawChapters,
        impacts,
      },
    }
  }, [application.answers, draftData, impacts])

  const isLoading = (draftId && !draftLoaded) || !impactsLoaded
  const warnings = collectRegulationWarnings(enrichedAnswers)
  const hasWarnings = isLoading || warnings.length > 0
  const submitDisabled =
    hasWarnings || (needsTextConfirmation && !textConfirmed)

  useEffect(() => {
    setSubmitButtonDisabled && setSubmitButtonDisabled(submitDisabled)
  }, [submitDisabled, setSubmitButtonDisabled])

  useEffect(() => {
    return () => {
      setSubmitButtonDisabled && setSubmitButtonDisabled(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FormScreen
      goToScreen={props.goToScreen}
      title={f(regulation.summary.general.title)}
      intro={f(regulation.summary.general.intro)}
    >
      <Stack space={[2, 2, 3]}>
        {isLoading ? (
          <SkeletonLoader height={80} borderRadius="large" />
        ) : (
          <>
            <ReviewWarnings
              answers={enrichedAnswers}
              goToScreen={props.goToScreen}
            />
            <ReviewOverview
              answers={enrichedAnswers}
              hasWarnings={warnings.length > 0}
              price={price}
              priceLoading={priceLoading}
              priceError={!!priceError}
            />
            {needsTextConfirmation && (
              <TextComparison
                impacts={impacts}
                advertHtml={application.answers?.advert?.html}
                confirmed={textConfirmed}
                onConfirmedChange={setTextConfirmed}
              />
            )}
          </>
        )}
      </Stack>
    </FormScreen>
  )
}

export default RegulationSummaryScreen
