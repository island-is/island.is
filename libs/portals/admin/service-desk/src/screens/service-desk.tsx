import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

const ServiceDesk = () => {
  const { formatMessage } = useLocale()
  return <Text variant={'h1'}>{formatMessage(m.serviceDesk)}</Text>
}

export default ServiceDesk
