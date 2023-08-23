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
  LinkV2,
  TopicCard,
  Input,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useEffect, useRef, useState } from 'react'
import * as styles from './UniversitySearch.css'
import { ListViewCard } from '@island.is/web/components'
import { UNIVERSITY_GATEWAY_BASE_URL } from '@island.is/web/constants'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useNavigate } from 'react-router-dom'

const ITEMS_PER_PAGE = 8
const NUMBER_OF_FILTERS = 6

interface UniversitySearchProps {
  mockData: any
  data: any
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

export interface ComparisonProps {
  id: string
  nameIs: string
  iconSrc: string
}

const UniversitySearch: Screen<UniversitySearchProps> = ({
  mockData,
  data,
}) => {
  console.log('data here', data)
  // const n = useNamespace(namespace)
  console.log('mockData', mockData)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectedComparison, setSelectedComparison] = useState<
    Array<ComparisonProps>
  >([])
  const searchTermHasBeenInitialized = useRef(false)

  const [filters, setFilters] = useState<FilterProps>(intialFilters)

  const [gridView, setGridView] = useState<boolean>(true)

  const totalPages = Math.ceil(mockData.length / ITEMS_PER_PAGE)

  useEffect(() => {
    const comparison = JSON.parse(localStorage.getItem('comparison'))
    if (!!comparison) {
      setSelectedComparison(comparison)
    }
  }, [])

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

  const handleCheckbox = (e, dataItem: ComparisonProps) => {
    console.log('dataItem', dataItem)
    let found = false
    selectedComparison.forEach((x) => {
      if (x.id === dataItem.id) {
        found = true
      }
    })

    if (!found) {
      console.log('found')
      setSelectedComparison([...selectedComparison, dataItem])
    } else {
      console.log('not found')
      setSelectedComparison(
        selectedComparison.filter((item) => {
          if (item.id !== dataItem.id) {
            return true
          }
          return false
        }),
      )
    }

    //update localStorage
    console.log('setting comparison')
    localStorage.setItem('comparison', JSON.stringify(selectedComparison))
  }

  const predefinedFilterOpenings = []
  for (var x = 0; x < NUMBER_OF_FILTERS; x++) {
    predefinedFilterOpenings.push(true)
  }

  const [isOpen, setIsOpen] = useState<Array<boolean>>(predefinedFilterOpenings)

  const toggleIsOpen = (index: number, value: boolean) => {
    const newIsOpen = isOpen.map((x, i) => {
      if (i === index) {
        return value
      } else return x
    })

    setIsOpen(newIsOpen)
  }

  const toggleOpenAll = () => {
    setIsOpen(predefinedFilterOpenings)
  }

  const toggleCloseAll = () => {
    const newIsOpen = isOpen.map((x) => {
      return false
    })
    setIsOpen(newIsOpen)
  }

  const checkboxEventHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterKey: string,
  ) => {
    handleFilters(filterKey, e.target.value)
  }

  const routeToComparison = () => {
    router.push(
      `haskolanam/samanburdur?comparison=${JSON.stringify(
        selectedComparison.map((i) => i.id),
      )}`,
    )
  }

  return (
    <GridContainer>
      <LinkV2 href="/haskolanam" skipTab>
        <Button
          preTextIcon="arrowBack"
          preTextIconType="filled"
          size="small"
          type="button"
          variant="text"
          truncate
        >
          Háskólanám
        </Button>
      </LinkV2>
      <Box marginBottom={5} marginTop={5}>
        <Box display="flex" flexDirection="row" columnGap={15}>
          <Box
            height="full"
            className={styles.filterWrapper}
            display="flex"
            flexDirection="column"
          >
            <Box display="inline" marginBottom={3}>
              <Text title="Sía niðurstöður" variant="h3">
                Sía leitarniðurstöður
              </Text>
            </Box>
            <Box
              display="inline"
              style={{ alignSelf: 'flex-end' }}
              marginBottom={1}
            >
              <Button
                variant="text"
                icon="add"
                size="small"
                onClick={() =>
                  isOpen.filter((x) => x === false).length > 0
                    ? toggleOpenAll()
                    : toggleCloseAll()
                }
              >
                {`${
                  isOpen.filter((x) => x === false).length > 0
                    ? 'opna allar síur'
                    : 'loka öllum síum'
                }`}
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
                expanded={isOpen[0]}
                onToggle={() => toggleIsOpen(0, !isOpen[0])}
              >
                <Stack space={[1, 1, 2]}>
                  <Checkbox
                    label="Opið fyrir umsóknir"
                    id="opid"
                    value="open"
                    checked={
                      filters.applications.filter((x) => x === 'open').length >
                      0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'applications')}
                  />
                </Stack>
                <Box
                  display="flex"
                  width="full"
                  flexDirection="row"
                  justifyContent="flexEnd"
                  marginTop={1}
                >
                  <Button
                    variant="text"
                    icon="reload"
                    size="small"
                    onClick={() => setFilters({ ...filters, applications: [] })}
                  >
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
                expanded={isOpen[1]}
                onToggle={() => toggleIsOpen(1, !isOpen[1])}
              >
                <Stack space={[1, 1, 1]}>
                  <Checkbox
                    label="Grunndiplóma"
                    id="grunn"
                    value="diploma"
                    checked={
                      filters.studyLevel.filter((x) => x === 'diploma').length >
                      0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'studyLevel')}
                  />
                  <Checkbox
                    label="Grunnnám"
                    id="undergrad"
                    value="undergrad"
                    checked={
                      filters.studyLevel.filter((x) => x === 'undergrad')
                        .length > 0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'studyLevel')}
                  />
                  <Checkbox
                    label="Viðbótardiplóma"
                    id="vidbotar"
                    value="additionalDiploma"
                    checked={
                      filters.studyLevel.filter(
                        (x) => x === 'additionalDiploma',
                      ).length > 0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'studyLevel')}
                  />
                  <Checkbox
                    label="Meistaranám"
                    id="master"
                    value="masters"
                    checked={
                      filters.studyLevel.filter((x) => x === 'masters').length >
                      0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'studyLevel')}
                  />
                  <Checkbox
                    label="Doktorsnám"
                    id="dr"
                    value="doctors"
                    checked={
                      filters.studyLevel.filter((x) => x === 'doctors').length >
                      0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'studyLevel')}
                  />
                </Stack>
                <Box
                  display="flex"
                  width="full"
                  flexDirection="row"
                  justifyContent="flexEnd"
                  marginTop={1}
                >
                  <Button
                    variant="text"
                    icon="reload"
                    size="small"
                    onClick={() => setFilters({ ...filters, studyLevel: [] })}
                  >
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
                expanded={isOpen[2]}
                onToggle={() => toggleIsOpen(2, !isOpen[2])}
              >
                <Stack space={[1, 1, 2]}>
                  <Checkbox
                    label="Haustmisseri"
                    id="haust"
                    value="fall"
                    checked={
                      filters.studyTime.filter((x) => x === 'fall').length > 0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'studyTime')}
                  />
                  <Checkbox
                    label="Vormisseri"
                    id="vor"
                    value="spring"
                    checked={
                      filters.studyTime.filter((x) => x === 'spring').length > 0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'studyTime')}
                  />
                </Stack>
                <Box
                  display="flex"
                  width="full"
                  flexDirection="row"
                  justifyContent="flexEnd"
                  marginTop={1}
                >
                  <Button
                    variant="text"
                    icon="reload"
                    size="small"
                    onClick={() => setFilters({ ...filters, studyTime: [] })}
                  >
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
                expanded={isOpen[3]}
                onToggle={() => toggleIsOpen(3, !isOpen[3])}
              >
                <Stack space={[1, 1, 2]}>
                  <Checkbox
                    label="Staðnám"
                    id="stadnam"
                    value="onSite"
                    checked={
                      filters.typeOfStudy.filter((x) => x === 'onSite').length >
                      0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'typeOfStudy')}
                  />
                  <Checkbox
                    label="Fjarnám"
                    id="fjarnam"
                    value="away"
                    checked={
                      filters.typeOfStudy.filter((x) => x === 'away').length > 0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'typeOfStudy')}
                  />
                  <Checkbox
                    label="Blandað nám"
                    id="blandadnam"
                    value="mixed"
                    checked={
                      filters.typeOfStudy.filter((x) => x === 'mixed').length >
                      0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'typeOfStudy')}
                  />
                  <Checkbox
                    label="Dreifinám"
                    id="dreifinam"
                    value="spread"
                    checked={
                      filters.typeOfStudy.filter((x) => x === 'spread').length >
                      0
                    }
                    onChange={(e) => checkboxEventHandler(e, 'typeOfStudy')}
                  />
                </Stack>
                <Box
                  display="flex"
                  width="full"
                  flexDirection="row"
                  justifyContent="flexEnd"
                  marginTop={1}
                >
                  <Button
                    variant="text"
                    icon="reload"
                    size="small"
                    onClick={() => setFilters({ ...filters, typeOfStudy: [] })}
                  >
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
              <Button
                variant="text"
                icon="reload"
                size="small"
                onClick={() => setFilters(intialFilters)}
              >
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
            <Input
              label="Leit í háskólanámi"
              // placeholder="Leita"
              id="searchuniversity"
              name="filterInput"
              value={searchTerm}
              backgroundColor="blue"
              onChange={(e) => {
                setSelectedPage(1)
                setSearchTerm(e.target.value)
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
              <Text variant="intro">{`${mockData.length} Leitarniðurstöður`}</Text>
              <Box>
                <button
                  onClick={() => setGridView(true)}
                  className={styles.iconButton}
                >
                  <VisuallyHidden>Breyta niðurstöðum í töflu</VisuallyHidden>
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
                  <VisuallyHidden>Breyta niðurstöðum í lista</VisuallyHidden>
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
                {data &&
                  data.map((dataItem, index) => {
                    return (
                      <Box marginBottom={3} key={index}>
                        <CategoryCard
                          key={index}
                          heading={dataItem.nameIs}
                          text={dataItem.descriptionIs}
                          tags={getTags()}
                          icon={
                            <img
                              src="https://www.ru.is/media/HR_logo_hringur_hires.jpg"
                              alt={`Logo fyrir ${dataItem.nameIs}`}
                            />
                          }
                          component={Button}
                          sidePanelConfig={{
                            cta: createPrimaryCTA(),
                            isChecked:
                              selectedComparison.filter(
                                (x) => x.id === dataItem.id,
                              ).length > 0,
                            onCheck: (e) =>
                              handleCheckbox(e, {
                                id: dataItem.id,
                                nameIs: dataItem.nameIs,
                                iconSrc:
                                  'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
                              }),
                            buttonLabel: 'Sækja um',
                            checkboxLabel: 'Setja í samanburð',
                            checkboxId: dataItem.id,
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
                            heading={dataItem.nameIs}
                            icon={
                              <img
                                src="https://www.ru.is/media/HR_logo_hringur_hires.jpg"
                                alt={`Logo fyrir ${dataItem.nameIs}`}
                              />
                            }
                            onCheck={(e) =>
                              handleCheckbox(e, {
                                id: dataItem.id,
                                nameIs: dataItem.nameIs,
                                iconSrc:
                                  'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
                              })
                            }
                            buttonLabel="Sækja um"
                            checkboxLabel="Setja í samanburð"
                            checkboxId={dataItem.id}
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
        {selectedComparison.length > 0 && (
          <Box display="flex" flexDirection="column">
            <Box paddingLeft={2}>
              <Text variant="h3">Nám í samanburði</Text>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                rowGap={1}
              >
                {selectedComparison.map((item) => {
                  return (
                    <GridColumn span="1/3" key={item.id}>
                      <TopicCard size="small">
                        <Box
                          display="flex"
                          flexDirection="row"
                          justifyContent="spaceBetween"
                          alignItems="center"
                        >
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                          >
                            <img
                              src="https://www.ru.is/media/HR_logo_hringur_hires.jpg"
                              className={styles.icon}
                              alt={`Logo fyrir ${item.nameIs}`}
                            />
                            <Text variant="h5" truncate>
                              {item.nameIs}
                            </Text>
                          </Box>
                          <Box>
                            <Button variant="text" fluid>
                              <Icon
                                icon={'close'}
                                type="outline"
                                color="blue400"
                              />
                            </Button>
                          </Box>
                        </Box>
                      </TopicCard>
                    </GridColumn>
                  )
                })}
              </Box>
              <Button onClick={() => routeToComparison()}>
                <Text variant="h5" whiteSpace="nowrap" color="white">
                  Skoða samanburð
                </Text>
              </Button>
            </Box>
          </Box>
        )}
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
  let data

  try {
    response = await axios.get(`${api}/programs`)
    console.log('response', response)
    data = response?.data?.data
    console.log('data', data)
  } catch (e) {
    const errMsg = 'Failed to retrieve program'
    // const description = e.response.data.description

    //   this.logger.error(errMsg, {
    //     message: description,
    //   })

    throw new Error(`${errMsg}:`)
  }

  // if (response.data.results.length > 0) {
  //   console.log('response', response.data.results)
  //   return response.data.results[0]
  // }

  const mockData = [
    {
      id: '1234',
      heading: 'Viðskiptafræði með lögfræði sem aukagrein',
      text:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc: 'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
    },
    {
      id: '235345',
      heading: 'Viðskiptafræði',
      text:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc: 'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
    },
    {
      id: '56456',
      heading: 'Lögfræði',
      text:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc:
        'https://zeroheight-uploads.s3.eu-west-1.amazonaws.com/6b8ae3f96a2d0e1ae883d0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3AVNYHQKTB7DNOEL%2F20230719%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230719T145800Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=774db23aca012063927fe8b62fc9b072d434deec186c37b2cd64621f1ecb08ca',
    },
    {
      id: '678687',
      heading: 'Tölvunarfræði',
      text:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',

      iconSrc:
        'https://zeroheight-uploads.s3.eu-west-1.amazonaws.com/6b8ae3f96a2d0e1ae883d0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3AVNYHQKTB7DNOEL%2F20230719%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230719T145800Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=774db23aca012063927fe8b62fc9b072d434deec186c37b2cd64621f1ecb08ca',
    },
  ]

  return {
    mockData,
    data,
  }
}

export default withMainLayout(UniversitySearch)
