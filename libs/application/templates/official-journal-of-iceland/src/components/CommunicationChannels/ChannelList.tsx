import { Table as T } from '@island.is/island-ui/core'
import { CommunicationChannel } from '../../fields/PublishingPrefrences/PublishingPrefrences'
import { Channel } from './Channel'
type Props = {
  channels: CommunicationChannel[]
  onAddChannel: (channel: CommunicationChannel) => void
  onRemoveChannel: (channel: CommunicationChannel) => void
}

export const ChannelList = ({
  channels,
  onAddChannel,
  onRemoveChannel,
}: Props) => {
  if (channels.length === 0) return null

  return (
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
            onAddChannel={onAddChannel}
            onRemoveChannel={onRemoveChannel}
          />
        ))}
      </T.Body>
    </T.Table>
  )
}
