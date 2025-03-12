import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWindowSize } from 'react-use'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Button,
  Icon,
  Link,
  LoadingDots,
  Table as T,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  GetIcelandicNameByInitialLetterQuery,
  GetIcelandicNameByInitialLetterQueryVariables,
  GetIcelandicNameBySearchQuery,
  GetIcelandicNameBySearchQueryVariables,
  IcelandicName,
} from '@island.is/web/graphql/schema'
import {
  GET_ICELANDIC_NAME_BY_INITIAL_LETTER,
  GET_ICELANDIC_NAME_BY_SEARCH,
} from '@island.is/web/screens/queries/IcelandicNamesRegistry'

import { alphabet } from './data'
import {
  CategoriesProps,
  FilterLabels,
  FilterMenu,
  FilterOptions,
  initialFilter,
} from './FilterMenu'
import * as styles from './IcelandicNamesSearcher.css'

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

type FilterFns = Array<(x: NameType) => boolean>

export const IcelandicNamesSearcher = () => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)
  const [isMultiFiltered, setIsMultiFiltered] = useState(false)
  const [tableData, setTableData] = useState<NameType[]>([])
  const [filter, setFilter] = useState<FilterOptions>({ ...initialFilter })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      setIsMobile(true)
      return
    }
    setIsMobile(false)
  }, [width])

  const [
    search,
    { data: searchData, loading: searchLoading, called: searchCalled },
  ] = useLazyQuery<
    GetIcelandicNameBySearchQuery,
    GetIcelandicNameBySearchQueryVariables
  >(GET_ICELANDIC_NAME_BY_SEARCH)

  const [
    searchByInitialLetter,
    {
      data: searchByInitialLetterData,
      loading: searchByInitialLetterLoading,
      called: searchByLetterDataCalled,
    },
  ] = useLazyQuery<
    GetIcelandicNameByInitialLetterQuery,
    GetIcelandicNameByInitialLetterQueryVariables
  >(GET_ICELANDIC_NAME_BY_INITIAL_LETTER)

  const [filteredNamesList, setFilteredNamesList] =
    useState<NameType[]>(tableData)

  useMemo(() => {
    if (searchData?.getIcelandicNameBySearch) {
      setTableData(searchData.getIcelandicNameBySearch)
    }
  }, [searchData?.getIcelandicNameBySearch])

  useMemo(() => {
    if (searchByInitialLetterData?.getIcelandicNameByInitialLetter) {
      setTableData(searchByInitialLetterData.getIcelandicNameByInitialLetter)
    }
  }, [searchByInitialLetterData?.getIcelandicNameByInitialLetter])

  const doSearch = useCallback(
    (s: string) => {
      if (s.length) {
        search({ variables: { input: { q: s } } })
      }
    },
    [search],
  )

  const doSearchByInitialLetter = useCallback(
    (s: string) => {
      searchByInitialLetter({
        variables: { input: { initialLetter: s } },
      })
    },
    [searchByInitialLetter],
  )

  useEffect(() => {
    if (searchQuery.length) {
      doSearch(searchQuery)
    }

    if (filter.upphafsstafur.length) {
      doSearchByInitialLetter(filter.upphafsstafur[0])
    }
  }, [searchQuery, doSearch, doSearchByInitialLetter, filter.upphafsstafur])

  useEffect(() => {
    const data = tableData.filter((x) => x.visible)

    const kyn: string[] = filter.kyn.reduce((a, b) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      a.push(...b.split('|'))
      return a
    }, [])

    const filterFns: FilterFns = [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      (x) => !kyn.length || kyn.includes(x.type),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      (x) => !filter.stada.length || filter.stada.includes(x.status),
    ]

    const filteredData = data.filter((x) => filterFns.every((f) => f(x)))

    setIsMultiFiltered(
      Object.values(filter).some((x) => Array.isArray(x) && x.length > 0),
    )

    setFilteredNamesList(filteredData)
  }, [tableData, filter])

  const categories: CategoriesProps[] = [
    {
      id: 'upphafsstafur',
      label: 'Upphafsstafur',
      selected: filter.upphafsstafur,
      filters: alphabet.map((x) => ({
        label: (
          <Box style={{ width: 32 }}>
            <Text variant="eyebrow">{x.toUpperCase()}</Text>
          </Box>
        ),
        value: x,
      })),
      singleOption: true,
      inline: true,
    },
    {
      id: 'kyn',
      label: 'Kyn',
      selected: filter.kyn,
      filters: [
        {
          label: 'Stúlkur',
          value: 'ST|RST',
        },
        {
          label: 'Drengir',
          value: 'DR|RDR',
        },
        {
          label: 'Kynhlutlaust',
          value: 'KH|RKH',
        },
        {
          label: 'Millinafn',
          value: 'MI',
        },
      ],
    },
    {
      id: 'stada',
      label: 'Staða',
      selected: filter.stada,
      filters: [
        {
          label: 'Samþykkt',
          value: 'Sam',
        },
        {
          label: 'Hafnað',
          value: 'Haf',
        },
        { label: 'Óafgreitt', value: 'Óaf' },
      ],
    },
  ]

  const isBusy = searchLoading || searchByInitialLetterLoading

  const nothingFound =
    !isBusy &&
    (searchCalled || searchByLetterDataCalled) &&
    !filteredNamesList.length

  return (
    <Box marginBottom={[3, 3, 3, 10, 20]} className={styles.container}>
      <Box marginY={3}>
        <FilterMenu
          {...filterLabels}
          categories={categories}
          filter={filter}
          setFilter={setFilter}
          setSearchQuery={setSearchQuery}
          resultCount={filteredNamesList.length}
          align="left"
          variant={isMobile ? 'dialog' : 'popover'}
        />
      </Box>
      {nothingFound &&
        (isMultiFiltered ? (
          <Text>Ekkert fannst með völdum síum.</Text>
        ) : (
          <Text>Ekkert fannst.</Text>
        ))}
      {isBusy && (
        <Text>
          <LoadingDots />
        </Text>
      )}
      {!isBusy &&
        (searchCalled || searchByLetterDataCalled) &&
        !!filteredNamesList.length && (
          <Box position="relative">
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>Flokkur</T.HeadData>
                  <T.HeadData>Nafn</T.HeadData>
                  <T.HeadData>Úrskurður</T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {filteredNamesList.map(
                  (
                    { icelandicName, description, status, type, verdict, url },
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
                              <Box className={styles.tooltip} marginLeft={1}>
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
                                    status === 'Haf' ? 'red600' : 'blue400'
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
    </Box>
  )
}

const filterLabels: FilterLabels = {
  labelClearAll: 'Hreinsa allar síur',
  labelClear: 'Hreinsa síu',
  labelOpen: 'Sía niðurstöður',
  labelClose: 'Loka síu',
  labelTitle: 'Sía mannanöfn',
  labelResult: 'Sjá niðurstöður',
  inputPlaceholder: 'Leita að nafni',
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
