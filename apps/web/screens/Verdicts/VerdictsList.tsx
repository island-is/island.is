import { parseAsString, useQueryState } from 'next-usequerystate'

import {
  Box,
  Divider,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  GetVerdictsQuery,
  GetVerdictsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'

import { GET_VERDICTS_QUERY } from '../queries/Verdicts'

interface VerdictsListProps {
  items: GetVerdictsQuery['webVerdicts']['items']
}

const VerdictsList: Screen<VerdictsListProps> = ({ items }) => {
  const { format } = useDateUtils()

  const [searchTerm, setSearchTerm] = useQueryState(
    'q',
    parseAsString
      .withOptions({
        clearOnDefault: true,
        shallow: false,
      })
      .withDefault(''),
  )

  return (
    <Box paddingBottom={5}>
      <GridContainer>
        <Stack space={3}>
          <Text variant="h1" as="h1">
            Dómar og úrskurðir
          </Text>
          <Text>Dómar frá öllum dómstigum á Íslandi</Text>
          <Input
            value={searchTerm}
            onChange={(ev) => {
              setSearchTerm(ev.target.value)
            }}
            name="verdict-search-input"
            backgroundColor="blue"
            placeholder="Sláðu inn orð, málsnúmer, málsaðila"
            icon={{
              name: 'search',
              type: 'outline',
            }}
          />
          <GridRow rowGap={3}>
            {items.map((item) => (
              <GridColumn key={item.title} span="1/1">
                <FocusableBox
                  height="full"
                  href={`/domar/${item.id}`}
                  background="white"
                  borderRadius="large"
                  borderColor="blue200"
                  borderWidth="standard"
                  paddingX={3}
                  paddingY={2}
                >
                  <GridContainer>
                    <Stack space={2}>
                      <GridRow rowGap={3}>
                        <GridColumn span={['7/12', '7/12', '9/12']}>
                          <Text color="blue400" fontWeight="semiBold">
                            {item.caseNumber}
                          </Text>
                        </GridColumn>
                        <GridColumn span={['5/12', '5/12', '3/12']}>
                          <Stack space={0}>
                            {item.verdictDate && (
                              <Text variant="medium" textAlign="right">
                                {format(
                                  new Date(item.verdictDate),
                                  'd. MMM yyyy',
                                )}
                              </Text>
                            )}
                            {item.court && (
                              <Text variant="medium" textAlign="right">
                                {item.court}
                              </Text>
                            )}
                          </Stack>
                        </GridColumn>
                      </GridRow>
                      <Stack space={0}>
                        <GridRow>
                          <GridColumn>
                            <Text>{item.court}</Text>
                            <Text>
                              {item.presidentJudge?.name}{' '}
                              {item.presidentJudge?.title}
                            </Text>
                          </GridColumn>
                          <GridColumn>
                            <Text>{item.title}</Text>
                          </GridColumn>
                        </GridRow>
                      </Stack>
                      <GridRow>
                        <GridColumn>
                          <Text variant="small" color="dark300">
                            {item.keywords.join('. ')}
                          </Text>
                        </GridColumn>
                      </GridRow>

                      <Divider />

                      <GridRow>
                        <GridColumn>
                          <Text variant="small">
                            <Text color="blue400" variant="medium" as="span">
                              Reifun:
                            </Text>{' '}
                            {item.presentings}
                          </Text>
                        </GridColumn>
                      </GridRow>
                    </Stack>
                  </GridContainer>
                </FocusableBox>
              </GridColumn>
            ))}
          </GridRow>
        </Stack>
      </GridContainer>
    </Box>
  )
}

VerdictsList.getProps = async ({ apolloClient, query }) => {
  const searchTerm = parseAsString.withDefault('').parseServerSide(query.q)

  const verdictListResponse = await apolloClient.query<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >({
    query: GET_VERDICTS_QUERY,
    variables: {
      input: {
        searchTerm,
      },
    },
  })

  return {
    items: verdictListResponse.data.webVerdicts.items,
  }
}

export default withMainLayout(VerdictsList)
