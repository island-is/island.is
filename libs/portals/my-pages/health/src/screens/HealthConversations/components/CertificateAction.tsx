import { useEffect, useState } from 'react'
import { Box, Button, LoadingDots, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'
import { messages } from '../../../lib/messages'
import {
  useCreateHealthCertificatePaymentIntentMutation,
  useGetHealthCertificateQuery,
} from '../HealthConversationDetail.generated'

const POLL_INTERVAL_MS = 4000
const POLL_TIMEOUT_MS = 2 * 60 * 1000

const useCertificatePaymentPolling = ({
  certificateId,
  pendingPaymentId,
  isReturningFromPayment,
  onPaid,
}: Pick<
  Props,
  'certificateId' | 'pendingPaymentId' | 'isReturningFromPayment' | 'onPaid'
>) => {
  const [isPolling, setIsPolling] = useState(
    Boolean(pendingPaymentId || isReturningFromPayment),
  )

  useEffect(() => {
    if (!isPolling) return
    const timeout = setTimeout(() => setIsPolling(false), POLL_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [isPolling])

  // A pending payment can appear on an already-mounted message via a
  // conversation refetch — start polling for it as well, not only on mount.
  useEffect(() => {
    if (pendingPaymentId) setIsPolling(true)
  }, [pendingPaymentId])

  const { data: pollData } = useGetHealthCertificateQuery({
    variables: { id: certificateId ?? '' },
    skip: !isPolling || !certificateId,
    pollInterval: isPolling ? POLL_INTERVAL_MS : 0,
    fetchPolicy: 'network-only',
  })

  const paid = pollData?.healthDirectorateCertificate?.paid

  useEffect(() => {
    if (isPolling && paid) {
      setIsPolling(false)
      onPaid()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling, paid])

  return isPolling
}

interface Props {
  certificateId?: string | null
  requiresPayment?: boolean | null
  paid?: boolean | null
  pendingPaymentId?: string | null
  isReturningFromPayment?: boolean
  onPaid: () => void
}

const CertificateAction = ({
  certificateId,
  requiresPayment,
  paid,
  pendingPaymentId,
  isReturningFromPayment,
  onPaid,
}: Props) => {
  const { formatMessage, lang } = useLocale()
  const isPolling = useCertificatePaymentPolling({
    certificateId,
    pendingPaymentId,
    isReturningFromPayment,
    onPaid,
  })

  const [createPaymentIntent, { loading: paymentLoading }] =
    useCreateHealthCertificatePaymentIntentMutation()

  const handlePay = async () => {
    if (!certificateId) return
    try {
      const pageUrl = `${window.location.origin}${window.location.pathname}`
      const returnUrl = `${pageUrl}?certificatePayment=${certificateId}`
      const cancelUrl = `${pageUrl}?certificatePaymentCancelled=${certificateId}`
      const { data } = await createPaymentIntent({
        variables: {
          input: { id: certificateId, returnUrl, cancelUrl },
          locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is,
        },
      })
      const paymentPageUrl =
        data?.healthDirectorateCreateCertificatePaymentIntent?.paymentPageUrl
      if (!paymentPageUrl) {
        throw new Error('Missing paymentPageUrl')
      }
      window.location.href = paymentPageUrl
    } catch {
      toast.error(
        formatMessage(messages.healthConversationCertificatePaymentError),
      )
    }
  }

  const isUnpaid = requiresPayment && !paid

  /*  
    Only an unpaid gated certificate needs payment: once paid (or when
    payment is not required) the attachment row is the download. Without a
    certificateId there is nothing to open a payment intent against or poll 
    (the API's "payable in principle but not yet actionable" state) so render
    nothing there too.
  */
  if (!isUnpaid || !certificateId) {
    return null
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={1}
      marginBottom={3}
      alignItems="flexStart"
      role="status"
      aria-live="polite"
    >
      {isPolling ? (
        <Box display="flex" alignItems="center" columnGap={2}>
          <Button disabled size="small">
            {formatMessage(
              messages.healthConversationCertificatePaymentInProgress,
            )}
          </Button>
          <LoadingDots />
        </Box>
      ) : (
        <Button loading={paymentLoading} onClick={handlePay} size="small">
          {formatMessage(
            messages.healthConversationCertificateContinueToPayment,
          )}
        </Button>
      )}
    </Box>
  )
}

export default CertificateAction
