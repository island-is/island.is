import { Box, Table as T } from '@island.is/island-ui/core'
import { Channel } from './Channel'
import { useLocale } from '@island.is/localization'
import { general } from '../../lib/messages'
import * as styles from './ChannelList.css'
import { CommunicationChannel } from './CommunicationChannels'
type Props = {
  channels: CommunicationChannel[]
  onEditChannel: (channel: CommunicationChannel) => void
  onRemoveChannel: (channel: CommunicationChannel) => void
}

export const ChannelList = ({
  channels,
  onEditChannel,
  onRemoveChannel,
}: Props) => {
  const { formatMessage } = useLocale()
  if (channels.length === 0) return null

  return (
    <Box className={styles.tableWrap}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(general.email)}</T.HeadData>
            <T.HeadData>{formatMessage(general.phoneNumber)}</T.HeadData>
            <T.HeadData></T.HeadData>
            <T.HeadData></T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {channels.map((channel, i) => (
            <Channel
              key={i}
              channel={channel}
              onEditChannel={onEditChannel}
              onRemoveChannel={onRemoveChannel}
            />
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
