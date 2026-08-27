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
 * A failed write is left alone rather than surfaced: the report itself is
 * already submitted, there is nothing for the applicant to do about it, and the
 * next visit renders this screen again and retries.
 */
export const PostponeReceiptMarker = ({ application }: FieldBaseProps) => {
  const { lang: locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const marked = useRef(false)

  useEffect(() => {
    if (marked.current || hasSeenPostponeReceipt(application.answers)) return
    marked.current = true

    updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: { salaryAnalysis: { postponeReceiptSeen: true } },
        },
        locale,
      },
    }).catch((error) =>
      console.error('Failed to mark the postpone receipt as seen', error),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
