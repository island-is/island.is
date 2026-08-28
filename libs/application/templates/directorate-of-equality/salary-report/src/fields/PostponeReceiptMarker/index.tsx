import { useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { hasSeenPostponeReceipt } from '../../utils/salaryAnalysisNavigation'

/**
 * Renders nothing. Its only job is to persist
 * `salaryAnalysis.postponeReceiptSeen` while the POSTPONED receipt screen is on
 * screen, which is what makes the receipt a one-time screen: on this visit it
 * is the only navigable screen in the form, and on the next one it is gone and
 * the applicant lands on the úrbótaáætlun screen instead.
 *
 * The write goes straight to the server and is deliberately NOT dispatched into
 * the form shell: the úrbótaáætlun/skýrsla/innsending sections are conditioned
 * on this same flag, so telling the shell would grow a "Halda áfram" button and
 * a stepper under the applicant the moment their receipt loaded — the exact
 * flow this screen exists to end.
 *
 * A failed write is not surfaced: the report itself is already submitted and
 * there is nothing for the applicant to do about it. It gets one retry, and
 * beyond that the fallback is the next visit — the receipt renders again and
 * writes again. The cost of a lost write is one redundant screen, not access to
 * the form.
 */
export const PostponeReceiptMarker = ({ application }: FieldBaseProps) => {
  const { lang: locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const marked = useRef(false)

  useEffect(() => {
    if (marked.current || hasSeenPostponeReceipt(application.answers)) return
    // Claimed before the request, not after: StrictMode's double invoke happens
    // long before the promise settles, and one write is enough.
    marked.current = true

    const write = () =>
      updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: { salaryAnalysis: { postponeReceiptSeen: true } },
            // Echoed back rather than omitted: the endpoint reads the counters
            // off the request with a `?? 0` default, so an update without them
            // resets the application card's progress meter to nothing.
            draftProgress: {
              stepsFinished: application.draftFinishedSteps ?? 0,
              totalSteps: application.draftTotalSteps ?? 0,
            },
          },
          locale,
        },
      })

    // Retrying inside the effect rather than releasing `marked`: with an empty
    // dependency list this effect cannot fire again on this instance, so a
    // released guard would never be read.
    write()
      .catch(() => write())
      .catch((error) =>
        console.error('Failed to mark the postpone receipt as seen', error),
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
