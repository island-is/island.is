import { useCallback, useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import type { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import type { OutlierGroupAnswer } from './outlierGroups'

/**
 * Persists the outlier plan behind `answers.salaryAnalysis.outlierGroupsDraft`,
 * so an applicant who leaves the úrbótaáætlun screen — back navigation, or
 * closing the application and reopening it — finds their groups and
 * explanations where they left them. Nothing else reads this key: the submit
 * still goes through the DMR draft sync in DRAFT and through the screen's own
 * answers in the review states, exactly as before.
 *
 * Why a scratch key rather than writing `salaryAnalysis.outlierGroups`
 * directly: every PUT runs the template's dataSchema over the answers it is
 * handed, and the refinement on `salaryAnalysis` requires reason, action,
 * remedyDate and signatureRole on every group that has members. Saving one
 * group while another is still blank would therefore be rejected — and that
 * refinement is what produces the per-field errors in the postponed flow, so it
 * has to stay. `outlierGroupsDraft` is declared all-optional and exempt from
 * it (see dataSchema.ts).
 *
 * Every write is also mirrored into the form shell's own answers through
 * `answerQuestions`. The shell freezes its copy at mount and a plain mutation
 * never reaches it, so without the mirror a save would be in the database but
 * not in the session: going back a screen and forward again re-seeds this field
 * from the shell's answers, which would still be the ones it loaded with, and
 * the group would vanish until a full reload. Same reason useProgressMarker
 * mirrors its markers.
 *
 * The write resolves to whether it was persisted rather than throwing, so the
 * card can put its button back and say so.
 */
export const useOutlierPlanBuffer = (
  applicationId: string,
  answerQuestions?: FieldBaseProps['answerQuestions'],
) => {
  const { lang: locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  // A fresh arrow on every shell render, and the ANSWER it dispatches causes
  // another one — so it is held rather than closed over (see useProgressMarker).
  const answerQuestionsRef = useRef(answerQuestions)
  useEffect(() => {
    answerQuestionsRef.current = answerQuestions
  }, [answerQuestions])

  const save = useCallback(
    async (outlierGroupsDraft: OutlierGroupAnswer[]) => {
      const answers = { salaryAnalysis: { outlierGroupsDraft } }

      try {
        await updateApplication({
          variables: { input: { id: applicationId, answers }, locale },
        })
      } catch (error) {
        console.error('Failed to save the outlier plan to answers', error)
        return false
      }

      // Only on success, unlike useProgressMarker: a mirror of a write that
      // failed would read back as "Vistað" on the next visit while nothing had
      // been persisted.
      answerQuestionsRef.current?.(answers)
      return true
    },
    [applicationId, locale, updateApplication],
  )

  return save
}
