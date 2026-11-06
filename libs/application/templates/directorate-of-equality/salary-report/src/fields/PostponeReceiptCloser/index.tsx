import { useEffect, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

/**
 * Renders nothing. It moves the application from POSTPONE_RECEIVED to POSTPONED
 * when the applicant leaves the receipt screen, which is what makes the receipt
 * a one-time screen: the two states have separate forms, so once the applicant
 * is in POSTPONED there is no receipt to render.
 *
 * On leaving rather than on mount, so the transition means what it says — the
 * applicant was shown the receipt and closed it. It also keeps the shell out of
 * it: the screen they are reading is never restructured underneath them.
 *
 * The request therefore has to outlive the page that fires it, hence keepalive,
 * which hands it to the browser to finish after navigation. A lost dispatch
 * costs one redundant screen, not access to the form: the applicant is still in
 * POSTPONE_RECEIVED, sees the receipt once more, and that visit's exit tries
 * again.
 */
export const PostponeReceiptCloser = ({ application }: FieldBaseProps) => {
  const { lang: locale } = useLocale()
  const [submitApplication] = useMutation(SUBMIT_APPLICATION)
  const dispatched = useRef(false)

  useEffect(() => {
    const close = () => {
      // Both listeners can fire for one exit, and pagehide fires again when a
      // page is restored from and re-hidden into the back/forward cache.
      if (dispatched.current) return
      dispatched.current = true

      submitApplication({
        variables: {
          input: { id: application.id, event: DefaultEvents.SUBMIT },
          locale,
        },
        // Fired as the page goes away, so a plain request would die with it.
        context: { fetchOptions: { keepalive: true } },
      }).catch((error) =>
        console.error('Failed to close the postpone receipt', error),
      )
    }

    // pagehide covers the link off this screen and closing the tab.
    // visibilitychange covers a mobile browser that backgrounds the page and is
    // killed without ever firing pagehide — the documented pairing, since
    // neither event alone catches every exit.
    const closeIfHidden = () => {
      if (document.visibilityState === 'hidden') close()
    }

    window.addEventListener('pagehide', close)
    document.addEventListener('visibilitychange', closeIfHidden)

    return () => {
      window.removeEventListener('pagehide', close)
      document.removeEventListener('visibilitychange', closeIfHidden)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
