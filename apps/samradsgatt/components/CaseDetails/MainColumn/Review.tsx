import { Box, Text } from '@island.is/island-ui/core'

const Review = () => {
  return (
    <Box
      marginBottom={6}
      borderColor="blue300"
      borderWidth="standard"
      padding={3}
      borderStyle="solid"
      borderRadius="standard"
    >
      <Text variant="eyebrow" color="purple400">
        {'#Dagsetning'}
      </Text>
      <Text variant="h3">{'Umsagnaradili#'}</Text>
      <Text variant="default">
        {' '}
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
        dolorem perspiciatis aperiam. Itaque, ipsa ea. Nesciunt labore eveniet,
        ducimus ullam illo saepe animi. Nemo, fugiat? Corrupti rem expedita
        magni totam.
      </Text>
    </Box>
  )
}

export default Review
