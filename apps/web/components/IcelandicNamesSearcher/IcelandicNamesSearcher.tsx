import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { useLazyQuery } from '@apollo/client'
import cn from 'classnames'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  SidebarAccordion,
  Stack,
  Text,
  Table as T,
  ButtonProps,
  Icon,
  Input,
  Link,
  Hidden,
  Tooltip,
} from '@island.is/island-ui/core'

import { alphabet } from './data'
import {
  GetIcelandicNameBySearchQuery,
  GetIcelandicNameBySearchQueryVariables,
  GetIcelandicNameByInitialLetterQuery,
  GetIcelandicNameByInitialLetterQueryVariables,
  IcelandicName,
} from '@island.is/web/graphql/schema'
import {
  GET_ICELANDIC_NAME_BY_SEARCH,
  GET_ICELANDIC_NAME_BY_INITIAL_LETTER,
} from '@island.is/web/screens/queries/IcelandicNamesRegistry'

import * as styles from './IcelandicNamesSearcher.css'

type ToggledFiltersState = {
  males: boolean
  females: boolean
  neutral: boolean
  middleNames: boolean
  approved: boolean
  denied: boolean
  pending: boolean
}

const initialToggledFiltersState: ToggledFiltersState = {
  males: false,
  females: false,
  neutral: false,
  middleNames: false,
  approved: false,
  denied: false,
  pending: false,
}

type Action =
  | { type: 'toggleMales' }
  | { type: 'toggleFemales' }
  | { type: 'toggleNeutral' }
  | { type: 'toggleMiddleNames' }
  | { type: 'toggleDenied' }
  | { type: 'toggleApproved' }
  | { type: 'clearCategories' }
  | { type: 'clearStatuses' }
  | { type: 'clearAll' }

const toggledFiltersReducer = (
  state: ToggledFiltersState,
  action: Action,
): ToggledFiltersState => {
  switch (action.type) {
    case 'toggleMales':
      return { ...state, males: !state.males }
    case 'toggleFemales':
      return { ...state, females: !state.females }
    case 'toggleNeutral':
      return { ...state, neutral: !state.neutral }
    case 'toggleMiddleNames':
      return { ...state, middleNames: !state.middleNames }
    case 'toggleDenied':
      return { ...state, denied: !state.denied }
    case 'toggleApproved':
      return { ...state, approved: !state.approved }
    case 'clearCategories':
      return { ...state, males: false, females: false, middleNames: false }
    case 'clearStatuses':
      return { ...state, approved: false, denied: false }
    case 'clearAll':
      return initialToggledFiltersState
    default:
      throw new Error()
  }
}

type NameType = Pick<
  IcelandicName,
  | 'id'
  | 'icelandicName'
  | 'type'
  | 'status'
  | 'verdict'
  | 'visible'
  | 'description'
  | 'url'
>

export const IcelandicNamesSearcher = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedLetter, setSelectedLetter] = useState<string>('')
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [tableData, setTableData] = useState<NameType[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [search, { data: searchData, loading: searchLoading }] = useLazyQuery<
    GetIcelandicNameBySearchQuery,
    GetIcelandicNameBySearchQueryVariables
  >(GET_ICELANDIC_NAME_BY_SEARCH, {
    fetchPolicy: 'no-cache',
  })

  const [
    searchByInitialLetter,
    { data: searchByInitialLetterData, loading: searchByInitialLetterloading },
  ] = useLazyQuery<
    GetIcelandicNameByInitialLetterQuery,
    GetIcelandicNameByInitialLetterQueryVariables
  >(GET_ICELANDIC_NAME_BY_INITIAL_LETTER, {
    fetchPolicy: 'no-cache',
  })

  const isBusy = searchLoading || searchByInitialLetterloading

  const [filteredNamesList, setFilteredNamesList] = useState<NameType[]>(
    tableData,
  )
  const [filters, dispatch] = useReducer(
    toggledFiltersReducer,
    initialToggledFiltersState,
  )

  const filterFns = {
    denied: (x: NameType) => x.status === 'Haf',
    approved: (x: NameType) => x.status === 'Sam',
    pending: (x: NameType) => x.status === 'Óaf',
    females: (x: NameType) => ['ST', 'RST'].includes(x.type),
    males: (x: NameType) => ['DR', 'RDR'].includes(x.type),
    neutral: (x: NameType) => ['KH', 'RKH'].includes(x.type),
    middleNames: (x: NameType) => x.type === 'MI',
  }

  useMemo(() => {
    if (searchData?.getIcelandicNameBySearch) {
      setTableData(searchData.getIcelandicNameBySearch)
    }
  }, [searchData])

  useMemo(() => {
    if (searchByInitialLetterData?.getIcelandicNameByInitialLetter) {
      setTableData(searchByInitialLetterData.getIcelandicNameByInitialLetter)
    }
  }, [searchByInitialLetterData])

  useLayoutEffect(() => {
    const filtersSelected = Object.keys(filters).filter((key) => filters[key])

    const data = tableData.filter((x) => x.visible)

    if (filtersSelected.length) {
      const filtered = data.filter((x) => {
        return filtersSelected
          .map((f) => {
            const fn = filterFns[f]
            if (!fn) return true
            return fn(x)
          })
          .some((x) => x)
      })
      setFilteredNamesList(filtered)
    } else {
      setFilteredNamesList(data)
    }
  }, [tableData, filters])

  const doSearch = useCallback(() => {
    setHasSearched(true)
    setSelectedLetter('')
    search({ variables: { input: { q: searchQuery } } })
    inputRef?.current?.focus()
  }, [search, inputRef, searchQuery])

  const doSearchByInitialLetter = useCallback((letter: string) => {
    setHasSearched(true)
    setSearchQuery('')
    searchByInitialLetter({
      variables: { input: { initialLetter: letter } },
    })
    inputRef?.current?.focus()
  }, [])

  const statusFilterSelected =
    filters.approved || filters.denied || filters.pending
  const typeFilterSelected =
    filters.females || filters.males || filters.middleNames || filters.neutral
  const someFilterSelected = Object.keys(filters).filter((key) => filters[key])
    .length

  return (
    <Box marginBottom={[3, 3, 3, 10, 20]} className={styles.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12', '3/5']}>
            <Box marginTop={3} marginBottom={[1, 1, 1, 1, 3]}>
              <Input
                backgroundColor="blue"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchQuery.length > 1) {
                      doSearch()
                    }
                  }
                }}
                name="q"
                ref={inputRef}
                label={'Nafnaleit'}
                placeholder={'Leita að nafni'}
                size="sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
              />
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12', '2/5']}>
            {` `}
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12', '3/5']}
            order={[2, 2, 2, 2, 1]}
            paddingTop={[2, 2, 2, 2, 0]}
          >
            {hasSearched && (
              <Box>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>Flokkur</T.HeadData>
                      <T.HeadData>Nafn</T.HeadData>
                      <T.HeadData>Úrskurður</T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {isBusy && (
                      <T.Row>
                        <T.Data colSpan={3}>Augnablik...</T.Data>
                      </T.Row>
                    )}
                    {!isBusy && !filteredNamesList.length && (
                      <T.Row>
                        <T.Data colSpan={3}>
                          {!tableData.length
                            ? 'Ekkert fannst'
                            : 'Ekkert fannst með völdum síum'}
                        </T.Data>
                      </T.Row>
                    )}
                    {!isBusy &&
                      filteredNamesList.map(
                        (
                          {
                            icelandicName,
                            description,
                            status,
                            type,
                            verdict,
                            url,
                          },
                          index,
                        ) => {
                          const rejected = status === 'Haf'
                          const approved = status === 'Sam'

                          return (
                            <T.Row key={index}>
                              <T.Data>
                                <Text>
                                  {
                                    NameTypeStrings[
                                      type as keyof typeof NameTypeStrings
                                    ]
                                  }
                                </Text>
                              </T.Data>
                              <T.Data>
                                <Box className={styles.data}>
                                  <Text as="span" fontWeight="semiBold">
                                    {`${icelandicName[0].toUpperCase()}${icelandicName.substring(
                                      1,
                                    )}`}
                                  </Text>
                                  {!!description && (
                                    <Box
                                      className={styles.tooltip}
                                      marginLeft={1}
                                    >
                                      <Tooltip
                                        color="blue300"
                                        text={description}
                                        iconSize="small"
                                        as="span"
                                      />
                                    </Box>
                                  )}
                                </Box>
                              </T.Data>
                              <T.Data>
                                <Box className={styles.data}>
                                  <Box className={styles.icon} marginRight={1}>
                                    {!!rejected && (
                                      <Icon
                                        size="small"
                                        type="filled"
                                        icon="close"
                                        color="red600"
                                      />
                                    )}
                                    {!!approved && (
                                      <Icon
                                        size="small"
                                        type="filled"
                                        icon="checkmark"
                                        color="blue400"
                                      />
                                    )}
                                  </Box>
                                  <Box>
                                    {!!verdict && url ? (
                                      <Link href={url} skipTab>
                                        <Button
                                          colorScheme={
                                            status === 'Haf'
                                              ? 'destructive'
                                              : 'default'
                                          }
                                          variant="text"
                                          size="small"
                                          icon="open"
                                          iconType="outline"
                                          as="span"
                                        >
                                          {verdict}
                                        </Button>
                                      </Link>
                                    ) : (
                                      <Text
                                        variant="small"
                                        fontWeight="semiBold"
                                        color={
                                          status === 'Haf'
                                            ? 'red600'
                                            : 'blue400'
                                        }
                                      >
                                        {status === 'Haf'}
                                        {verdict}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                              </T.Data>
                            </T.Row>
                          )
                        },
                      )}
                  </T.Body>
                </T.Table>
              </Box>
            )}
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12', '2/5']}
            order={[1, 1, 1, 1, 2]}
            paddingTop={[2, 2, 2, 2, 0]}
          >
            <Hidden below="xl">
              <Box marginBottom={[1, 1, 2]}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box flexGrow={1}>
                    <Text variant="h3">Sía lista</Text>
                  </Box>
                  <Box>
                    <Icon
                      icon="filter"
                      type="filled"
                      color="blue400"
                      size="small"
                    />
                  </Box>
                </Box>
                <Box paddingY={1}>
                  <Divider />
                </Box>
              </Box>
            </Hidden>
            <Stack space={[1, 1, 2]}>
              <Box padding={2} borderRadius="large" border="standard">
                <SidebarAccordion
                  id="icelandic_names_alphabet"
                  label="Upphafsstafur"
                >
                  <div className={styles.alphabetList}>
                    {alphabet.map((letter, index) => {
                      return (
                        <button
                          aria-label={letter}
                          className={cn(styles.alphabetButton, {
                            [styles.alphabetButtonSelected]:
                              selectedLetter === letter,
                          })}
                          key={index}
                          onClick={() => {
                            setSelectedLetter(letter)
                            doSearchByInitialLetter(letter)
                          }}
                        >
                          {letter}
                        </button>
                      )
                    })}
                    {!!selectedLetter && (
                      <ResetButton
                        onClick={() => {
                          setSelectedLetter('')
                          setTableData([])
                        }}
                      >
                        Hreinsa síu
                      </ResetButton>
                    )}
                  </div>
                </SidebarAccordion>
                <Box paddingY={2}>
                  <Divider />
                </Box>
                <SidebarAccordion
                  id="icelandic_names_categories"
                  label="Flokkur"
                >
                  <Stack space={[1, 1, 2]}>
                    <Checkbox
                      label="Drengir"
                      checked={filters.males}
                      onChange={() => dispatch({ type: 'toggleMales' })}
                    />
                    <Checkbox
                      label="Stúlkur"
                      checked={filters.females}
                      onChange={() => dispatch({ type: 'toggleFemales' })}
                    />
                    <Checkbox
                      label="Kynhlutlaus"
                      checked={filters.neutral}
                      onChange={() => dispatch({ type: 'toggleNeutral' })}
                    />
                    <Checkbox
                      label="Millinöfn (öll kyn)"
                      checked={filters.middleNames}
                      onChange={() => dispatch({ type: 'toggleMiddleNames' })}
                    />
                    {!!typeFilterSelected && (
                      <ResetButton
                        onClick={() => dispatch({ type: 'clearCategories' })}
                      >
                        Hreinsa síu
                      </ResetButton>
                    )}
                  </Stack>
                </SidebarAccordion>
                <Box paddingY={2}>
                  <Divider />
                </Box>
                <SidebarAccordion id="icelandic_names_statuses" label="Staða">
                  <Stack space={[1, 1, 2]}>
                    <Checkbox
                      label="Samþykkt"
                      checked={filters.approved}
                      onChange={() => dispatch({ type: 'toggleApproved' })}
                    />
                    <Checkbox
                      label="Hafnað"
                      checked={filters.denied}
                      onChange={() => dispatch({ type: 'toggleDenied' })}
                    />
                    {!!statusFilterSelected && (
                      <ResetButton
                        onClick={() => dispatch({ type: 'clearStatuses' })}
                      >
                        Hreinsa síu
                      </ResetButton>
                    )}
                  </Stack>
                </SidebarAccordion>
              </Box>
              {!!someFilterSelected && (
                <ResetButton
                  onClick={() => {
                    if (selectedLetter) {
                      setTableData([])
                    }

                    setSelectedLetter('')
                    dispatch({ type: 'clearAll' })
                  }}
                >
                  Hreinsa allar síur
                </ResetButton>
              )}
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

const ResetButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Box
      display="inlineFlex"
      alignItems="flexEnd"
      flexDirection="column"
      width="full"
    >
      <Button variant="text" size="small" icon="reload" {...rest}>
        {children}
      </Button>
    </Box>
  )
}

const NameTypeStrings = {
  ST: 'Stúlkur',
  DR: 'Drengir',
  KH: 'Kynhlutlaust',
  MI: 'Millinafn',
  RST: 'Stúlkur (ritbr.)',
  RDR: 'Drengir (ritbr.)',
  RKH: 'Kynhlutlaust (ritbr.)',
}

export default IcelandicNamesSearcher
