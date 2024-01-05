import { useQueryState } from 'next-usequerystate'

import {
  Box,
  Breadcrumbs,
  Filter,
  FilterInput,
  FilterMultiChoice,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
  Pagination,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  FilterTag,
  HeadWithSocialSharing,
  Webreader,
} from '@island.is/web/components'
import {
  GetIcelandicGovernmentInstitutionVacanciesQuery,
  GetIcelandicGovernmentInstitutionVacanciesQueryVariables,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { shortenText } from '@island.is/web/utils/shortenText'

import { GET_NAMESPACE_QUERY } from '../queries'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES } from '../queries/IcelandicGovernmentInstitutionVacancies'
import { VACANCY_INTRO_MAX_LENGTH } from './utils'
import * as styles from './VacanciesList.css'

const ITEMS_PER_PAGE = 8

interface VacanciesListProps {
  vacancies: any[]
  namespace: Record<string, string>
}

const VacanciesList: Screen<VacanciesListProps> = ({
  namespace,
  vacancies,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const [searchTerm, setSearchTerm] = useQueryState('q')
  const [selectedPage, setSelectedPage] = useQueryState('page', {
    scroll: true,
  })

  const clearSearch = () => {
    // setParameters({
    //   fieldOfWork: [],
    //   location: [],
    //   institution: [],
    // })
    // setSearchTerm('')
  }

  const mainTitle = n('mainTitle', 'Starfatorg - laus störf hjá ríkinu')
  const ogTitle = n('ogTitle', 'Starfatorg - laus störf hjá ríkinu | Ísland.is')

  return (
    <Box paddingTop={[0, 0, 8]}>
      <HeadWithSocialSharing
        title={ogTitle}
        description={n(
          'ogDescription',
          'Á Starfatorginu er að finna upplýsingar um laus störf hjá ríkinu.',
        )}
        imageUrl={n(
          'ogImageUrl',
          'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
        )}
      />
      <GridContainer>
        <Box>
          <GridRow marginBottom={[5, 5, 5, 0]}>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
              <Breadcrumbs items={[{ title: 'Ísland.is', href: '/' }]} />
              <Box className="rs_read" marginTop={2}>
                <Text variant="h1" as="h1">
                  {mainTitle}
                </Text>
              </Box>
              <Webreader
                marginBottom={[0, 0, 0, 4]}
                readId={undefined}
                readClass="rs_read"
              />
            </GridColumn>
            <GridColumn span="1/2">
              <Hidden below="lg">
                <Box display="flex" justifyContent="center" width="full">
                  <img
                    src={n(
                      'starfatorgIcon',
                      'https://images.ctfassets.net/8k0h54kbe6bj/1SY4juL47FNJT7kBNIsdqv/5e51b2319665a832549e6d0813dcd984/LE_-_Jobs_-_S3__1_.svg',
                    )}
                    alt=""
                  />
                </Box>
              </Hidden>
            </GridColumn>
          </GridRow>

          <Hidden above="sm">
            <Box marginBottom={3}>
              <FilterInput
                placeholder={n(
                  'filterSearchPlaceholder',
                  'Leita í Starfatorgi',
                )}
                name="filterInput"
                value={searchTerm || ''}
                onChange={(value) => {
                  setSelectedPage(null)
                  setSearchTerm(value)
                }}
              />
            </Box>
          </Hidden>

          <Filter
            resultCount={vacancies?.length ?? 0}
            variant={isMobile ? 'dialog' : 'popover'}
            labelClear={n('clearFilter', 'Hreinsa síu')}
            labelClearAll={n('clearAllFilters', 'Hreinsa allar síur')}
            labelOpen={n('openFilter', 'Sía niðurstöður')}
            labelClose={n('closeFilter', 'Loka síu')}
            labelResult={n('viewResults', 'Skoða niðurstöður')}
            labelTitle={n('filterMenuTitle', 'Sía niðurstöður')}
            onFilterClear={clearSearch}
            filterInput={
              <Box className={styles.filterInput}>
                <FilterInput
                  placeholder={n(
                    'filterSearchPlaceholder',
                    'Leita í Starfatorgi',
                  )}
                  name="filterInput"
                  value={searchTerm || ''}
                  onChange={(value) => {
                    setSelectedPage(null)
                    setSearchTerm(value || null)
                  }}
                />
              </Box>
            }
          >
            <FilterMultiChoice
              labelClear={n('clearSelection', 'Hreinsa val')}
              onChange={({ categoryId, selected }) => {
                setSelectedPage(null)
                // setParameters((prevParameters) => ({
                //   ...prevParameters,
                //   [categoryId]: selected,
                // }))
              }}
              onClear={(categoryId) => {
                setSelectedPage(null)
                // setParameters((prevParameters) => ({
                //   ...prevParameters,
                //   [categoryId]: [],
                // }))
              }}
              categories={[]}
            />
          </Filter>

          <GridRow className={styles.filterTagRow} alignItems="center">
            <GridColumn span="8/12">
              {/* <Inline space={1}>
                {selectedFilters.map(({ label, value, category }) => (
                  <FilterTag
                    key={value}
                    onClick={() => {
                      setParameters((prevParameters) => ({
                        ...prevParameters,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        [category]: (prevParameters[category] ?? []).filter(
                          (prevValue: string) => prevValue !== value,
                        ),
                      }))
                    }}
                  >
                    {label}
                  </FilterTag>
                ))}
              </Inline> */}
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>

      <Box paddingTop={3} paddingBottom={6} background="blue100">
        <GridContainer>
          <Box className="rs_read" marginBottom={6}>
            <Text>
              {vacancies.length}{' '}
              {vacancies.length % 10 === 1 && vacancies.length % 100 !== 11
                ? n('singleJobFound', 'starf fannst')
                : n('jobsFound', 'störf fundust')}
            </Text>
          </Box>
          <GridRow rowGap={[3, 3, 6]}>
            {vacancies.map((vacancy) => {
              let logoUrl =
                vacancy.logoUrl ||
                n(
                  'fallbackLogoUrl',
                  'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg',
                )

              const vacancyComesFromCms = vacancy.id?.startsWith('c-')

              if (!vacancy.institutionName && vacancyComesFromCms) {
                logoUrl = ''
              }

              return (
                <GridColumn
                  key={vacancy.id}
                  span={['1/1', '1/1', '1/1', '1/2']}
                >
                  <FocusableBox
                    height="full"
                    href={`${
                      linkResolver('vacancydetails', [vacancy.id?.toString()])
                        .href
                    }`}
                    background="white"
                    borderRadius="large"
                    borderColor="blue200"
                    borderWidth="standard"
                    padding={[3, 3, 'containerGutter']}
                    overflow="hidden"
                  >
                    <Box width="full">
                      <GridRow
                        rowGap={[2, 2, 2, 5]}
                        direction={['column', 'column', 'column', 'row']}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        alignItems={[null, null, null, 'center']}
                        align="spaceBetween"
                        className={styles.vacancyCard}
                      >
                        <GridColumn className={styles.vacancyCardText}>
                          <Stack space={2}>
                            <Text variant="eyebrow">{vacancy.fieldOfWork}</Text>
                            <Box className="rs_read">
                              <Text color="blue400" variant="h3">
                                {vacancy.title}
                              </Text>
                            </Box>
                            <Box className="rs_read">
                              <Text>
                                {shortenText(
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore make web strict
                                  vacancy.intro,
                                  VACANCY_INTRO_MAX_LENGTH,
                                )}
                              </Text>
                            </Box>
                            <Box className="rs_read">
                              <Inline space={1}>
                                {vacancy.institutionName && (
                                  <Tag outlined={true} disabled={true}>
                                    {vacancy.institutionName}
                                  </Tag>
                                )}
                                {vacancy.locations &&
                                  vacancy.locations
                                    .filter((location) => location.title)
                                    .map((location, index) => (
                                      <Tag key={index} outlined={true} disabled>
                                        {location.title}
                                      </Tag>
                                    ))}
                              </Inline>
                            </Box>
                            {vacancy.applicationDeadlineTo && (
                              <Box className="rs_read">
                                <Tag outlined={true} disabled variant="purple">
                                  {n(
                                    'applicationDeadlineTo',
                                    'Umsóknarfrestur',
                                  )}{' '}
                                  {vacancy.applicationDeadlineTo}
                                </Tag>
                              </Box>
                            )}
                          </Stack>
                        </GridColumn>

                        <GridColumn>
                          <Box width="full">
                            {logoUrl && (
                              <>
                                <Hidden below="lg">
                                  <img
                                    className={styles.logo}
                                    src={logoUrl}
                                    alt=""
                                  />
                                </Hidden>
                                <Hidden above="md">
                                  <Box
                                    display="flex"
                                    justifyContent="center"
                                    width="full"
                                  >
                                    <img
                                      className={styles.logo}
                                      src={logoUrl}
                                      alt=""
                                    />
                                  </Box>
                                </Hidden>
                              </>
                            )}
                          </Box>
                        </GridColumn>
                      </GridRow>
                    </Box>
                  </FocusableBox>
                </GridColumn>
              )
            })}
          </GridRow>
          {/* TODO: perhaps just have a button to go to previous page or next page, þá þarf kannsi samt að hafa núllstilla síu möguleika */}
          {vacancies.length > 0 && (
            <Box paddingTop={8}>
              <Pagination
                variant="blue"
                page={!selectedPage ? 1 : Number(selectedPage)}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={vacancies.length}
                // totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <button
                    onClick={() => {
                      setSelectedPage(page === 1 ? null : String(page))
                    }}
                  >
                    <span className={className}>{children}</span>
                  </button>
                )}
              />
            </Box>
          )}
        </GridContainer>
      </Box>
    </Box>
  )
}

VacanciesList.getProps = async ({ apolloClient, locale }) => {
  // TODO: fetch vacancies with a given page number read from query params using usequerystate somehow (see /umsokn page)

  const namespaceResponse = await apolloClient.query<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'Starfatorg',
      },
    },
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  if (namespace['display404forV2']) {
    throw new CustomNextError(404, 'Vacancies V2 on Ísland.is are turned off')
  }

  const vacanciesResponse = await apolloClient.query<
    GetIcelandicGovernmentInstitutionVacanciesQuery,
    GetIcelandicGovernmentInstitutionVacanciesQueryVariables
  >({
    query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES,
    variables: {
      input: {},
    },
  })

  return {
    vacancies:
      vacanciesResponse.data.icelandicGovernmentInstitutionVacancies.vacancies,
    namespace,
    customAlertBanner: namespace['customAlertBanner'],
  }
}

export default withMainLayout(VacanciesList, {
  footerVersion: 'organization',
})
