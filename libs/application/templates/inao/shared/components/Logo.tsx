import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { MessageDescriptor } from 'react-intl'

type Props = {
  serviceProvider?: MessageDescriptor
  inao?: MessageDescriptor
}

export const Logo = ({ serviceProvider, inao }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="eyebrow" as="p" color="purple600">
        {serviceProvider ? formatMessage(serviceProvider) : 'Ríkisendurskoðun'}
      </Text>
      <Text variant="h3" as="p" color="purple600">
        {inao ? formatMessage(inao).toUpperCase() : 'RÍKISENDURSKOÐUN'}
      </Text>
    </Box>
  )
}
