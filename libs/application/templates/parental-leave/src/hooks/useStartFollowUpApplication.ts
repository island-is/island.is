import { useCallback, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import {
  CREATE_APPLICATION,
  SUBMIT_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import {
  ApplicationConfigurations,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { ApplicationAction } from '../constants'

const slug = ApplicationConfigurations.ParentalLeave.slug

type Options = {
  /** The application the new one continues. */
  previousApplicationId: string
  /** Use the application currently open in the prerequisite flow. */
  applicationId?: string
  /** Refresh the current application after an in-place state transition. */
  refetch?: () => void
  /**
   * Answers to write back onto the predecessor. Needed where the predecessor
   * tracks that a follow-up was started — e.g. `hasAppliedForReidenceGrant`,
   * which is what hides its "apply for the residence grant" card.
   */
  previousAnswersPatch?: Record<string, unknown>
}

/**
 * Starts a follow-up application: one island.is application is one action, so a
 * change or a residence grant is a new application rather than a re-entry into the
 * one it descends from.
 *
 * The predecessor's id goes out as `initialQuery`, which the application system
 * persists as `answers.initialQuery` (see `initialQueryParameter` on the
 * template). From there the `getPreviousApplication` template api resolves the
 * answers to carry over server-side, so nothing sensitive travels through the
 * browser.
 */
export const useStartFollowUpApplication = (action: ApplicationAction) => {
  const navigate = useNavigate()
  const { locale } = useLocale()
  const [error, setError] = useState<Error | null>(null)
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION)

  const [createApplication, { loading }] = useMutation(CREATE_APPLICATION)

  const start = useCallback(
    async ({
      previousApplicationId,
      applicationId,
      refetch,
      previousAnswersPatch,
    }: Options) => {
      setError(null)

      try {
        if (applicationId) {
          const answers = {
            applicationAction: action,
            initialQuery: previousApplicationId,
          }

          await updateApplication({
            variables: {
              input: { id: applicationId, answers },
              locale,
            },
          })

          await submitApplication({
            variables: {
              input: {
                id: applicationId,
                event: DefaultEvents.SUBMIT,
                answers,
              },
              locale,
            },
          })

          refetch?.()
          return
        }

        const { data } = await createApplication({
          variables: {
            input: {
              typeId: ApplicationTypes.PARENTAL_LEAVE,
              initialQuery: previousApplicationId,
            },
          },
        })

        const newApplicationId = data?.createApplication?.id

        if (!newApplicationId) {
          throw new Error('Create application returned no id')
        }

        // `initialQuery` can only carry the predecessor's id, so the action is
        // written separately. It has to land before the applicant submits
        // prerequisites, because that is what routes them to the right form.
        await updateApplication({
          variables: {
            input: {
              id: newApplicationId,
              answers: { applicationAction: action },
            },
            locale,
          },
        })

        if (previousAnswersPatch) {
          await updateApplication({
            variables: {
              input: {
                id: previousApplicationId,
                answers: previousAnswersPatch,
              },
              locale,
            },
          })
        }

        // Root-relative rather than relative to the current screen, which would
        // depend on how deep in the form shell the user is. No `/umsoknir` prefix:
        // the router is created with `basename: '/umsoknir'`, so it prepends that
        // itself and including it here would duplicate the segment.
        navigate(`/${slug}/${newApplicationId}`)
      } catch (e) {
        setError(e as Error)
      }
    },
    [
      action,
      createApplication,
      locale,
      navigate,
      submitApplication,
      updateApplication,
    ],
  )

  return { start, loading, error }
}
