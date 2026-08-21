import { useQuery } from '@apollo/client'

import { Box, GridContainer, Stack, Text } from '@island.is/island-ui/core'
import { Calculator } from '@island.is/web/components'
import { GetCalculatorMocksQuery } from '@island.is/web/graphql/schema'
import { GET_CALCULATOR_MOCKS } from '@island.is/web/screens/queries/CalculatorMocks'
import { Screen } from '@island.is/web/types'

// TEMPORARY — verifies the generic Calculator slice end-to-end against
// mocked Contentful data (see calculatorMocks in apps/api/src/api.graphql
// and calculator.mock.ts in libs/cms) before the `calculator` content type
// exists in Contentful. Delete this screen, its page, and the mock
// query/resolver/fixtures together once real entries are reachable through
// the normal SliceUnion/richtext embedding path.
const CalculatorPoc: Screen = () => {
  const { data, loading, error } = useQuery<GetCalculatorMocksQuery>(
    GET_CALCULATOR_MOCKS,
  )

  const mocks = data?.calculatorMocks ?? []

  return (
    <GridContainer>
      <Box paddingY={6}>
        <Stack space={6}>
          <Text variant="h1" as="h1">
            Calculator PoC — mocked Contentful data
          </Text>
          {loading && <Text>Loading…</Text>}
          {error && <Text color="red600">Failed to load mocks.</Text>}
          {mocks.map((mock) => (
            <Calculator key={mock.id} slice={mock} />
          ))}
        </Stack>
      </Box>
    </GridContainer>
  )
}

CalculatorPoc.getProps = async () => ({})

export default CalculatorPoc
