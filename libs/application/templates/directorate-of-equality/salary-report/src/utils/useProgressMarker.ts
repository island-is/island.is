import { useCallback, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import type { FieldBaseProps, FormValue } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import type { ProgressStep } from './constants'

export type ProgressMarkers = Partial<Record<ProgressStep, true>>

/**
 * Persists the report-step completion markers behind `answers.progress` (see
 * ProgressPaths in ./constants) and mirrors them into the form shell's own
 * answers, so the current session navigates on the same values a later visit
 * will read back.
 *
 * Why an explicit mutation rather than `answerQuestions`/`setValue` alone: the
 * editors write their marker from inside a setBeforeSubmitCallback, and by then
 * react-hook-form has already handed the screen's values to the shell's
 * onSubmit. A value written at that point reaches neither those values nor the
 * captured answers, so extractAnswersToSubmitFromScreen never sees it and it is
 * lost on reload — which is what used to happen to the `hasPersonalCriteria`
 * write in CriteriaEditor.
 *
 * Markers are only ever written `true`. The shell counts any answer that is not
 * `undefined` as given, so writing `false` for an unfinished step would mark it
 * complete.
 *
 * The write resolves to whether it was persisted, so a caller that would
 * otherwise write its marker only once per mount can retry a failed one.
 *
 * The returned function is stable, so it is safe as an effect dependency —
 * every caller registers its marker write from inside an effect. answerQuestions
 * is a fresh arrow on every shell render and the ANSWER it dispatches triggers
 * another one, so it is held in a ref rather than closed over (the same reason
 * SalaryAnalysisResults keeps its own answerQuestionsRef).
 */
export const useProgressMarker = (
  applicationId: string,
  answerQuestions?: FieldBaseProps['answerQuestions'],
) => {
  const { locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const answerQuestionsRef = useRef(answerQuestions)
  useEffect(() => {
    answerQuestionsRef.current = answerQuestions
  }, [answerQuestions])

  return useCallback(
    async (markers: ProgressMarkers, extraAnswers?: FormValue) => {
      const answers: FormValue = { progress: markers, ...extraAnswers }
      let persisted = true

      try {
        await updateApplication({
          variables: { input: { id: applicationId, answers }, locale },
        })
      } catch {
        // Never block navigation on a marker: the applicant's actual work is
        // already on the DMR draft by the time this runs, and the only cost of
        // a lost marker is that they resume a screen earlier than they could.
        persisted = false
      }

      // Mirrored even when the write failed. `hasPersonalCriteria` rides along
      // in extraAnswers and decides whether the employee-classification screen
      // exists at all, so leaving the shell on the stale value would skip a
      // required step for the rest of the session. What is only mirrored is
      // lost on reload — the return value is how a caller that latches on a
      // marker (EmployeesEditor) knows to try again.
      answerQuestionsRef.current?.(answers)

      return persisted
    },
    [applicationId, locale, updateApplication],
  )
}
