import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { regulation } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { SkeletonLoader, Stack } from '@island.is/island-ui/core'
import { ReviewWarnings, ReviewOverview } from '../components/regulations'
import { collectRegulationWarnings } from '../utils/regulationValidations'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import { useRegulationImpacts } from '../hooks/useRegulationImpacts'
import { useEffect, useMemo } from 'react'

export const RegulationSummaryScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application, setSubmitButtonDisabled } = props

  const { draftId, draftData, draftLoaded, loadDraft } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  const { impacts, impactsLoaded } = useRegulationImpacts({ draftId })

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
        lawChapters: draftData.lawChapters,
        impacts,
      },
    }
  }, [application.answers, draftData, impacts])

  const isLoading = (draftId && !draftLoaded) || !impactsLoaded
  const warnings = collectRegulationWarnings(enrichedAnswers)
  const hasWarnings = isLoading || warnings.length > 0

  useEffect(() => {
    setSubmitButtonDisabled && setSubmitButtonDisabled(hasWarnings)
  }, [hasWarnings, setSubmitButtonDisabled])

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
            />
          </>
        )}
      </Stack>
    </FormScreen>
  )
}

export default RegulationSummaryScreen
