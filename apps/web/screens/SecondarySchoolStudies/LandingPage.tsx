import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import {
  Box,
  Button,
  Filter,
  FilterMultiChoice,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Input,
  Navigation,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HeadWithSocialSharing } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks/useNamespace'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { withCustomPageWrapper } from '../CustomPage/CustomPageWrapper'
import { GET_NAMESPACE_QUERY } from '../queries/Namespace'
import { StudyCardsGrid } from './StudyCardsGrid'
import * as styles from './SecondarySchoolStudies.css'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SecondarySchoolStudiesLandingPageProps {
  studies: any[]
  namespace: Record<string, string>
}

const SecondarySchoolStudiesLandingPage: Screen<
  SecondarySchoolStudiesLandingPageProps
> = ({ studies, namespace }) => {
  const n = useNamespace(namespace)
  const [isMounted, setIsMounted] = useState(false)
  const [isGridView, setIsGridView] = useState(true)
  // const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const isTablet = isMounted && width <= theme.breakpoints.lg

  const [parameters, setParameters] = useState<{
    schools: string[]
    location: string[]
    category: string[]
    endOfStudies: string[]
  }>({
    schools: [],
    location: [],
    category: [],
    endOfStudies: [],
  })

  // Set mounted state after first render to enable responsive layout
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Box paddingTop={8} paddingBottom={6}>
      <HeadWithSocialSharing
        title={''}
        // title={ogTitle}
        // description={n(
        //   'ogDescription',
        //   'Á Starfatorginu er að finna upplýsingar um laus störf hjá ríkinu.',
        // )}
        // imageUrl={n(
        //   'ogImageUrl',
        //   'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
        // )}
      />

      {/* Header */}
      {!isTablet && (
        <GridContainer>
          <Box>
            <GridRow marginBottom={5}>
              <GridColumn span="1/1">
                <Box
                  position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ minHeight: '242px', height: '242px' }}
                >
                  <img
                    src={'/assets/bakgrunnsmynnstur_framhaldskola.svg'}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    position="absolute"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="left"
                  >
                    <Box className="rs_read">
                      <Text variant="h1" as="h1" marginBottom={2} color="white">
                        {'Framhaldsskólanám'}
                      </Text>
                      <Text variant="h3" as="h2" color="white">
                        {'Allt framhaldsskólanám á Íslandi á sama stað'}
                      </Text>
                    </Box>
                  </Box>
                  {/* White circle with coat of arms */}
                  <Box
                    position="absolute"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      bottom: '-60px',
                      left: '160px',
                      transform: 'translateX(-50%)',
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={'/assets/skjaldarmerki.svg'}
                      alt="Icelandic coat of arms"
                      style={{ width: '80px', height: '80px' }}
                    />
                  </Box>
                </Box>
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      )}
      {isTablet && (
        <Box>
          <GridRow marginBottom={5}>
            <GridColumn span="1/1">
              <Box
                position="relative"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  width={'100%'}
                  src={'/assets/bakgrunnsmynnstur_framhaldskola_tablet.svg'}
                  alt=""
                />
                <Box
                  position="absolute"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <Box className="rs_read">
                    <Text variant="h1" as="h1" marginBottom={2} color="white">
                      {'Framhaldsskólanám'}
                    </Text>
                    <Text variant="h3" as="h2" color="white">
                      {'Allt framhaldsskólanám á Íslandi á sama stað'}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
      )}
      {/* Header ends */}

      {/* Main */}
      <Box>
        {true && (
          <GridContainer>
            <Box
              display="flex"
              flexDirection="row"
              height="full"
              paddingY={6}
              position="relative"
            >
              {/* Sidebar */}
              {!isTablet && (
                <Box
                  printHidden
                  display={['none', 'none', 'block']}
                  position="sticky"
                  alignSelf="flexStart"
                  className={styles.sidebar}
                  style={{ top: 72 }}
                >
                  <Stack space={3}>
                    <Navigation
                      title={'Tengt efni'}
                      asSpan
                      renderLink={(link, item: any | undefined) => {
                        return (
                          <a
                            href="https://island.is"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Box
                              display="flex"
                              flexDirection={'row'}
                              justifyContent="spaceBetween"
                              alignItems="center"
                              paddingLeft={2}
                              paddingRight={4}
                            >
                              {link}

                              <Icon
                                color="purple600"
                                type="outline"
                                icon="open"
                                size="small"
                              />
                            </Box>
                          </a>
                        )
                      }}
                      items={[
                        {
                          title: 'Um framhaldskólanám.is',
                        },
                        {
                          title: 'Ég veit ekki hvað ég vil',
                        },
                      ]}
                      baseId={'test'}
                      colorScheme="purple"
                    />
                    <Text variant="h4" as="h4" paddingY={1}>
                      {n('search', 'Leit')}
                    </Text>
                    <Filter
                      resultCount={0}
                      variant={'default'}
                      labelClear={n('clear', 'Hreinsa')}
                      labelClearAll={n('clearAllFilters', 'Hreinsa allar síur')}
                      labelOpen={n('open', 'Opna')}
                      labelClose={n('close', 'Loka')}
                      labelResult={n('showResults', 'Skoða niðurstöður')}
                      labelTitle={n('filterResults', 'Sía niðurstöður')}
                      onFilterClear={() => {
                        setParameters({
                          schools: [],
                          location: [],
                          category: [],
                          endOfStudies: [],
                        })
                      }}
                    >
                      <FilterMultiChoice
                        labelClear={n('clearFilter', 'Hreinsa val')}
                        onChange={({ categoryId, selected }) => {
                          //setSelectedPage(1)
                          setParameters((prevParams) => ({
                            ...prevParams,
                            [categoryId]: selected,
                          }))
                        }}
                        onClear={(categoryId) => {
                          //setSelectedPage(1)
                          setParameters((prevParams) => ({
                            ...prevParams,
                            [categoryId]: [],
                          }))
                        }}
                        categories={[
                          {
                            id: '1',
                            label: 'Framhaldsskólar',
                            filters: [
                              { value: 'MA', label: 'MA' },
                              { value: 'VMA', label: 'VMA' },
                            ],
                            selected: [],
                          },
                          {
                            id: '2',
                            label: 'Landshlutar',
                            filters: [
                              { value: 'Vesturland', label: 'Vesturland' },
                            ],
                            selected: [],
                          },
                        ]}
                      />
                    </Filter>
                  </Stack>
                </Box>
              )}

              {/* Content */}
              <Box
                flexGrow={1}
                paddingLeft={2}
                className={styles.contentWrapper}
              >
                <Box display={'flex'} flexDirection={'column'} rowGap={4}>
                  {/* Title, searchbar and clear search button */}
                  <Box display={'flex'} rowGap={2} flexDirection={'column'}>
                    <Text variant="h2" as="h2" lineHeight="xs">
                      {n('searchResults', 'Leitarniðurstöður')}
                    </Text>
                    <Input
                      placeholder={n('searchPrograms', 'Leit í háskólanámi')}
                      id="searchuniversity"
                      name="filterInput"
                      value={''}
                      backgroundColor="blue"
                      onChange={(e) => {
                        //
                      }}
                    />
                    <Box display={'flex'} justifyContent={'flexEnd'}>
                      <Box style={{ flexShrink: 0 }}>
                        <Button
                          variant="text"
                          icon="reload"
                          size="small"
                          //onClick={}
                        >
                          {n('clearAllFilters', 'Hreinsa allar síur')}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {/* Search result number and grid vs list view button */}
                  <Box display={'flex'} justifyContent={'spaceBetween'}>
                    <Box>
                      <Text>
                        <strong>17</strong> námsbrautir sýnilegar
                      </Text>
                    </Box>
                    {true && (
                      <Button
                        variant="utility"
                        icon={isGridView ? 'menu' : 'gridView'}
                        iconType="filled"
                        colorScheme="white"
                        size="small"
                        onClick={() => setIsGridView(!isGridView)}
                      >
                        {isGridView
                          ? n('displayList', 'Sýna sem lista')
                          : n('displayGrid', 'Sýna sem spjöld')}
                      </Button>
                    )}
                  </Box>
                  <Box
                    style={{ minHeight: '100vh' }}
                    className={styles.studyCardsWrapper}
                  >
                    <StudyCardsGrid
                      isGridView={isGridView}
                      cards={[
                        {
                          id: 'testId',
                          schoolName: 'Menntaskólinn við Hamrahlíð',
                          schoolIcon: (
                            <Icon icon="school" color="blue400" size="small" />
                          ),
                          title: 'Félagsfræðabraut',
                          description:
                            'Nulla quis congue amet non ut laoreet eget libero. Dui mauris lacus nunc elit tellus phasellus amet. At lectus nunc sit turpis. Diam arcu viverra a lobortis non consectetur quam sit euismod. Ultricies a semper.',
                          detailLines: [
                            {
                              icon: 'location',
                              text: 'Félagsvísindi, viðskipti og lögfræði',
                            },
                            {
                              icon: 'reader',
                              text: '180 einingar',
                            },
                            {
                              icon: 'school',
                              text: 'Bóknámsbrautir til stúdentsprófs',
                            },
                          ],
                          href: 'https://island.is',
                        },
                        {
                          id: 'testIfd',
                          schoolName: 'Menntaskólinn við Hamrahlíð',
                          schoolIcon: (
                            <Icon icon="school" color="blue400" size="small" />
                          ),
                          title: 'Félagsfræðabraut',
                          description:
                            'Nulla quis congue amet non ut laoreet eget libero. Dui mauris lacus nunc elit tellus phasellus amet. At lectus nunc sit turpis. Diam arcu viverra a lobortis non consectetur quam sit euismod. Ultricies a semper.',
                          detailLines: [
                            {
                              icon: 'location',
                              text: 'Félagsvísindi, viðskipti og lögfræði',
                            },
                            {
                              icon: 'reader',
                              text: '180 einingar',
                            },
                            {
                              icon: 'school',
                              text: 'Bóknámsbrautir til stúdentsprófs',
                            },
                          ],
                          href: 'https://island.is',
                        },
                        {
                          id: 'tesstId',
                          schoolName: 'Menntaskólinn við Hamrahlíð',
                          schoolIcon: (
                            <Icon icon="school" color="blue400" size="small" />
                          ),
                          title: 'Félagsfræðabraut',
                          description:
                            'Nulla quis congue amet non ut laoreet eget libero. Dui mauris lacus nunc elit tellus phasellus amet. At lectus nunc sit turpis. Diam arcu viverra a lobortis non consectetur quam sit euismod. Ultricies a semper.',
                          detailLines: [
                            {
                              icon: 'location',
                              text: 'Félagsvísindi, viðskipti og lögfræði',
                            },
                            {
                              icon: 'reader',
                              text: '180 einingar',
                            },
                            {
                              icon: 'school',
                              text: 'Bóknámsbrautir til stúdentsprófs',
                            },
                          ],
                          href: 'https://island.is',
                        },
                      ]}
                    />
                  </Box>

                  {true && (
                    <Box marginTop={2} paddingBottom={2}>
                      <Pagination
                        variant="blue"
                        page={1}
                        itemsPerPage={20}
                        totalItems={40}
                        totalPages={2}
                        renderLink={(page, className, children) => (
                          <button
                            onClick={() => {
                              //setSelectedPage(page)
                            }}
                          >
                            <span className={className}>{children}</span>
                          </button>
                        )}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </GridContainer>
        )}
        {/* Tablet content, Dialog filters */}
        {isTablet && <Box marginX={3} paddingTop={3}></Box>}
      </Box>
      {/* Main ends */}
    </Box>
  )
}
SecondarySchoolStudiesLandingPage.getProps = async ({
  apolloClient,
  locale,
}) => {
  const namespaceResponse = await apolloClient.query<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'Framhaldsskolanam',
      },
    },
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>
  const studies: any[] = []

  return {
    studies,
    namespace,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SecondarySchoolStudies,
    SecondarySchoolStudiesLandingPage,
  ),
  {
    footerVersion: 'organization',
  },
)
