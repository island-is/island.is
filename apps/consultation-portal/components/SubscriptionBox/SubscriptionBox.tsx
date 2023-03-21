import { Box, Text, Input, Button, Stack } from '@island.is/island-ui/core'

export const SubscriptionBox = () => {
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
      <Stack space={2}>
        <Text variant="h3">Skrá áskrift</Text>
        <Text variant="default">
          Skráðu þig í áskrift af þessu máli. Þú færð tölvupóst til
          staðfestingar.
        </Text>
        <form>
          <Input
            label="Netfang"
            name="email"
            placeholder="Hér skal skrifa netfang"
            size="sm"
          />
          <Box paddingTop={2}>
            <Button fluid icon="open" iconType="outline" nowrap>
              Skrá áskrift
            </Button>
          </Box>
        </form>
      </Stack>
    </Box>
  )
}

export default SubscriptionBox
