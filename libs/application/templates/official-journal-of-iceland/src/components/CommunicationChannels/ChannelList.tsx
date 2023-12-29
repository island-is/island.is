import { Box, Table as T } from '@island.is/island-ui/core'
import { CommunicationChannel } from '../../fields/PublishingPreferences/PublishingPreferences'
import { Channel } from './Channel'

import * as styles from './ChannelList.css'
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
  if (channels.length === 0) return null

  return (
    <Box className={styles.tableWrap}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Email</T.HeadData>
            <T.HeadData>Phone</T.HeadData>
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
