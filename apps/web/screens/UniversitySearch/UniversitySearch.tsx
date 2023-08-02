import {
  Box,
  ActionCategoryCard,
  ContentBlock,
  FilterInput,
  Icon,
  Inline,
  Tag,
  Text,
  ButtonTypes,
  ButtonSizes,
  CTAProps,
  CategoryCard,
  Button,
  CategoryCardTag,
  GridContainer,
  GridColumn,
  GridRow,
  SidebarAccordion,
  Stack,
  Checkbox,
  Accordion,
  AccordionItem,
  Pagination,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useEffect, useRef, useState } from 'react'
import * as styles from './UniversitySearch.css'
import { ListViewCard } from '@island.is/web/components'
import { UNIVERSITY_GATEWAY_BASE_URL } from '@island.is/web/constants'
import axios from 'axios'

const ITEMS_PER_PAGE = 8

interface UniversitySearchProps {
  mockData: any
}

interface FilterProps {
  applications: Array<string>
  studyLevel: Array<string>
  typeOfStudy: Array<string>
  fieldOfStudy: Array<string>
  university: Array<string>
  degree: Array<string>
  location: Array<string>
  studyTime: Array<string>
  tuition: Array<string>
  tags: Array<string>
}

const intialFilters = {
  applications: [],
  studyLevel: [],
  typeOfStudy: [],
  fieldOfStudy: [],
  university: [],
  degree: [],
  location: [],
  studyTime: [],
  tuition: [],
  tags: [],
}

const UniversitySearch: Screen<UniversitySearchProps> = ({ mockData }) => {
  // const n = useNamespace(namespace)
  console.log('mockData', mockData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPage, setSelectedPage] = useState(1)
  const searchTermHasBeenInitialized = useRef(false)

  const [filters, setFilters] = useState<FilterProps>(intialFilters)

  const [gridView, setGridView] = useState<boolean>(true)

  const totalPages = Math.ceil(mockData.length / ITEMS_PER_PAGE)

  const getTags = () => {
    const tags: CategoryCardTag[] = [
      { label: 'BA gráða', disabled: true, outlined: false },
      { label: '180 einingar', disabled: true, outlined: false },
    ]
    return tags
  }

  const createPrimaryCTA = () => {
    const CTA: CTAProps = {
      label: 'Sækja um nám',
      variant: 'primary',
      size: 'small',
      icon: 'arrowForward',
      iconType: 'outline',
      onClick: () => console.log('hallo'),
      disabled: false,
    }
    return CTA
  }

  const handleFilters = (filterKey: string, filterValue: string) => {
    if (filters[filterKey].includes(filterValue)) {
      const index = filters[filterKey].indexOf(filterValue)
      const specificArray = filters[filterKey]
      specificArray.splice(index, 1)
      setFilters({ ...filters, [filterKey]: specificArray })
    } else {
      setFilters({
        ...filters,
        [filterKey]: [...filters[filterKey], filterValue],
      })
    }
  }

  useEffect(() => {
    console.log('filters', filters)
  }, [filters])

  return (
    <GridContainer>
      <Box display="flex" flexDirection="row" columnGap={15}>
        <Box
          height="full"
          className={styles.filterWrapper}
          display="flex"
          flexDirection="column"
        >
          <Box display="inline" marginBottom={3}>
            <Button variant="utility" icon="filter">
              Sía niðurstöður
            </Button>
          </Box>
          <Box
            display="inline"
            style={{ alignSelf: 'flex-end' }}
            marginBottom={1}
          >
            <Button variant="text" icon="add" size="small">
              Opna allar síur
            </Button>
          </Box>
          <Accordion
            singleExpand={false}
            dividerOnTop={false}
            dividerOnBottom={false}
          >
            <AccordionItem
              id="mini_accordion1"
              label="Umsóknir"
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
              startExpanded
            >
              <Stack space={[1, 1, 2]}>
                <Checkbox label="Opið fyrir umsóknir" value="open" />
              </Stack>
              <Box
                display="flex"
                width="full"
                flexDirection="row"
                justifyContent="flexEnd"
                marginTop={1}
              >
                <Button variant="text" icon="reload" size="small">
                  Hreinsa val
                </Button>
              </Box>
            </AccordionItem>

            <AccordionItem
              id="mini_accordion2"
              label="Námstig"
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
              startExpanded
            >
              <Stack space={[1, 1, 1]}>
                <Checkbox label="Grunndiplóma" value="diploma" />
                <Checkbox label="Grunnnám" value="undergrad" />
                <Checkbox label="Viðbótardiplóma" value="additionalDiploma" />
                <Checkbox label="Meistaranám" value="masters" />
                <Checkbox label="Doktorsnám" value="doctors" />
              </Stack>
              <Box
                display="flex"
                width="full"
                flexDirection="row"
                justifyContent="flexEnd"
                marginTop={1}
              >
                <Button variant="text" icon="reload" size="small">
                  Hreinsa val
                </Button>
              </Box>
            </AccordionItem>

            <AccordionItem
              id="mini_accordion3"
              label="Misseri"
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
              startExpanded
            >
              <Stack space={[1, 1, 2]}>
                <Checkbox label="Haustmisseri" value="fall" />
                <Checkbox label="Vormisseri" value="spring" />
              </Stack>
              <Box
                display="flex"
                width="full"
                flexDirection="row"
                justifyContent="flexEnd"
                marginTop={1}
              >
                <Button variant="text" icon="reload" size="small">
                  Hreinsa val
                </Button>
              </Box>
            </AccordionItem>

            <AccordionItem
              id="mini_accordion4"
              label="Form kennslu"
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
            >
              <Stack space={[1, 1, 2]}>
                <Checkbox label="Staðnám" value="onSite" />
                <Checkbox label="Fjarnám" value="away" />
                <Checkbox label="Blandað nám" value="mixed" />
                <Checkbox label="Dreifinám" value="spread" />
              </Stack>
              <Box
                display="flex"
                width="full"
                flexDirection="row"
                justifyContent="flexEnd"
                marginTop={1}
              >
                <Button variant="text" icon="reload" size="small">
                  Hreinsa val
                </Button>
              </Box>
            </AccordionItem>
            <AccordionItem
              id="mini_accordion6"
              label="Námssvið"
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
            >
              <Stack space={[1, 1, 2]}>
                <Checkbox label="Grunndiplóma" />
                <Checkbox label="Grunnnám" />
                <Checkbox label="Viðbótardiplóma" />
                <Checkbox label="Meistaranám" />
                <Checkbox label="Doktorsnám" />
              </Stack>
              <Box
                display="flex"
                width="full"
                flexDirection="row"
                justifyContent="flexEnd"
                marginTop={1}
              >
                <Button variant="text" icon="reload" size="small">
                  Hreinsa val
                </Button>
              </Box>
            </AccordionItem>
            <AccordionItem
              id="mini_accordion5"
              label="Háskólar"
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
            >
              <Stack space={[1, 1, 2]}>
                <Checkbox label="Grunndiplóma" />
                <Checkbox label="Grunnnám" />
                <Checkbox label="Viðbótardiplóma" />
                <Checkbox label="Meistaranám" />
                <Checkbox label="Doktorsnám" />
              </Stack>
              <Box
                display="flex"
                width="full"
                flexDirection="row"
                justifyContent="flexEnd"
                marginTop={1}
              >
                <Button variant="text" icon="reload" size="small">
                  Hreinsa val
                </Button>
              </Box>
            </AccordionItem>
          </Accordion>
          <Box
            background="blue100"
            width="full"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            style={{ height: 72 }}
          >
            <Button variant="text" icon="reload" size="small">
              Hreinsa allar síur
            </Button>
          </Box>
        </Box>

        <Box width="full">
          <Text
            marginTop={0}
            marginBottom={2}
            variant="h1"
            as="h1"
            lineHeight="xs"
          >
            Leitarniðurstöður
          </Text>
          <FilterInput
            placeholder="Leita"
            name="filterInput"
            value={searchTerm}
            backgroundColor="blue"
            onChange={(value) => {
              setSelectedPage(1)
              setSearchTerm(value)
              searchTermHasBeenInitialized.current = true
            }}
          />
          <ContentBlock>
            <Box paddingTop={2}>
              <Inline space={[1, 2]}>
                <Tag
                  onClick={() => handleFilters('tags', 'all')}
                  customClassName={
                    filters.tags.includes('all')
                      ? styles.tagActive
                      : styles.tagNotActive
                  }
                >
                  Sýna allt
                </Tag>
                <Tag
                  onClick={() => handleFilters('tags', 'grunnnam')}
                  customClassName={
                    filters.tags.includes('grunnnam')
                      ? styles.tagActive
                      : styles.tagNotActive
                  }
                >
                  Grunnnám
                </Tag>
                <Tag
                  onClick={() => handleFilters('tags', 'framhaldsnam')}
                  customClassName={
                    filters.tags.includes('framhaldsnam')
                      ? styles.tagActive
                      : styles.tagNotActive
                  }
                >
                  Framhaldsnám
                </Tag>
              </Inline>
            </Box>
          </ContentBlock>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            marginTop={5}
            marginBottom={5}
          >
            <Text variant="intro">8 Leitarniðurstöður</Text>
            <Box>
              <button
                onClick={() => setGridView(true)}
                className={styles.iconButton}
              >
                <Icon
                  icon={'gridView'}
                  type="outline"
                  color={gridView ? 'blue400' : 'dark200'}
                />
              </button>
              <button
                onClick={() => setGridView(false)}
                className={styles.iconButton}
              >
                <Icon
                  icon={'listView'}
                  type="outline"
                  color={gridView ? 'dark200' : 'blue400'}
                />
              </button>
            </Box>
          </Box>

          {gridView && (
            <Box>
              {mockData &&
                mockData.map((dataItem, index) => {
                  return (
                    <Box marginBottom={3} key={index}>
                      <CategoryCard
                        key={index}
                        heading={dataItem.heading}
                        text={dataItem.text}
                        tags={getTags()}
                        icon={<img src={dataItem.iconSrc} />}
                        sidePanelConfig={{
                          cta: createPrimaryCTA(),
                          onCheck: () => console.log('onCheck'),
                          buttonLabel: 'Sækja um',
                          checkboxLabel: 'Setja í samanburð',
                          items: [
                            {
                              icon: (
                                <Icon
                                  icon={'school'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Grunnnám',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'calendar'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Hefst 01.01.2024',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'document'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Inntökupróf: Já',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'time'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Námstími: 3 ár',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'person'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Staðnám',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'wallet'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: '75.000. (per ár)',
                            },
                          ],
                        }}
                      />
                    </Box>
                  )
                })}
            </Box>
          )}
          {!gridView && (
            <GridContainer className={styles.gridContainer}>
              <GridRow rowGap={3}>
                {mockData &&
                  mockData.map((dataItem, index) => {
                    return (
                      <GridColumn span="1/3" key={index}>
                        <ListViewCard
                          key={index}
                          iconText="Háskólinn í Reykjavík"
                          heading={dataItem.heading}
                          icon={<img src={dataItem.iconSrc} />}
                          onCheck={() => console.log('onCheck')}
                          buttonLabel="Sækja um"
                          checkboxLabel="Setja í samanburð"
                          cta={createPrimaryCTA()}
                          href=""
                          infoItems={[
                            {
                              icon: (
                                <Icon
                                  icon={'school'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Grunnnám',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'calendar'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Hefst 01.01.2024',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'document'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Inntökupróf: Já',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'time'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Námstími: 3 ár',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'person'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: 'Staðnám',
                            },
                            {
                              icon: (
                                <Icon
                                  icon={'wallet'}
                                  type="outline"
                                  color="blue400"
                                />
                              ),
                              title: '75.000. (per ár)',
                            },
                          ]}
                        />
                      </GridColumn>
                    )
                  })}
              </GridRow>
            </GridContainer>
          )}

          <Box marginTop={2}>
            <Pagination
              variant="purple"
              page={selectedPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={mockData.length}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <button
                  onClick={() => {
                    setSelectedPage(page)
                  }}
                >
                  <span className={className}>{children}</span>
                </button>
              )}
            />
          </Box>
        </Box>
      </Box>
    </GridContainer>
  )
}

UniversitySearch.getInitialProps = async ({ apolloClient, locale }) => {
  // const namespaceResponse = await apolloClient.query<
  //   GetNamespaceQuery,
  //   GetNamespaceQueryVariables
  // >({
  //   query: GET_NAMESPACE_QUERY,
  //   variables: {
  //     input: {
  //       lang: locale,
  //       namespace: 'Starfatorg',
  //     },
  //   },
  // })

  // const namespace = JSON.parse(
  //   namespaceResponse?.data?.getNamespace?.fields || '{}',
  // ) as Record<string, string>

  // if (namespace['display404']) {
  //   throw new CustomNextError(404, 'Vacancies on Ísland.is are turned off')
  // }

  // const vacanciesResponse = await apolloClient.query<
  //   GetIcelandicGovernmentInstitutionVacanciesQuery,
  //   GetIcelandicGovernmentInstitutionVacanciesQueryVariables
  // >({
  //   query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES,
  //   variables: {
  //     input: {},
  //   },
  // })

  // const vacancies =
  //   vacanciesResponse.data.icelandicGovernmentInstitutionVacancies.vacancies

  // const institutionNames = mapVacanciesField(vacancies, 'institutionName').map(
  //   ({ label }) => label,
  // )

  // const organizationsResponse = await apolloClient.query<
  //   Query,
  //   QueryGetOrganizationsArgs
  // >({
  //   query: GET_ORGANIZATIONS_QUERY,
  //   variables: {
  //     input: {
  //       lang: locale,
  //       organizationTitles: institutionNames,
  //     },
  //   },
  // })

  const api = `${UNIVERSITY_GATEWAY_BASE_URL}`
  let response

  try {
    response = await axios.get(`${api}/programs`)
    console.log('response', response)
  } catch (e) {
    const errMsg = 'Failed to retrieve program'
    const description = e.response.data.description

    //   this.logger.error(errMsg, {
    //     message: description,
    //   })

    throw new Error(`${errMsg}: ${description}`)
  }

  // if (response.data.results.length > 0) {
  //   console.log('response', response.data.results)
  //   return response.data.results[0]
  // }

  const mockData = [
    {
      heading: 'Viðskiptafræði með lögfræði sem aukagrein',
      text:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc: 'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
    },
    {
      heading: 'Viðskiptafræði',
      text:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc: 'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
    },
    {
      heading: 'Lögfræði',
      text:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc:
        'https://zeroheight-uploads.s3.eu-west-1.amazonaws.com/6b8ae3f96a2d0e1ae883d0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3AVNYHQKTB7DNOEL%2F20230719%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230719T145800Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=774db23aca012063927fe8b62fc9b072d434deec186c37b2cd64621f1ecb08ca',
    },
    {
      heading: 'Tölvunarfræði',
      text:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',

      iconSrc:
        'https://zeroheight-uploads.s3.eu-west-1.amazonaws.com/6b8ae3f96a2d0e1ae883d0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3AVNYHQKTB7DNOEL%2F20230719%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230719T145800Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=774db23aca012063927fe8b62fc9b072d434deec186c37b2cd64621f1ecb08ca',
    },
  ]

  return {
    mockData,
  }
}

export default withMainLayout(UniversitySearch)
