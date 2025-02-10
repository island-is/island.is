import { useMemo } from 'react'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'next-usequerystate'

import {
  Box,
  Breadcrumbs,
  Divider,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Pagination,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type {
  GetVerdictCaseCategoriesQuery,
  GetVerdictCaseCategoriesQueryVariables,
  GetVerdictCaseTypesQuery,
  GetVerdictCaseTypesQueryVariables,
  GetVerdictKeywordsQuery,
  GetVerdictKeywordsQueryVariables,
  GetVerdictsQuery,
  GetVerdictsQueryVariables,
  WebVerdictCaseCategory,
  WebVerdictCaseType,
  WebVerdictKeyword,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'

import {
  GET_VERDICT_CASE_CATEGORIES_QUERY,
  GET_VERDICT_CASE_TYPES_QUERY,
  GET_VERDICT_KEYWORDS_QUERY,
  GET_VERDICTS_QUERY,
} from '../queries/Verdicts'

const ITEMS_PER_PAGE = 10

interface VerdictsListProps {
  items: GetVerdictsQuery['webVerdicts']['items']
  totalItems: number
  caseTypes: WebVerdictCaseType[]
  caseCategories: WebVerdictCaseCategory[]
  keywords: WebVerdictKeyword[]
}

const VerdictsList: Screen<VerdictsListProps> = ({
  items,
  caseTypes,
  caseCategories,
  keywords,
  totalItems,
}) => {
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
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withDefault(1)
      .withOptions({ clearOnDefault: true, shallow: true, scroll: true }),
  )
  const [selectedCaseTypes, setSelectedCaseTypes] = useQueryState(
    'caseTypes',
    parseAsArrayOf(
      parseAsString.withOptions({
        clearOnDefault: true,
        shallow: false,
      }),
    )
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow: false,
      }),
  )
  const [selectedCaseCategories, setSelectedCaseCategories] = useQueryState(
    'caseCategories',
    parseAsArrayOf(
      parseAsString.withOptions({
        clearOnDefault: true,
        shallow: false,
      }),
    )
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow: false,
      }),
  )
  const [selectedKeywords, setSelectedKeywords] = useQueryState(
    'keywords',
    parseAsArrayOf(
      parseAsString.withOptions({
        clearOnDefault: true,
        shallow: false,
      }),
    )
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow: false,
      }),
  )

  const caseTypeOptions = useMemo(() => {
    return caseTypes.map((type) => ({
      value: type.label,
      label: type.label,
    }))
  }, [caseTypes])
  const caseCategoryOptions = useMemo(() => {
    return caseCategories.map((category) => ({
      value: category.label,
      label: category.label,
    }))
  }, [caseCategories])
  const keywordOptions = useMemo(() => {
    return keywords.map((keyword) => ({
      value: keyword.label,
      label: keyword.label,
    }))
  }, [keywords])

  return (
    <Box paddingBottom={5}>
      <GridContainer>
        <Stack space={3}>
          <Breadcrumbs items={[{ title: 'Ísland.is', href: '/' }]} />
          <Text variant="h1" as="h1">
            Dómar og úrskurðir
          </Text>
          <Text>Dómar frá öllum dómstigum á Íslandi</Text>
          <Input
            value={searchTerm}
            onChange={(ev) => {
              setSearchTerm(ev.target.value)
              setPage(1)
            }}
            name="verdict-search-input"
            backgroundColor="blue"
            placeholder="Sláðu inn orð, málsnúmer, málsaðila"
            icon={{
              name: 'search',
              type: 'outline',
            }}
            size="sm"
          />
          <Stack space={3}>
            <Select
              label="Málategundir"
              placeholder="Veldu tegund"
              options={caseTypeOptions}
              isMulti={true}
              size="sm"
              onChange={(newValue) => {
                setSelectedCaseTypes(newValue.map(({ value }) => value))
                setPage(1)
              }}
            />
            <Select
              label="Málaflokkar"
              placeholder="Veldu flokk"
              options={caseCategoryOptions}
              isMulti={true}
              size="sm"
              onChange={(newValue) => {
                setSelectedCaseCategories(newValue.map(({ value }) => value))
                setPage(1)
              }}
            />
            <Select
              label="Lykilorð"
              placeholder="Veldu lykilorð"
              options={keywordOptions}
              isMulti={true}
              size="sm"
              onChange={(newValue) => {
                setSelectedKeywords(newValue.map(({ value }) => value))
                setPage(1)
              }}
            />
          </Stack>
          <GridRow rowGap={3}>
            {items.map((item) => (
              <GridColumn key={item.id} span="1/1">
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
                          <Text variant="h5" color="blue400">
                            {item.caseNumber}
                          </Text>
                        </GridColumn>
                        <GridColumn span={['5/12', '5/12', '3/12']}>
                          {item.verdictDate && (
                            <Text variant="medium" textAlign="right">
                              {format(
                                new Date(item.verdictDate),
                                'd. MMM yyyy',
                              )}
                            </Text>
                          )}
                        </GridColumn>
                      </GridRow>
                      <Stack space={0}>
                        <GridRow>
                          <GridColumn>
                            <Text color="blue400" variant="medium">
                              {item.court}
                            </Text>
                            <Text color="blue400" variant="medium">
                              {item.presidentJudge?.name}{' '}
                              {item.presidentJudge?.title}
                            </Text>
                          </GridColumn>
                          <GridColumn>
                            <Text variant="small">{item.title}</Text>
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

                      {Boolean(item.presentings) && <Divider />}
                      {Boolean(item.presentings) && (
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
                      )}
                    </Stack>
                  </GridContainer>
                </FocusableBox>
              </GridColumn>
            ))}
          </GridRow>
          {totalItems > ITEMS_PER_PAGE && (
            <Box paddingTop={6}>
              <Pagination
                variant="blue"
                page={page}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={totalItems}
                renderLink={(page, className, children) => (
                  <button
                    onClick={() => {
                      setPage(page)
                    }}
                  >
                    <span className={className}>{children}</span>
                  </button>
                )}
              />
            </Box>
          )}
        </Stack>
      </GridContainer>
    </Box>
  )
}

VerdictsList.getProps = async ({ apolloClient, query }) => {
  const searchTerm = parseAsString.withDefault('').parseServerSide(query.q)
  const caseCategories = parseAsArrayOf(parseAsString).parseServerSide(
    query.caseCategories,
  )
  const caseTypes = parseAsArrayOf(parseAsString).parseServerSide(
    query.caseTypes,
  )
  const keywords = parseAsArrayOf(parseAsString).parseServerSide(query.keywords)
  const page = parseAsInteger.withDefault(1).parseServerSide(query.page)

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
          page,
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

  return {
    items: verdictListResponse.data.webVerdicts.items,
    caseTypes: caseTypesResponse.data.webVerdictCaseTypes.caseTypes,
    caseCategories:
      caseCategoriesResponse.data.webVerdictCaseCategories.caseCategories,
    keywords: keywordsResponse.data.webVerdictKeywords.keywords,
    totalItems: verdictListResponse.data.webVerdicts.total,
  }
}

export default withMainLayout(VerdictsList)
