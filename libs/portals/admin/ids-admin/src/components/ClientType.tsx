import { Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { AuthAdminClient } from '../screens/Client/Client.loader'
import { m } from '../lib/messages'

const typeMessages = {
  web: m.webClientsTitle,
  native: m.nativeClientsTitle,
  machine: m.machineClientsTitle,
  spa: m.spaClientsTitle,
}

interface Props {
  client: { clientType: AuthAdminClient['clientType'] }
}

export const ClientType = ({ client }: Props) => {
  const { formatMessage } = useLocale()
  const clientType = client.clientType as keyof typeof typeMessages
  const clientTypeTitle = typeMessages[clientType]
    ? formatMessage(typeMessages[clientType])
    : client.clientType

  return (
    <Tag outlined disabled>
      {clientTypeTitle}
    </Tag>
  )
}
