import { Box, Text, Input, Button, Icon } from '@island.is/island-ui/core'

// Form context
// Input

const SubscriptionBox = () => {
  return (
    <Box
      borderColor="blue300"
      borderWidth="standard"
      paddingX={3}
      paddingTop={3}
      paddingBottom={2}
      borderStyle="solid"
      borderRadius="standard"
    >
      <Text variant="h3">{'Skrá áskrift'}</Text>
      <Text variant="default">
        {''} Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
        exercitationem placeat necessitatibus.....
      </Text>
      <Box paddingTop={2} paddingBottom={1}>
        <form>
          <Input
            label="Netfang"
            name="email"
            placeholder="Hér skal skrifa netfang"
            size="sm"
          />
          <Box paddingTop={1}>
            <Button fluid>
              <Box display="flex" marginRight={1}>
                <Text color="white" fontWeight="semiBold">
                  {' '}
                  Skrá áskrift
                </Text>
              </Box>
              <Box paddingLeft={10}>
                <Icon icon="open" type="outline"></Icon>
              </Box>
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default SubscriptionBox
