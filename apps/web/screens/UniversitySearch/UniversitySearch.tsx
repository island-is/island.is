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
  ToastContainer,
  toast,
  Hidden,
  Filter,
  FilterMultiChoice,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useEffect, useRef, useState } from 'react'
import * as styles from './UniversitySearch.css'
import { Comparison, ListViewCard } from '@island.is/web/components'
import { UNIVERSITY_GATEWAY_BASE_URL } from '@island.is/web/constants'
import axios from 'axios'
import { useRouter } from 'next/router'
import Fuse from 'fuse.js'
import { SearchProducts } from '@island.is/web/utils/useUniversitySearch'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'
import { GET_UNIVERSITY_GATEWAY_PROGRAM_LIST } from '../queries/UniversityGateway'

const ITEMS_PER_PAGE = 8
const NUMBER_OF_FILTERS = 6
const MAX_SELECTED_COMPARISON = 3

interface UniversitySearchProps {
  mockData: any
  data: any
  mockFiltering: any
}

interface FilterProps {
  applications: Array<string>
  degreeType: Array<string>
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
  degreeType: [],
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
  mockFiltering,
}) => {
  console.log('data here', data)
  // const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const isMobileScreenWidth = width < theme.breakpoints.md
  const isTabletScreenWidth = width < theme.breakpoints.lg

  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPage, setSelectedPage] = useState(1)
  const [selectedComparison, setSelectedComparison] = useState<
    Array<ComparisonProps>
  >([])
  const [query, setQuery] = useState('')
  const searchTermHasBeenInitialized = useRef(false)
  const [filteredResults, setFilteredResults] = useState<
    Array<Fuse.FuseResult<any>>
  >(
    data.map((item: any, index: number) => {
      return { item, refIndex: index, score: 1 }
    }),
  )

  const [filters, setFilters] = useState<FilterProps>(intialFilters)

  const [gridView, setGridView] = useState<boolean>(true)
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)

  useEffect(() => {
    const comp = localStorage.getItem('comparison')
    const comparison = JSON.parse(!!comp ? comp : '')
    const viewChoice = localStorage.getItem('viewChoice')
    if (!!comparison) {
      setSelectedComparison(comparison)
    }

    if (!!viewChoice) {
      setGridView(viewChoice === 'true' ? true : false)
    }
  }, [])

  const fuseOptions = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.2,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ['nameIs', 'departmentNameIs', 'descriptionIs', 'degreeType'],
  }

  const fuseInstance = new Fuse(data, fuseOptions)

  useEffect(() => {
    let activeFiltersFound: Array<{ key: string; value: Array<string> }> = []
    Object.keys(filters).forEach(function (key, index) {
      let str = key as keyof typeof filters
      if (filters[str].length > 0) {
        activeFiltersFound.push({ key, value: filters[str] })
      }
    })
    //if no filters are active, then show no products
    if (query === '' && activeFiltersFound.length === 0) {
      resetFilteredList()
    } else {
      const results = SearchProducts({
        fuseInstance,
        query,
        activeFilters: activeFiltersFound,
      })

      setFilteredResults(results)
    }
  }, [filters, query])

  const resetFilteredList = () => {
    const resultProducts: Array<Fuse.FuseResult<any>> = data.map(
      (item: any, index: number) => {
        return { item, refIndex: index, score: 1 }
      },
    )

    setFilteredResults(resultProducts)
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
    let str = filterKey as keyof typeof filters
    if (filters[str].includes(filterValue)) {
      const index = filters[str].indexOf(filterValue)
      const specificArray = filters[str]
      specificArray.splice(index, 1)
      setFilters({ ...filters, [filterKey]: specificArray })
    } else {
      setFilters({
        ...filters,
        [filterKey]: [...filters[str], filterValue],
      })
    }
  }

  useEffect(() => {
    console.log('filters', filters)
  }, [filters])

  const handleComparisonChange = (dataItem: ComparisonProps) => {
    let found = false
    selectedComparison.forEach((x) => {
      if (x.id === dataItem.id) {
        found = true
      }
    })

    if (!found) {
      console.log('selectedComlength', selectedComparison.length)
      if (selectedComparison.length === MAX_SELECTED_COMPARISON) {
        //comparison can only include 3 items so display error message if trying to add the fourth
        toast.error(
          `Aðeins er hægt að hafa ${MAX_SELECTED_COMPARISON} nám í samanburði`,
        )
      } else {
        setSelectedComparison([...selectedComparison, dataItem])
      }
    } else {
      setSelectedComparison(
        selectedComparison.filter((item) => {
          if (item.id !== dataItem.id) {
            return true
          }
          return false
        }),
      )
    }
  }

  useEffect(() => {
    //update localStorage
    localStorage.setItem('comparison', JSON.stringify(selectedComparison))
  }, [selectedComparison])

  useEffect(() => {
    //update localStorage
    localStorage.setItem('viewChoice', gridView ? 'true' : 'false')
  }, [gridView])

  const predefinedFilterOpenings: Array<boolean> = []
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
      <Box marginBottom={8} marginTop={5}>
        <Box
          display="flex"
          flexDirection="row"
          columnGap={15}
          paddingBottom={8}
        >
          <Hidden below="md">
            <Box
              height="full"
              className={styles.filterWrapper}
              display="flex"
              flexDirection="column"
            >
              <Box display="inline" marginBottom={3}>
                <Text title="Sía niðurstöður" variant="h3" as="h2">
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
                  labelUse="p"
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
                        filters.applications.filter((x) => x === 'open')
                          .length > 0
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
                      onClick={() =>
                        setFilters({ ...filters, applications: [] })
                      }
                    >
                      Hreinsa val
                    </Button>
                  </Box>
                </AccordionItem>

                <AccordionItem
                  id="mini_accordion2"
                  label="Námstig"
                  labelUse="p"
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
                        filters.degreeType.filter((x) => x === 'diploma')
                          .length > 0
                      }
                      onChange={(e) => checkboxEventHandler(e, 'degreeType')}
                    />
                    <Checkbox
                      label="Grunnnám"
                      id="undergrad"
                      value="UNDERGRADUATE"
                      checked={
                        filters.degreeType.filter((x) => x === 'UNDERGRADUATE')
                          .length > 0
                      }
                      onChange={(e) => checkboxEventHandler(e, 'degreeType')}
                    />
                    <Checkbox
                      label="Viðbótardiplóma"
                      id="vidbotar"
                      value="additionalDiploma"
                      checked={
                        filters.degreeType.filter(
                          (x) => x === 'additionalDiploma',
                        ).length > 0
                      }
                      onChange={(e) => checkboxEventHandler(e, 'degreeType')}
                    />
                    <Checkbox
                      label="Meistaranám"
                      id="master"
                      value="MASTERS"
                      checked={
                        filters.degreeType.filter((x) => x === 'MASTERS')
                          .length > 0
                      }
                      onChange={(e) => checkboxEventHandler(e, 'degreeType')}
                    />
                    <Checkbox
                      label="Doktorsnám"
                      id="dr"
                      value="DOCTORAL"
                      checked={
                        filters.degreeType.filter((x) => x === 'DOCTORAL')
                          .length > 0
                      }
                      onChange={(e) => checkboxEventHandler(e, 'degreeType')}
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
                      onClick={() => setFilters({ ...filters, degreeType: [] })}
                    >
                      Hreinsa val
                    </Button>
                  </Box>
                </AccordionItem>

                <AccordionItem
                  id="mini_accordion3"
                  label="Misseri"
                  labelUse="p"
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
                        filters.studyTime.filter((x) => x === 'spring').length >
                        0
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
                  labelUse="p"
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
                        filters.typeOfStudy.filter((x) => x === 'onSite')
                          .length > 0
                      }
                      onChange={(e) => checkboxEventHandler(e, 'typeOfStudy')}
                    />
                    <Checkbox
                      label="Fjarnám"
                      id="fjarnam"
                      value="away"
                      checked={
                        filters.typeOfStudy.filter((x) => x === 'away').length >
                        0
                      }
                      onChange={(e) => checkboxEventHandler(e, 'typeOfStudy')}
                    />
                    <Checkbox
                      label="Blandað nám"
                      id="blandadnam"
                      value="mixed"
                      checked={
                        filters.typeOfStudy.filter((x) => x === 'mixed')
                          .length > 0
                      }
                      onChange={(e) => checkboxEventHandler(e, 'typeOfStudy')}
                    />
                    <Checkbox
                      label="Dreifinám"
                      id="dreifinam"
                      value="spread"
                      checked={
                        filters.typeOfStudy.filter((x) => x === 'spread')
                          .length > 0
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
                      onClick={() =>
                        setFilters({ ...filters, typeOfStudy: [] })
                      }
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
          </Hidden>

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
                setQuery(e.target.value)
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

            <Hidden above="md">
              <Box width="full" marginTop={2}>
                <Filter
                  resultCount={filteredResults?.length ?? 0}
                  variant={'dialog'}
                  labelClear="Hreinsa"
                  labelClearAll="Hreinsa allar síur"
                  labelOpen="Opna"
                  labelClose="Loka"
                  labelResult="Skoða niðurstöður"
                  labelTitle="Sía niðurstöður"
                  onFilterClear={() => setFilters(intialFilters)}
                >
                  <FilterMultiChoice
                    labelClear="Hreinsa val"
                    onChange={({ categoryId, selected }) => {
                      setSelectedPage(1)
                      // setParameters((prevParameters) => ({
                      //   ...prevParameters,
                      //   [categoryId]: selected,
                      // }))
                    }}
                    onClear={(categoryId) => {
                      setSelectedPage(1)
                      // setParameters((prevParameters) => ({
                      //   ...prevParameters,
                      //   [categoryId]: [],
                      // }))
                    }}
                    categories={mockFiltering.map(
                      (filter: { label: string; options: Array<string> }) => {
                        return {
                          id: 'blabla',
                          label: filter.label,
                          selected: [],
                          filters: filter.options,
                        }
                      },
                    )}
                  ></FilterMultiChoice>
                </Filter>
              </Box>
            </Hidden>

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
              marginTop={isTabletScreenWidth || isMobileScreenWidth ? 2 : 5}
              marginBottom={isTabletScreenWidth || isMobileScreenWidth ? 2 : 5}
            >
              <Text variant="intro">{`${filteredResults.length} Leitarniðurstöður`}</Text>
              <Hidden below="md">
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
              </Hidden>
            </Box>

            {gridView && !isMobileScreenWidth && !isTabletScreenWidth && (
              <Box>
                {filteredResults &&
                  filteredResults.map((item, index) => {
                    const dataItem = item.item
                    return (
                      <Box marginBottom={3} key={index}>
                        <ActionCategoryCard
                          key={index}
                          href="/ahh"
                          heading={dataItem.nameIs}
                          text={dataItem.descriptionIs}
                          icon={
                            <img
                              src="https://www.ru.is/media/HR_logo_hringur_hires.jpg"
                              alt={`Logo fyrir ${dataItem.nameIs}`}
                            />
                          }
                          customBottomContent={
                            <Checkbox
                              label="Setja í samanburð"
                              labelVariant="default"
                              onChange={() =>
                                handleComparisonChange({
                                  id: dataItem.id,
                                  nameIs: dataItem.nameIs,
                                  iconSrc:
                                    'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
                                })
                              }
                              checked={
                                selectedComparison.filter(
                                  (x) => x.id === dataItem.id,
                                ).length > 0
                              }
                              id={dataItem.id}
                            />
                          }
                          sidePanelConfig={{
                            cta: createPrimaryCTA(),
                            buttonLabel: 'Sækja um',
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
            {(!gridView || isMobileScreenWidth || isTabletScreenWidth) && (
              <GridContainer className={styles.gridContainer}>
                <GridRow rowGap={3}>
                  {filteredResults &&
                    filteredResults.map((item, index) => {
                      const dataItem = item.item
                      return (
                        <GridColumn
                          span={
                            isMobileScreenWidth
                              ? '1/1'
                              : isTabletScreenWidth
                              ? '1/2'
                              : '1/3'
                          }
                          key={index}
                        >
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
                              handleComparisonChange({
                                id: dataItem.id,
                                nameIs: dataItem.nameIs,
                                iconSrc:
                                  'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
                              })
                            }
                            checked={
                              selectedComparison.filter(
                                (x) => x.id === dataItem.id,
                              ).length > 0
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

            <Box
              marginTop={2}
              marginBottom={selectedComparison.length > 0 ? 4 : 0}
            >
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
        {selectedComparison.length > 0 &&
          !isTabletScreenWidth &&
          !isMobileScreenWidth && (
            <Box display="flex" flexDirection="column">
              <Box paddingLeft={2} paddingBottom={2}>
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
                  width="full"
                >
                  {selectedComparison.map((item) => {
                    return (
                      <GridColumn span="1/3" key={item.id}>
                        <Comparison>
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="spaceBetween"
                            alignItems="center"
                            width="full"
                          >
                            <Box
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              paddingRight={3}
                              style={{ maxWidth: '90%' }}
                            >
                              <img
                                src="https://www.ru.is/media/HR_logo_hringur_hires.jpg"
                                className={styles.icon}
                                alt={`Logo fyrir ${item.nameIs}`}
                                style={{ paddingRight: 10 }}
                              />
                              <Text variant="h5" truncate>
                                {item.nameIs}
                              </Text>
                            </Box>
                            <Box
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                            >
                              <button
                                onClick={() =>
                                  handleComparisonChange({
                                    id: item.id,
                                    nameIs: item.nameIs,
                                    iconSrc:
                                      'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
                                  })
                                }
                                className={styles.removeButton}
                              >
                                <Icon
                                  className={styles.closeIcon}
                                  icon={'close'}
                                  type="outline"
                                  color="blue400"
                                />
                              </button>
                            </Box>
                          </Box>
                        </Comparison>
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
        {selectedComparison.length > 0 &&
          (isTabletScreenWidth || isMobileScreenWidth) && (
            <Box
              display="flex"
              flexDirection="column"
              width="full"
              background="white"
              padding={3}
              position="fixed"
              bottom={0}
              right={0}
              left={0}
              zIndex={10}
              borderTopWidth="standard"
              borderColor="blue300"
              boxShadow="strong"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
                width="full"
                alignItems="flexStart"
                paddingBottom={2}
              >
                <Text variant="h3">Samanburður</Text>
                <Button
                  variant="text"
                  icon="close"
                  textSize="md"
                  size="small"
                  onClick={() => setSelectedComparison([])}
                >
                  Hreinsa val
                </Button>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
                width="full"
                alignItems="center"
              >
                <Button variant="primary" onClick={() => routeToComparison()}>
                  Skoða samanburð
                </Button>
                <Text
                  variant="h5"
                  as="span"
                >{`${selectedComparison.length} / ${MAX_SELECTED_COMPARISON}`}</Text>
              </Box>
            </Box>
          )}
      </Box>
      <ToastContainer></ToastContainer>
    </GridContainer>
  )
}

UniversitySearch.getProps = async ({ apolloClient, locale }) => {
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

  const newResponse = await apolloClient.query<any, any>({
    query: GET_UNIVERSITY_GATEWAY_PROGRAM_LIST,
    variables: {
      input: {
        limit: 100,
        before: '1',
        after: '2',
        active: true,
        year: 2023,
        universityId: '1',
      },
    },
  })

  console.log('newResponse', newResponse)
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

    console.error('error', errMsg)
    // throw new Error(`${errMsg}:`)
  }

  // if (response.data.results.length > 0) {
  //   console.log('response', response.data.results)
  //   return response.data.results[0]
  // }

  const mockFiltering = [
    {
      label: 'Námsstig',
      value: 'degreeType',
      options: [
        {
          label: 'Grunndiplóma',
          value: 'GRUNN',
        },
        {
          label: 'Grunnnám',
          value: 'UNDERGRADUATE',
        },
        {
          label: 'Viðbótardiplóma',
          value: 'ADDITIONAL',
        },
        {
          label: 'Meistaranám',
          value: 'MASTERS',
        },
        {
          label: 'Doktorsnám',
          value: 'DOCTORS',
        },
      ],
    },
  ]

  const mockData = [
    {
      id: '1234',
      nameIs: 'Viðskiptafræði með lögfræði sem aukagrein',
      descriptionIs:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc: 'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
    },
    {
      id: '235345',
      nameIs: 'Viðskiptafræði',
      descriptionIs:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc: 'https://www.ru.is/media/HR_logo_hringur_hires.jpg',
    },
    {
      id: '56456',
      nameIs: 'Lögfræði',
      descriptionIs:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',
      iconSrc:
        'https://zeroheight-uploads.s3.eu-west-1.amazonaws.com/6b8ae3f96a2d0e1ae883d0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3AVNYHQKTB7DNOEL%2F20230719%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230719T145800Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=774db23aca012063927fe8b62fc9b072d434deec186c37b2cd64621f1ecb08ca',
    },
    {
      id: '678687',
      nameIs: 'Tölvunarfræði',
      descriptionIs:
        'Enim nulla nunc pharetra nisi libero. Ipsum faucibus tortor bibendum massa. Nisl facilisi varius lacus neque purus consequat. Egestas sed lacinia in aliquet praesent mus diam...',

      iconSrc:
        'https://zeroheight-uploads.s3.eu-west-1.amazonaws.com/6b8ae3f96a2d0e1ae883d0?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3AVNYHQKTB7DNOEL%2F20230719%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230719T145800Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=774db23aca012063927fe8b62fc9b072d434deec186c37b2cd64621f1ecb08ca',
    },
  ]

  return {
    mockData,
    data,
    mockFiltering,
  }
}

export default withMainLayout(UniversitySearch, { showFooter: false })
