import { Box, CategoryCard } from '@island.is/island-ui/core'

import { Case } from '../../../types/viewModels'

interface RightSideColumnProps {
  chosenCase?: Case
}

const RightSideColumn: React.FC<RightSideColumnProps> = ({ chosenCase }) => {
  return (
    <Box paddingY={8}>
      <Box padding={3}>
        <CategoryCard
          heading="Skjöl til samráðs"
          text={chosenCase.shortDescription} // TODO change size from 18 to 16
        />
      </Box>
      <Box padding={3}>
        <CategoryCard
          heading="Aðillar sem hafa fengið boð um samráð á máli."
          text="Lorem ipsum......." // TODO
        />
      </Box>
      <Box padding={3}>
        <CategoryCard
          heading="Ábyrgðaraðili"
          text={
            `${chosenCase.contactName}` + ` ` + `${chosenCase.contactEmail}`
          }
        />
      </Box>
    </Box>
  )
}

export default RightSideColumn
