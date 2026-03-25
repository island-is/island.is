import { Box, Icon, Text } from '@island.is/island-ui/core'
import { useDelegationForm } from '../context'

export const RecipientsTag = () => {
  const { identities } = useDelegationForm()

  // if there are more than 4 identities, only display the first 4
  const identitiesToDisplay =
    identities.length > 4 ? identities.slice(0, 4) : identities

  const displayedNames =
    identities.length === 1
      ? identities[0].name
      : identitiesToDisplay
          .map((identity) => identity.name.split(' ')[0])
          .join(', ')
  // if there are more than 4 identities, display the number of additional identities
  const morePeople = identities.length > 4 ? ` +${identities.length - 4}` : ''

  return (
    <Box
      display="flex"
      columnGap={1}
      background="blue100"
      padding={1}
      borderRadius="large"
      marginBottom={4}
    >
      <Box display="flex" alignItems="center">
        <Icon size="small" color="blue400" type="outline" icon="person" />
        <Icon size="small" color="blue400" icon="arrowForward" />
      </Box>
      <Text variant="h5">
        {displayedNames}
        {morePeople}
      </Text>
    </Box>
  )
}
