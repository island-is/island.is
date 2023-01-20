import { Box, CategoryCard } from '@island.is/island-ui/core'

const RightSideColumn = () => {
  return (
    <Box paddingY={8}>
      <Box padding={3}>
        <CategoryCard heading="Skjöl til samráðs" text="Lorem ipsum......." />
      </Box>
      <Box padding={3}>
        <CategoryCard
          heading="Aðillar sem hafa fengið boð um samráð á máli."
          text="Lorem ipsum......."
        />
      </Box>
      <Box padding={3}>
        <CategoryCard heading="Ábyrgðaraðilli" text="Lorem ipsum......." />
      </Box>
    </Box>
  )
}

export default RightSideColumn
