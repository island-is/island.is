import { Box, CategoryCard } from '@island.is/island-ui/core'

// Depending on the status of the card. Need to add props.

const CaseStatusCard = () => {
  return (
    <Box paddingTop={4}>
      <CategoryCard
        heading="Niðurstöður í vinnslu"
        text=" Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Repellat dolorem perspiciatis aperiam. Itaque, ipsa ea.
          Nesciunt labore eveniet, ducimus ullam illo saepe animi. Nemo,
          fugiat? Corrupti rem expedita magni totam."
      />
    </Box>
  )
}

export default CaseStatusCard
