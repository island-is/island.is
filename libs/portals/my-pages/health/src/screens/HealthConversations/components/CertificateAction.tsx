import { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'
import {
  Box,
  Button,
  Icon,
  IconMapIcon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'
import { amountFormat, formSubmit } from '@island.is/portals/my-pages/core'
import { messages } from '../../../lib/messages'
import * as styles from '../HealthConversations.css'
import {
  useCreateHealthCertificatePaymentIntentMutation,
  useGetHealthCertificateQuery,
} from '../HealthConversationDetail.generated'

const POLL_INTERVAL_MS = 4000
const POLL_TIMEOUT_MS = 2 * 60 * 1000
// How long after the patient opened a payment intent we treat it as possibly
// in flight (matches the server's old intent TTL). Older intents are assumed
// abandoned — the server has no time bound of its own.
const PENDING_INTENT_WINDOW_MS = 10 * 60 * 1000

const getPaymentErrorCode = (error: unknown): string | undefined => {
  if (!(error instanceof ApolloError)) return undefined
  const problem = error.graphQLErrors[0]?.extensions?.problem as
    | { errorCode?: string }
    | undefined
  return problem?.errorCode
}

const useCertificatePaymentPolling = ({
  certificateId,
  pendingPaymentStartedAt,
  isReturningFromPayment,
  onPaid,
}: Pick<
  Props,
  | 'certificateId'
  | 'pendingPaymentStartedAt'
  | 'isReturningFromPayment'
  | 'onPaid'
>) => {
  const [isReturnPolling, setIsReturnPolling] = useState(
    Boolean(isReturningFromPayment),
  )
  const [, setExpiryTick] = useState(0)

  // An intent opened recently may still get a payment callback; an old one is
  // an abandoned attempt the patient can simply resume, so it must never
  // block the Pay button.
  const startedAtMs = pendingPaymentStartedAt
    ? new Date(pendingPaymentStartedAt).getTime()
    : undefined
  const hasFreshIntent =
    startedAtMs !== undefined &&
    Date.now() - startedAtMs < PENDING_INTENT_WINDOW_MS

  // Re-render when the intent window expires so the loader reverts to Pay.
  useEffect(() => {
    if (startedAtMs === undefined) return
    const delay = startedAtMs + PENDING_INTENT_WINDOW_MS - Date.now()
    if (delay <= 0) return
    const timeout = setTimeout(() => setExpiryTick((n) => n + 1), delay)
    return () => clearTimeout(timeout)
  }, [startedAtMs])

  const isPolling = isReturnPolling || hasFreshIntent

  useEffect(() => {
    if (!isReturnPolling) return
    const timeout = setTimeout(() => setIsReturnPolling(false), POLL_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [isReturnPolling])

  const { data: pollData } = useGetHealthCertificateQuery({
    variables: { id: certificateId ?? '' },
    skip: !isPolling || !certificateId,
    pollInterval: isPolling ? POLL_INTERVAL_MS : 0,
    fetchPolicy: 'network-only',
  })

  const paid = pollData?.healthDirectorateCertificate?.paid

  useEffect(() => {
    if (isPolling && paid) {
      setIsReturnPolling(false)
      onPaid()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling, paid])

  return isPolling
}

interface CertificateCardProps {
  icon: IconMapIcon
  heading?: string | null
  subText?: string
  cta: {
    label: string
    onClick: () => void
    disabled?: boolean
    loading?: boolean
  }
}

const CertificateCard = ({
  icon,
  heading,
  subText,
  cta,
}: CertificateCardProps) => (
  <Box
    display="flex"
    flexDirection={['column', 'row']}
    alignItems={['stretch', 'center']}
    borderColor="blue200"
    borderWidth="standard"
    borderRadius="large"
    background="white"
    paddingX={[3, 3, 4]}
    paddingY={3}
    rowGap={3}
  >
    <Box display="flex" alignItems="center" columnGap={2} flexGrow={1}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexShrink={0}
        borderRadius="full"
        background="blue100"
        className={styles.certificateAvatar}
      >
        <Icon icon={icon} type="outline" color="blue400" ariaHidden />
      </Box>
      <Box>
        {heading && (
          <Text variant="h4" color="dark400">
            {heading}
          </Text>
        )}
        {subText && <Text color="dark400">{subText}</Text>}
      </Box>
    </Box>
    <Box flexShrink={0} marginLeft={[0, 0, 5]}>
      <Button
        size="small"
        fluid
        onClick={cta.onClick}
        disabled={cta.disabled}
        loading={cta.loading}
      >
        {cta.label}
      </Button>
    </Box>
  </Box>
)

interface Props {
  certificateId?: string | null
  requiresPayment?: boolean | null
  paid?: boolean | null
  amountIsk?: number | null
  pendingPaymentStartedAt?: Date | string | null
  isReturningFromPayment?: boolean
  fileName?: string | null
  downloadServiceURL?: string | null
  onPaid: () => void
  onRefresh: () => void
}

const CertificateAction = ({
  certificateId,
  requiresPayment,
  paid,
  amountIsk,
  pendingPaymentStartedAt,
  isReturningFromPayment,
  fileName,
  downloadServiceURL,
  onPaid,
  onRefresh,
}: Props) => {
  const { formatMessage, lang } = useLocale()
  const isPolling = useCertificatePaymentPolling({
    certificateId,
    pendingPaymentStartedAt,
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
        data?.healthDirectorateCreateCertificatePaymentIntent.paymentPageUrl
      if (!paymentPageUrl) {
        throw new Error('Missing paymentPageUrl')
      }
      window.location.href = paymentPageUrl
    } catch (error) {
      const errorCode = getPaymentErrorCode(error)
      if (errorCode === 'ALREADY_PAID') {
        // Paid all along (e.g. a late payment callback) — not a failure.
        onPaid()
        return
      }
      if (errorCode === 'NOT_PAYABLE') {
        // The certificate no longer costs anything; refetching unlocks it.
        onRefresh()
        return
      }
      toast.error(
        formatMessage(messages.healthConversationCertificatePaymentError),
      )
    }
  }

  const isUnpaid = requiresPayment && !paid

  // Without a certificateId there is nothing to open a payment intent
  // against, poll, or download — nothing renders in that case.
  if (!certificateId) {
    return null
  }

  return (
    <Box marginBottom={3} role="status" aria-live="polite">
      {isUnpaid ? (
        <CertificateCard
          icon="lockClosed"
          heading={fileName}
          subText={
            typeof amountIsk === 'number'
              ? formatMessage(
                  messages.healthConversationCertificateLockedStatus,
                  { amount: amountFormat(amountIsk) },
                )
              : formatMessage(
                  messages.healthConversationCertificateLockedStatusNoAmount,
                )
          }
          cta={
            isPolling
              ? {
                  label: formatMessage(
                    messages.healthConversationCertificatePaymentInProgress,
                  ),
                  disabled: true,
                  loading: true,
                  onClick: () => null,
                }
              : {
                  label: formatMessage(
                    messages.healthConversationCertificateContinueToPayment,
                  ),
                  loading: paymentLoading,
                  onClick: handlePay,
                }
          }
        />
      ) : (
        <CertificateCard
          icon="document"
          heading={fileName}
          subText={
            requiresPayment && paid
              ? formatMessage(messages.healthConversationCertificatePaidStatus)
              : undefined
          }
          cta={{
            label: formatMessage(messages.healthConversationCertificateOpen),
            disabled: !downloadServiceURL,
            onClick: () => downloadServiceURL && formSubmit(downloadServiceURL),
          }}
        />
      )}
    </Box>
  )
}

export default CertificateAction
