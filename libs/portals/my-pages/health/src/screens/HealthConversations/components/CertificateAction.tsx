import { useEffect, useState } from 'react'
import { Box, Button, Tag, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'
import { messages } from '../../../lib/messages'
import {
  useCreateHealthCertificatePaymentIntentMutation,
  useGetHealthCertificateQuery,
} from '../HealthConversationDetail.generated'

const POLL_INTERVAL_MS = 4000
const POLL_TIMEOUT_MS = 2 * 60 * 1000
const amountFormatter = new Intl.NumberFormat('de-DE')

interface Props {
  certificateId?: string | null
  requiresPayment?: boolean | null
  paid?: boolean | null
  amountIsk?: number | null
  pendingPaymentId?: string | null
  isReturningFromPayment?: boolean
  onPaid: () => void
}

const CertificateAction = ({
  certificateId,
  requiresPayment,
  paid,
  amountIsk,
  pendingPaymentId,
  isReturningFromPayment,
  onPaid,
}: Props) => {
  const { formatMessage, lang } = useLocale()
  const [isPolling, setIsPolling] = useState(
    Boolean(pendingPaymentId || isReturningFromPayment),
  )

  useEffect(() => {
    if (!isPolling) return
    const timeout = setTimeout(() => setIsPolling(false), POLL_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [isPolling])

  const { data: pollData } = useGetHealthCertificateQuery({
    variables: { id: certificateId ?? '' },
    skip: !isPolling || !certificateId,
    pollInterval: isPolling ? POLL_INTERVAL_MS : 0,
    fetchPolicy: 'network-only',
  })

  const pollResult = pollData?.healthDirectorateCertificate

  useEffect(() => {
    if (isPolling && pollResult?.paid) {
      setIsPolling(false)
      onPaid()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling, pollResult?.paid])

  const [createPaymentIntent, { loading: paymentLoading }] =
    useCreateHealthCertificatePaymentIntentMutation()

  if (!requiresPayment && !certificateId) {
    return null
  }

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

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      columnGap={2}
      rowGap={1}
      flexWrap="wrap"
      marginBottom={3}
    >
      <Tag variant="blue" outlined disabled>
        {formatMessage(messages.healthConversationCertificateTag)}
      </Tag>

      {isUnpaid && isPolling && (
        <Tag variant="yellow" outlined disabled>
          {formatMessage(
            messages.healthConversationCertificatePaymentInProgress,
          )}
        </Tag>
      )}

      {isUnpaid && !isPolling && certificateId && (
        <>
          <Tag variant="red" outlined disabled>
            {formatMessage(
              messages.healthConversationCertificatePaymentPending,
            )}
          </Tag>
          <Button
            variant="utility"
            icon="card"
            iconType="outline"
            loading={paymentLoading}
            onClick={handlePay}
          >
            {amountIsk
              ? formatMessage(messages.healthConversationCertificatePay, {
                  arg: amountFormatter.format(amountIsk),
                })
              : formatMessage(
                  messages.healthConversationCertificatePayNoAmount,
                )}
          </Button>
        </>
      )}

      {isUnpaid && !isPolling && !certificateId && (
        <Tag variant="red" outlined disabled>
          {formatMessage(messages.healthConversationCertificatePaymentPending)}
        </Tag>
      )}
    </Box>
  )
}

export default CertificateAction
