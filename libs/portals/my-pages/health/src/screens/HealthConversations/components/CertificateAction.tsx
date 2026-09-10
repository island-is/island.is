import { useEffect, useState } from 'react'
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

interface CertificateCardProps {
  icon: IconMapIcon
  heading?: string | null
  subText: string
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
        <Text color="dark400">{subText}</Text>
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
  pendingPaymentId?: string | null
  isReturningFromPayment?: boolean
  fileName?: string | null
  downloadServiceURL?: string | null
  onPaid: () => void
}

const CertificateAction = ({
  certificateId,
  requiresPayment,
  paid,
  amountIsk,
  pendingPaymentId,
  isReturningFromPayment,
  fileName,
  downloadServiceURL,
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
        data?.healthDirectorateCreateCertificatePaymentIntent.paymentPageUrl
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
          subText={formatMessage(
            messages.healthConversationCertificateLockedStatus,
            { amount: amountFormat(amountIsk) },
          )}
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
          subText={formatMessage(
            messages.healthConversationCertificatePaidStatus,
          )}
          cta={{
            label: formatMessage(messages.healthConversationCertificateOpen),
            onClick: () => downloadServiceURL && formSubmit(downloadServiceURL),
          }}
        />
      )}
    </Box>
  )
}

export default CertificateAction
