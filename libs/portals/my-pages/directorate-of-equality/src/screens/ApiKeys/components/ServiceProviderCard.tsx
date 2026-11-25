import { DirectorateOfEqualityServiceProvider } from '@island.is/api/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, formatNationalId } from '@island.is/portals/my-pages/core'

import { messages } from '../../../lib/messages'

export const ServiceProviderCard = ({
  provider,
  onRevoke,
}: {
  provider: DirectorateOfEqualityServiceProvider
  onRevoke: (
    provider: DirectorateOfEqualityServiceProvider,
    trigger: HTMLElement,
  ) => void
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      padding={3}
    >
      <Text variant="h5" as="h3">
        {provider.name}
      </Text>
      <Text marginTop={1}>
        {formatMessage(messages.nationalIdLine, {
          nationalId: formatNationalId(provider.nationalId),
        })}
      </Text>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexEnd"
        flexWrap="wrap"
        columnGap={2}
        rowGap={1}
        marginTop={1}
      >
        <Text>
          {formatMessage(messages.grantedByLine, {
            date: formatDate(provider.grantedAt),
            name: provider.grantedByName ?? '–',
          })}
        </Text>
        <Button
          variant="text"
          size="small"
          colorScheme="destructive"
          aria-label={formatMessage(messages.revokeServiceProviderAriaLabel, {
            name: provider.name,
          })}
          onClick={(event) => onRevoke(provider, event.currentTarget)}
        >
          {formatMessage(messages.revokeServiceProvider)}
        </Button>
      </Box>
    </Box>
  )
}
