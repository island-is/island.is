import { useQuery } from '@apollo/client'

import { SliceType } from '@island.is/island-ui/contentful'
import { Box, GridContainer, Stack, Text } from '@island.is/island-ui/core'
import { GetCalculatorMocksQuery } from '@island.is/web/graphql/schema'
import { GET_CALCULATOR_MOCKS } from '@island.is/web/screens/queries/CalculatorMocks'
import { Screen } from '@island.is/web/types'
import { webRichText } from '@island.is/web/utils/richText'

// TEMPORARY — verifies the generic Calculator slice end-to-end against
// mocked Contentful data (see calculatorMocks in apps/api/src/api.graphql
// and calculator.mock.ts in libs/cms) before the `calculator` content type
// exists in Contentful. Renders the mocks through the same `webRichText`
// dispatch every real article body uses -- not a bespoke wrapper -- so this
// actually exercises the production Calculator case in richText.tsx.
// Delete this screen, its page, and the mock query/resolver/fixtures
// together once real entries are reachable through normal slice embedding.
const CalculatorPoc: Screen = () => {
  const { data, loading, error } = useQuery<GetCalculatorMocksQuery>(
    GET_CALCULATOR_MOCKS,
  )

  const mocks = data?.calculatorMocks ?? []

  return (
    <GridContainer>
      <Box paddingY={6} className="rs_read">
        <Stack space={4}>
          <Text variant="h1" as="h1">
            Reiknivélar Skattsins
          </Text>
          <Text variant="intro">
            Dæmi um grein sem inniheldur reiknivélar (mocked Contentful data,
            rendered via webRichText -- the same path a real article body
            uses).
          </Text>
          {loading && <Text>Loading…</Text>}
          {error && <Text color="red600">Failed to load mocks.</Text>}
          {webRichText(mocks as unknown as SliceType[])}
        </Stack>
      </Box>
    </GridContainer>
  )
}

CalculatorPoc.getProps = async () => ({})

export default CalculatorPoc
