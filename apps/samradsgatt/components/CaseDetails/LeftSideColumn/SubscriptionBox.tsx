import { Box, Text } from '@island.is/island-ui/core'

const SubscriptionBox = () => {
  return (
    <Box
      marginBottom={6}
      borderColor="blue300"
      borderWidth="standard"
      padding={3}
      borderStyle="solid"
      borderRadius="standard"
    >
      <Text variant="h3">{'Skrá áskrift'}</Text>
      <Text variant="default">
        {''} Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
        exercitationem placeat necessitatibus.....
      </Text>
      <form>{/* <InputController></InputController> */}</form>
    </Box>
  )
}

export default SubscriptionBox
