import React, { useState, useCallback } from 'react'
import {
  Typography,
  Box,
  Stack,
  Columns,
  Column,
  ButtonDeprecated as Button,
  Select,
  Pagination,
  Option,
  DatePicker,
  Input,
} from '@island.is/island-ui/core'
import {
  useListDocuments,
  useDocumentCategories,
} from '@island.is/service-portal/graphql'
import {
  useScrollTopOnUpdate,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { ActionCardLoader } from '@island.is/service-portal/core'
import { Document } from '@island.is/api/schema'

import DocumentCard from '../../components/DocumentCard/DocumentCard'
import { ValueType } from 'react-select'
import { useLocale, useNamespaces } from '@island.is/localization'
import { mockDocuments } from './mock.data'
import Fuse from 'fuse.js'

const defaultCategory = { label: 'Allar Stofnanir', value: '' }
const pageSize = 6
const defaultStartDate = new Date('2000-01-01T00:00:00.000')
const defaultEndDate = new Date()

const defaultFilterValues = {
  dateFrom: defaultStartDate,
  dateTo: defaultEndDate,
  activeCategory: defaultCategory,
  searchQuery: '',
}

const defaultSearchOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.4,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  keys: ['senderName', 'senderNatReg', 'sender', 'subject'],
}

type FilterValues = {
  dateFrom: Date
  dateTo: Date
  activeCategory: Option
  searchQuery: string
}

const getFilteredDocuments = (
  documents: Document[],
  filterValues: FilterValues,
): Document[] => {
  const { dateFrom, dateTo, activeCategory, searchQuery } = filterValues
  if (activeCategory.value) {
    console.log('IM HERHEHRHERH')
    return documents.filter(
      (document) => document.senderNatReg === activeCategory.value,
    )
  }
  if (searchQuery) {
    const fuse = new Fuse(documents, defaultSearchOptions)
    return fuse.search(searchQuery).map((elem) => elem.item)
  }
  return documents
}

export const ServicePortalDocuments: ServicePortalModuleComponent = ({
  userInfo,
}) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  useScrollTopOnUpdate([page])

  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )
  const { data, loading, error } = useListDocuments(userInfo.profile.natreg)
  console.log(data)
  const categories = [defaultCategory, ...data.categories]
  const filteredDocuments = getFilteredDocuments(data.documents, filterValue)
  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(filteredDocuments.length / pageSize),
  }

  const handleDateFromInput = useCallback(
    (value: Date) =>
      setFilterValue({
        ...filterValue,
        dateFrom: value,
      }),
    [],
  )

  const handleDateToInput = useCallback(
    (value: Date) =>
      setFilterValue({
        ...filterValue,
        dateTo: value,
      }),
    [],
  )

  const handlePageChange = useCallback((page: number) => setPage(page), [])
  const handleCategoryChange = useCallback((newCategory: ValueType<Option>) => {
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeCategory: newCategory as Option,
    }))
  }, [])

  const handleSearchChange = useCallback(
    (value: string) =>
      setFilterValue({ ...defaultFilterValues, searchQuery: value }),
    [],
  )

  return (
    <Box marginBottom={[4, 4, 6, 10]}>
      <Stack space={3}>
        <Typography variant="h1" as="h1">
          {formatMessage({
            id: 'sp.documents:title',
            defaultMessage: 'Rafræn skjöl',
          })}
        </Typography>
        <Columns collapseBelow="sm">
          <Column width="7/12">
            <Typography variant="intro">
              {formatMessage({
                id: 'sp.documents:intro',
                defaultMessage:
                  'Hér munt þú geta fundið öll þau skjöl sem eru send til þín frá stofnunum ríkisins',
              })}
            </Typography>
          </Column>
        </Columns>
        <Box marginTop={[1, 1, 2, 2, 6]}>
          <Stack space={2}>
            <div>
              <Stack space={3}>
                <Box height="full">
                  <Input
                    onChange={(ev) => handleSearchChange(ev.target.value)}
                    name="rafraen-skjol-leit"
                    placeholder="Leitaðu af rafrænu skjali"
                  />
                </Box>
                <Box>
                  <Select
                    name="categories"
                    defaultValue={categories[0]}
                    options={categories}
                    value={filterValue.activeCategory}
                    onChange={handleCategoryChange}
                  />
                </Box>
                <Columns space={2} collapseBelow="sm">
                  <Column width="6/12">
                    <DatePicker
                      label="Frá"
                      placeholderText="23.05.20"
                      locale="is"
                      value={filterValue.dateFrom?.toString() || undefined}
                      handleChange={handleDateFromInput}
                    />
                  </Column>
                  <Column width="6/12">
                    <DatePicker
                      label="Til"
                      placeholderText="23.05.20"
                      locale="is"
                      value={filterValue.dateTo?.toString() || undefined}
                      handleChange={handleDateToInput}
                      minDate={filterValue.dateFrom || undefined}
                    />
                  </Column>
                </Columns>
              </Stack>
            </div>
            {loading && <ActionCardLoader repeat={3} />}
            {error && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Typography variant="h3">
                  {formatMessage({
                    id: 'sp.documents:error',
                    defaultMessage:
                      'Tókst ekki að sækja rafræn skjöl, eitthvað fór úrskeiðis',
                  })}
                </Typography>
              </Box>
            )}
            {!loading && !error && filteredDocuments?.length === 0 && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Typography variant="h3">
                  {formatMessage({
                    id: 'sp.documents:not-found',
                    defaultMessage:
                      'Engin skjöl fundust fyrir gefin leitarskilyrði',
                  })}
                </Typography>
              </Box>
            )}
            {filteredDocuments
              ?.slice(pagedDocuments.from, pagedDocuments.to)
              .map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            {filteredDocuments && filteredDocuments.length > pageSize && (
              <Pagination
                page={page}
                totalPages={pagedDocuments.totalPages}
                renderLink={(page, className, children) => (
                  <button
                    className={className}
                    onClick={handlePageChange.bind(null, page)}
                  >
                    {children}
                  </button>
                )}
              />
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export default ServicePortalDocuments
