import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

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
      <Text>
        {formatMessage({
          id: 'sp.access-control-delegations:empty',
          defaultMessage: 'Umboð sem þú hefur veitt öðrum munu birtast hér.',
        })}
      </Text>
      <div>
        <img
          src="./assets/images/educationDegree.svg"
          alt={formatMessage({
            id: 'sp.access-control-delegations:empty-image-alt',
            defaultMessage: 'Mynd af handarbandi',
          })}
        />
      </div>
    </Box>
  )
}
