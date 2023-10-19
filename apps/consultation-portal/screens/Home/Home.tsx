import dynamic from 'next/dynamic'
import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import { HeroBanner } from './components/'
import localization from './Home.json'
import { ArrOfTypes, CaseFilter } from '../../types/interfaces'
import { Layout } from '../../components'
import {
  useFetchStatistics,
  useFrontPageFilters,
  useIsMobile,
} from '../../hooks'

const Cards = dynamic(() => import('./components/Cards/Cards'), { ssr: false })
const MobileFilter = dynamic(
  () => import('./components/MobileFilter/MobileFilter'),
  { ssr: false },
)
const Filter = dynamic(() => import('./components/Filter/Filter'), {
  ssr: false,
})
const SearchAndFilter = dynamic(
  () => import('./components/SearchAndFilter/SearchAndFilter'),
  { ssr: false },
)

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
            <Cards
              getCasesLoading={getCasesLoading}
              cases={cases}
              total={total}
              filters={filters}
              setFilters={setFilters}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default Index
