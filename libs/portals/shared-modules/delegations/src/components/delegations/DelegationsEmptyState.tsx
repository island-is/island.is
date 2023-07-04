import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const DelegationsEmptyState = () => {
  const { formatMessage } = useLocale()

  return (
    <Box
      marginTop={[4, 12]}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      rowGap={[6, 10]}
      data-testid={'delegations-empty-state'}
    >
      <Text>{formatMessage(m.noDelegations)}</Text>
      <div>
        <img
          src="./assets/images/educationDegree.svg"
          alt={formatMessage(m.noDelegationsImageAlt)}
        />
      </div>
    </Box>
  )
}
