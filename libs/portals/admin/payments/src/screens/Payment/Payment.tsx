import { useLoaderData, useNavigate } from 'react-router-dom'
import format from 'date-fns/format'

import { formatNationalId } from '@island.is/portals/core'
import {
  Box,
  Stack,
  Text,
  Tag,
  Table as T,
  Icon,
  TagVariant,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { BackButton } from '@island.is/portals/admin/core'

import { m } from '../../lib/messages'
import { GetPaymentQueryResult } from './Payment.loader'

import { PaymentsPaymentFlowEventType } from '@island.is/api/schema'
import { getPaymentStatusTag } from '../../utils/paymentStatusTag'
import { PaymentsPaths } from '../../lib/paths'

const Payment = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const paymentFlow = useLoaderData() as GetPaymentQueryResult
  const formattedNationalId = formatNationalId(paymentFlow.payerNationalId)

  const getEventTypeTagVariant = (
    eventType: string,
  ): { variant: TagVariant; message: string | undefined } => {
    switch (eventType) {
      case PaymentsPaymentFlowEventType.create:
        return { variant: 'blue', message: formatMessage(m.create) }
      case PaymentsPaymentFlowEventType.update:
        return { variant: 'blue', message: formatMessage(m.update) }
      case PaymentsPaymentFlowEventType.deleted:
        return { variant: 'red', message: formatMessage(m.deleted) }
      case PaymentsPaymentFlowEventType.error:
        return { variant: 'red', message: formatMessage(m.error) }
      case PaymentsPaymentFlowEventType.success:
        return { variant: 'mint', message: formatMessage(m.success) }
      default:
        return { variant: 'blue', message: formatMessage(m.update) }
    }
  }

  const statusTag = getPaymentStatusTag(
    paymentFlow.paymentStatus,
    formatMessage,
  )

  return (
    <Stack space="containerGutter">
      <BackButton onClick={() => navigate(PaymentsPaths.Payments)} />

      <GridRow marginBottom={4}>
        <GridColumn span={['8/8', '5/8']}>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Box marginRight={2}>
              <Text variant="h3" as="h1">
                {paymentFlow.productTitle}
              </Text>
            </Box>
            <Tag variant={statusTag.variant} outlined>
              {statusTag.message}
            </Tag>
          </Box>
          <Box display="flex" alignItems="center">
            <Icon icon="person" color="blue400" type="outline" size="small" />
            <Box paddingLeft={1} />
            <Text variant="default">
              {formatMessage(m.payer, {
                name: paymentFlow.payerName,
                nationalId: formattedNationalId,
              })}
            </Text>
          </Box>
        </GridColumn>
      </GridRow>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="default" fontWeight="semiBold">
                {formatMessage(m.date)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="default" fontWeight="semiBold">
                {formatMessage(m.time)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="default" fontWeight="semiBold">
                {formatMessage(m.info)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="default" fontWeight="semiBold">
                {formatMessage(m.type)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {paymentFlow.events
            ?.slice()
            .sort(
              (a, b) =>
                new Date(a.occurredAt).getTime() -
                new Date(b.occurredAt).getTime(),
            )
            .map((event) => {
              const eventTypeTag = getEventTypeTagVariant(event.type)
              return (
                <T.Row key={event.id}>
                  <T.Data>
                    <Text variant="default">
                      {format(new Date(event.occurredAt), 'd.M.yyyy')}
                    </Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="default">
                      {format(new Date(event.occurredAt), 'HH:mm:ss')}
                    </Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="default">{event.message}</Text>
                  </T.Data>
                  <T.Data>
                    <Tag variant={eventTypeTag.variant}>
                      {eventTypeTag.message}
                    </Tag>
                  </T.Data>
                </T.Row>
              )
            })}
        </T.Body>
      </T.Table>
    </Stack>
  )
}

export default Payment
