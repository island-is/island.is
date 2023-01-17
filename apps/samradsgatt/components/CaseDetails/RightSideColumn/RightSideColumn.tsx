import { Box, CategoryCard } from '@island.is/island-ui/core'

import { Case } from '../../../types/viewModels'

interface RightSideColumnProps {
  detailedCase?: Case
}

const RightSideColumn: React.FC<RightSideColumnProps> = ({ detailedCase }) => {
  const contactName = 'Skrifstofa sveitarfélaga og byggðamála'
  const contactEmail = 'irn@irn.is'
  return (
    <Box paddingY={8}>
      <Box padding={3}>
        <CategoryCard
          heading="Skjöl til samráðs"
          text="Lorem ipsum..."
          // text={detailedCase.shortDescription}
        />
      </Box>
      <Box padding={3}>
        <CategoryCard
          heading="Aðillar sem hafa fengið boð um samráð á máli."
          text="Lorem ipsum......."
        />
      </Box>
      <Box padding={3}>
        <CategoryCard
          heading="Ábyrgðaraðilli"
          text={`${contactName}` + ` ` + `${contactEmail}`}
        />
      </Box>
    </Box>
  )
}

export default RightSideColumn
