import { Icon, Table as T } from '@island.is/island-ui/core'

export type Channel = {
  email: string
  phone: string
}

type Props = {
  channel: Channel
  onEditChannel: (channel: Channel) => void
  onRemoveChannel: (channel: Channel) => void
}

export const Channel = ({ channel, onEditChannel, onRemoveChannel }: Props) => {
  return (
    <T.Row>
      <T.Data>{channel.email}</T.Data>
      <T.Data>{channel.phone}</T.Data>
      <T.Data style={{ paddingInline: 0 }} align="center" width={1}>
        <button type="button" onClick={() => onEditChannel(channel)}>
          <Icon color="blue400" icon="pencil" />
        </button>
      </T.Data>
      <T.Data style={{ paddingInline: 0 }} align="center" width={1}>
        <button type="button" onClick={() => onRemoveChannel(channel)}>
          <Icon color="blue400" icon="trash" />
        </button>
      </T.Data>
    </T.Row>
  )
}
