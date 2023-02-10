import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'

const ChosenSubscriptionCard = ({
  casesData,
  institutionsData,
  policyAreasData,
  subscriptionArray,
}) => {
  const [subscriptionsSelected, setSubscriptionsSelected] = useState(false)

  useEffect(() => {
    if (
      subscriptionArray.caseIds.length === 0 &&
      subscriptionArray.institutionIds.length === 0 &&
      subscriptionArray.policyAreaIds.length === 0
    ) {
      setSubscriptionsSelected(false)
      return
    } else {
      setSubscriptionsSelected(true)


      
    }
  }, [subscriptionArray])

  console.log('subscriptionsSelected', subscriptionsSelected)

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
