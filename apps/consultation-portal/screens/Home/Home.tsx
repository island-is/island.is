import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Tiles,
  Text,
  Stack,
  LoadingDots,
} from '@island.is/island-ui/core'
import {
  HeroBanner,
  MobileFilter,
  Filter,
  SearchAndFilter,
} from './components/'
import localization from './Home.json'
import {
  ArrOfStatistics,
  ArrOfTypes,
  Case,
  CaseFilter,
} from '../../types/interfaces'
import { Card, EmptyState, Pagination, Layout } from '../../components'
import {
  useFetchStatistics,
  useFrontPageFilters,
  useIsMobile,
} from '../../hooks'
import {
  CARDS_PER_PAGE,
  FILTERS_FRONT_PAGE_KEY,
} from '../../utils/consts/consts'
import { MapCaseStatuses } from '../../types/enums'

interface HomeProps {
  types: ArrOfTypes
}

export const Index = ({ types }: HomeProps) => {
  const { isMobile } = useIsMobile()
  const loc = localization['home']
  const locSeo = loc['seo']

  const {
    cases,
    total,
    getCasesLoading,
    PolicyAreas,
    allPolicyAreas,
    Institutions,
    allInstitutions,
    filters,
    setFilters,
    initialValues,
  } = useFrontPageFilters({
    types: types,
  })

  const { statistics } = useFetchStatistics()

  const renderCards = () => {
    if (getCasesLoading) {
      return (
        <Box
          display="flex"
          width="full"
          alignItems="center"
          justifyContent="center"
          style={{ height: 200 }}
        >
          <LoadingDots color="blue" large />
        </Box>
      )
    }

    if (cases?.length === 0) {
      return <EmptyState isCase />
    }

    return (
      <>
        {cases && (
          <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
            {cases.map((item: Case, index: number) => {
              const card = {
                id: item.id,
                title: item.name,
                tag: MapCaseStatuses[item.statusName],
                published: item.created,
                processEnds: item.processEnds,
                processBegins: item.processBegins,
                eyebrows: [item.typeName, item.institutionName],
                caseNumber: item.caseNumber,
              }
              return (
                <Card key={index} card={card} frontPage showPublished>
                  <Stack space={2}>
                    <Text variant="eyebrow" color="purple400">
                      {`${loc.card.eyebrowText}: ${item.adviceCount}`}
                    </Text>
                    <Box
                      style={{
                        wordBreak: 'break-word',
                        height: '105px',
                      }}
                      overflow="hidden"
                    >
                      <Text variant="small" color="dark400">
                        {item.shortDescription}
                      </Text>
                    </Box>
                  </Stack>
                </Card>
              )
            })}
          </Tiles>
        )}
        <Pagination
          filters={filters}
          setFilters={(arr: CaseFilter) => setFilters(arr)}
          totalPages={Math.ceil(total / CARDS_PER_PAGE)}
          localStorageId={FILTERS_FRONT_PAGE_KEY}
        />
      </>
    )
  }

  return (
    <Layout
      isFrontPage
      seo={{
        title: locSeo.title,
        description: locSeo.description,
        keywords: locSeo.keywords,
      }}
    >
      <HeroBanner statistics={statistics} />
      {isMobile ? (
        <MobileFilter
          filters={filters}
          setFilters={(arr: CaseFilter) => setFilters(arr)}
          total={total}
          initialValues={initialValues}
        />
      ) : (
        <SearchAndFilter
          PolicyAreas={PolicyAreas}
          defaultPolicyAreas={allPolicyAreas}
          Institutions={Institutions}
          defaultInstitutions={allInstitutions}
          filters={filters}
          setFilters={(arr: CaseFilter) => setFilters(arr)}
          loading={getCasesLoading}
        />
      )}

      <GridContainer>
        <GridRow>
          <GridColumn span={['0', '0', '0', '3/12', '3/12']}>
            {!isMobile && (
              <Filter
                filters={filters}
                setFilters={(arr: CaseFilter) => setFilters(arr)}
                initialValues={initialValues}
                loading={getCasesLoading}
              />
            )}
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '9/12', '9/12']}>
            {renderCards()}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default Index
