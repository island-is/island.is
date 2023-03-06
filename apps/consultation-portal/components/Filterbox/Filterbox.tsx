import { Box, Button, Inline, Stack, Text } from '@island.is/island-ui/core'

export const FilterBox = ({ children }) => {
  return (
    <Box
      borderColor="blue200"
      borderRadius="standard"
      borderWidth="standard"
      padding={2}
    >
      <Stack space={2}>
        <Inline justifyContent="spaceBetween">
          <Text variant="h3">{children}</Text>
          <Button colorScheme="light" circle icon="add" title="Opna" />
        </Inline>
      </Stack>
    </Box>
  )
}

export default FilterBox
