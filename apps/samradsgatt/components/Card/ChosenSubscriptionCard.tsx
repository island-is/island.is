import { Box, Checkbox, Text } from '@island.is/island-ui/core'

const ChosenSubscriptionCard = ({
  casesData,
  institutionsData,
  policyAreasData,
  subscriptionArray,
}) => {
  console.log('data', policyAreasData)
  console.log('subscriptionArray', subscriptionArray)

  return (
    <Box paddingX={[0, 0, 0, 0]}>
      <Text variant="eyebrow">Valin mál</Text>
      <Box
        borderColor={'blue400'}
        borderRadius="large"
        borderWidth="standard"
        background="white"
        paddingX={3}
        paddingY={3}
        rowGap={3}
      >
        <Box display="flex" flexDirection="row">
          <Checkbox checked={true} onChange={(e) => {}} />
          <Text>Name</Text>
          <Text>Label</Text>
        </Box>
      </Box>
    </Box>
  )
}

export default ChosenSubscriptionCard
