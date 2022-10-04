import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const DelegationsEmptyState = () => {
  const { formatMessage } = useLocale()
  return (
    <Box
      marginTop={12}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      rowGap={10}
    >
      <Text>
        {formatMessage({
          id: 'sp.access-control-delegations:empty',
          defaultMessage: 'Þegar þú hefur veitt öðrum umboð birtast þau hér.',
        })}
      </Text>
      <div>
        <img src="./assets/images/educationDegree.svg" alt="" />
      </div>
    </Box>
  )
}
