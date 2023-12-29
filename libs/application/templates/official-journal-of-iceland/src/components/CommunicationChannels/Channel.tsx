import { Icon, Table as T } from '@island.is/island-ui/core'
import { CommunicationChannel } from '../../fields/PublishingPreferences/PublishingPreferences'

type Props = {
  channel: CommunicationChannel
  onEditChannel: (channel: CommunicationChannel) => void
  onRemoveChannel: (channel: CommunicationChannel) => void
}

export const Channel = ({ channel, onEditChannel, onRemoveChannel }: Props) => {
  return (
    <T.Row>
      <T.Data>{channel.email}</T.Data>
      <T.Data>{channel.phone}</T.Data>
      <T.Data>
        <button type="button" onClick={() => onEditChannel(channel)}>
          <Icon icon="pencil" />
        </button>
      </T.Data>
      <T.Data>
        <button type="button" onClick={() => onRemoveChannel(channel)}>
          <Icon icon="trash" />
        </button>
      </T.Data>
    </T.Row>
  )
}
