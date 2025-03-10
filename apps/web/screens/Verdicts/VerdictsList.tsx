import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'
import { parseAsArrayOf, parseAsString } from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Breadcrumbs,
  Button,
  GridContainer,
  InfoCardGrid,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  type GetVerdictCaseCategoriesQuery,
  type GetVerdictCaseCategoriesQueryVariables,
  type GetVerdictCaseTypesQuery,
  type GetVerdictCaseTypesQueryVariables,
  type GetVerdictKeywordsQuery,
  type GetVerdictKeywordsQueryVariables,
  type GetVerdictsQuery,
  type GetVerdictsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import {
  GET_VERDICT_CASE_CATEGORIES_QUERY,
  GET_VERDICT_CASE_TYPES_QUERY,
  GET_VERDICT_KEYWORDS_QUERY,
  GET_VERDICTS_QUERY,
} from '../queries/Verdicts'
import { m } from './translations.strings'

const ITEMS_PER_PAGE = 10
const DEBOUNCE_TIME = 300

interface VerdictsListProps {
  initialData: {
    visibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    invisibleVerdicts: GetVerdictsQuery['webVerdicts']['items']
    total: number
  }
}

const VerdictsList: CustomScreen<VerdictsListProps> = ({ initialData }) => {
  const [data, setData] = useState(initialData)
  const [page, setPage] = useState(1)
  const { format } = useDateUtils()
  const { formatMessage } = useIntl()

  const [fetchVerdicts, { loading, error }] = useLazyQuery<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >(GET_VERDICTS_QUERY)

  useDebounce(
    () => {
      if (page <= 1) {
        return
      }

      fetchVerdicts({
        variables: {
          input: {
            page,
          },
        },
        onCompleted(response) {
          setData((prevData) => {
            const verdicts = response.webVerdicts.items
              .concat(prevData.invisibleVerdicts)
              // Remove all duplicate verdicts in case there were new verdicts published since last page load
              .filter(
                (verdict) =>
                  Boolean(verdict.id) &&
                  !prevData.visibleVerdicts
                    .map(({ id }) => id)
                    .includes(verdict.id),
              )

            verdicts.sort((a, b) => {
              if (!a.verdictDate && !b.verdictDate) return 0
              if (!b.verdictDate) return -1
              if (!a.verdictDate) return 1
              return (
                new Date(b.verdictDate).getTime() -
                new Date(a.verdictDate).getTime()
              )
            })

            return {
              visibleVerdicts: prevData.visibleVerdicts.concat(
                verdicts.slice(0, ITEMS_PER_PAGE),
              ),
              invisibleVerdicts: verdicts.slice(ITEMS_PER_PAGE),
              total: initialData.total,
            }
          })
        },
      })
    },
    DEBOUNCE_TIME,
    [page],
  )

  const [isGridLayout, setIsGridLayout] = useState(false)

  return (
    <Box paddingBottom={5} className="rs_read">
      <GridContainer>
        <Stack space={3}>
          <Breadcrumbs items={[{ title: 'Ísland.is', href: '/' }]} />
          <Text variant="h1" as="h1">
            {formatMessage(m.listPage.heading)}{' '}
          </Text>
          <Webreader readClass="rs_read" marginBottom={0} marginTop={0} />
          <Text>{formatMessage(m.listPage.description)}</Text>
          <Box display="flex" justifyContent="flexEnd">
            <Button
              variant="utility"
              icon={isGridLayout ? 'menu' : 'gridView'}
              iconType="filled"
              colorScheme="white"
              size="small"
              onClick={() => {
                setIsGridLayout((previousState) => !previousState)
              }}
            >
              {formatMessage(
                isGridLayout ? m.listPage.displayList : m.listPage.displayGrid,
              )}
            </Button>
          </Box>

          <InfoCardGrid
            variant="detailed"
            columns={isGridLayout ? 2 : 1}
            cards={data.visibleVerdicts.map((verdict) => {
              return {
                description: verdict.title,
                eyebrow: '',
                id: verdict.id,
                link: { href: `/domar/${verdict.id}`, label: '' },
                title: verdict.caseNumber,
                borderColor: 'blue200',
                detailLines: [
                  {
                    icon: 'calendar',
                    text: verdict.verdictDate
                      ? format(new Date(verdict.verdictDate), 'd. MMMM yyyy')
                      : '',
                  },
                  {
                    icon: 'person',
                    text: `${verdict.presidentJudge?.name ?? ''} ${
                      verdict.presidentJudge?.title ?? ''
                    }`,
                  },
                ],
              }
            })}
          />
          {initialData.total > data.visibleVerdicts.length && (
            <Box
              key={page}
              paddingTop={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {error && (
                <Box paddingBottom={2}>
                  <Text variant="medium" color="red600">
                    {formatMessage(m.listPage.loadingMoreFailed)}
                  </Text>
                </Box>
              )}
              <Button
                loading={loading}
                onClick={() => {
                  setPage((p) => p + 1)
                }}
              >
                {formatMessage(m.listPage.seeMoreVerdicts, {
                  remainingVerdictCount:
                    initialData.total - data.visibleVerdicts.length,
                })}
              </Button>
            </Box>
          )}
        </Stack>
      </GridContainer>
    </Box>
  )
}

VerdictsList.getProps = async ({ apolloClient, query, customPageData }) => {
  const searchTerm = parseAsString.withDefault('').parseServerSide(query.q)
  const caseCategories = parseAsArrayOf(parseAsString).parseServerSide(
    query.caseCategories,
  )
  const caseTypes = parseAsArrayOf(parseAsString).parseServerSide(
    query.caseTypes,
  )
  const keywords = parseAsArrayOf(parseAsString).parseServerSide(query.keywords)
  const [
    verdictListResponse,
    caseTypesResponse,
    caseCategoriesResponse,
    keywordsResponse,
  ] = await Promise.all([
    apolloClient.query<GetVerdictsQuery, GetVerdictsQueryVariables>({
      query: GET_VERDICTS_QUERY,
      variables: {
        input: {
          searchTerm,
          caseCategories,
          caseTypes,
          keywords,
          page: 1,
        },
      },
    }),
    apolloClient.query<
      GetVerdictCaseTypesQuery,
      GetVerdictCaseTypesQueryVariables
    >({
      query: GET_VERDICT_CASE_TYPES_QUERY,
    }),
    apolloClient.query<
      GetVerdictCaseCategoriesQuery,
      GetVerdictCaseCategoriesQueryVariables
    >({
      query: GET_VERDICT_CASE_CATEGORIES_QUERY,
    }),
    apolloClient.query<
      GetVerdictKeywordsQuery,
      GetVerdictKeywordsQueryVariables
    >({
      query: GET_VERDICT_KEYWORDS_QUERY,
    }),
  ])

  const items = verdictListResponse.data.webVerdicts.items.filter((item) =>
    Boolean(item?.id),
  )

  if (!customPageData?.configJson?.showVerdictListPage) {
    throw new CustomNextError(
      404,
      'Verdict list page has been turned off in the CMS',
    )
  }

  return {
    initialData: {
      visibleVerdicts: items.slice(0, ITEMS_PER_PAGE),
      invisibleVerdicts: items.slice(ITEMS_PER_PAGE),
      total: verdictListResponse.data.webVerdicts.total,
    },
    caseTypes: caseTypesResponse.data.webVerdictCaseTypes.caseTypes,
    caseCategories:
      caseCategoriesResponse.data.webVerdictCaseCategories.caseCategories,
    keywords: keywordsResponse.data.webVerdictKeywords.keywords,
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Verdicts, VerdictsList),
)
