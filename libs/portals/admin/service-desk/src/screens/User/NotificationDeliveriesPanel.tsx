import format from 'date-fns/format'

import {
  Box,
  LoadingDots,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { NotificationChannel } from '@island.is/api/schema'
import { Problem } from '@island.is/react-spa/shared'
import { isValidDate } from '@island.is/shared/utils'

import { m } from '../../lib/messages'
import { CopyCell } from './CopyCell'
import { useGetAdminNotificationDeliveriesQuery } from './User.generated'
import * as styles from './NotificationDeliveriesPanel.css'

interface Props {
  notificationId: number
  isActor: boolean
}

const channelVariant: Record<NotificationChannel, 'blue' | 'purple' | 'mint'> =
  {
    [NotificationChannel.EMAIL]: 'blue',
    [NotificationChannel.SMS]: 'purple',
    [NotificationChannel.PUSH]: 'mint',
  }

export const NotificationDeliveriesPanel = ({
  notificationId,
  isActor,
}: Props) => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useGetAdminNotificationDeliveriesQuery({
    variables: { input: { notificationId, isActor } },
    fetchPolicy: 'cache-first',
  })

  const deliveries = data?.adminNotificationDeliveries ?? []

  return (
    <>
      {error ? (
        <Box padding={3}>
          <Problem error={error} />
        </Box>
      ) : loading ? (
        <Box padding={3} display="flex" justifyContent="center">
          <LoadingDots />
        </Box>
      ) : deliveries.length === 0 ? (
        <Box padding={3}>
          <Text variant="small" color="dark400">
            {formatMessage(m.notificationDeliveriesEmpty)}
          </Text>
        </Box>
      ) : (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData text={{ variant: 'eyebrow' }}>
                {formatMessage(m.deliveryChannel)}
              </T.HeadData>
              <T.HeadData text={{ variant: 'eyebrow' }}>
                {formatMessage(m.deliverySentTo)}
              </T.HeadData>
              <T.HeadData text={{ variant: 'eyebrow' }}>
                {formatMessage(m.deliveryCreated)}
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {deliveries.map((delivery) => (
              <T.Row key={delivery.id}>
                <T.Data>
                  <Tag
                    variant={channelVariant[delivery.channel] ?? 'blue'}
                    outlined
                    disabled
                  >
                    {delivery.channel}
                  </Tag>
                </T.Data>
                <T.Data>
                  <CopyCell
                    value={delivery.sentTo}
                    maxWidth={
                      delivery.channel === NotificationChannel.PUSH ? 260 : 320
                    }
                  />
                </T.Data>
                <T.Data>
                  {delivery.created && isValidDate(new Date(delivery.created))
                    ? format(new Date(delivery.created), 'dd.MM.yyyy HH:mm')
                    : ''}
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}
      <Box className={styles.footer} />
    </>
  )
}
