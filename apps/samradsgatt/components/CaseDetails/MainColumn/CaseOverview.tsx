import { Box, GridRow, Text } from '@island.is/island-ui/core'
import CaseStatusCard from './CaseStatusCard'

const CaseOverview = () => {
  return (
    <Box>
      <GridRow>
        <Box
          marginRight={1}
          borderRightWidth={'standard'}
          borderColor={'purple300'}
          paddingRight={1}
          paddingLeft={2}
        >
          <Text variant="eyebrow" color="purple400">
            {'Malanumer#'}
          </Text>
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple400">
            {'Dagsetning#'}
          </Text>
        </Box>
      </GridRow>
      <GridRow marginTop={3}>
        <Box
          marginRight={1}
          borderRightWidth={'standard'}
          borderColor={'blue200'}
          paddingRight={1}
          paddingLeft={2}
        >
          {' '}
          <Text variant="eyebrow" color="blue400">
            {'Tag1'}
          </Text>
        </Box>
        <Box
          marginRight={2}
          borderRightWidth={'standard'}
          borderColor={'blue200'}
          paddingRight={1}
        >
          {' '}
          <Text variant="eyebrow" color="blue400">
            {'Tag2'}
          </Text>
        </Box>
        <Text variant="eyebrow" color="blue400">
          {'Tag3'}
        </Text>
      </GridRow>
      <Box marginBottom={4} paddingTop={2}>
        <Text variant="h1" color="blue400">
          {'Titill máls'}
        </Text>
        <CaseStatusCard />
        <Box marginBottom={6} marginTop={4}>
          <Text variant="h4">{'Málsefni'}</Text>
          <Text variant="default">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
            dolorem perspiciatis aperiam. Itaque, ipsa ea. Nesciunt labore
            eveniet, ducimus ullam illo saepe animi. Nemo, fugiat? Corrupti rem
            expedita magni totam.
          </Text>
        </Box>
        <Box>
          <Text variant="h4">{'Nánar um málið'}</Text>
          <Text variant="default">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
            dolorem perspiciatis aperiam. Itaque, ipsa ea. Nesciunt labore
            eveniet, ducimus ullam illo saepe animi. Nemo, fugiat? Corrupti rem
            expedita magni totam.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default CaseOverview
