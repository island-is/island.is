import React, { useState, useCallback } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Text,
  Box,
  Stack,
  Columns,
  Column,
  Button,
  Select,
  Pagination,
  Option,
  DatePicker,
  Input,
  GridRow,
  GridColumn,
  LoadingDots,
  Hidden,
} from '@island.is/island-ui/core'
import { useListDocuments } from '@island.is/service-portal/graphql'
import {
  useScrollToRefOnUpdate,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { Document } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import startOfTomorrow from 'date-fns/startOfTomorrow'
import isWithinInterval from 'date-fns/isWithinInterval'
import isEqual from 'lodash/isEqual'
import { ValueType } from 'react-select'
import { defineMessage } from 'react-intl'
import { documentsSearchDocumentsInitialized } from '@island.is/plausible'
import { useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import AnimateHeight from 'react-animate-height'
import { GET_ORGANIZATIONS_QUERY } from '@island.is/service-portal/graphql'
import * as styles from './Overview.css'
import DocumentLine from '../../components/DocumentLine/DocumentLine'
import getOrganizationLogoUrl from '../../utils/getOrganizationLogoUrl'
import { m } from '@island.is/service-portal/core'

const defaultCategory = { label: 'Allar stofnanir', value: '' }
const pageSize = 15
const defaultStartDate = null
const defaultEndDate = null

const defaultFilterValues = {
  dateFrom: defaultStartDate,
  dateTo: defaultEndDate,
  activeCategory: defaultCategory,
  searchQuery: '',
}

type FilterValues = {
  dateFrom: Date | null
  dateTo: Date | null
  activeCategory: Option
  searchQuery: string
}

const getFilteredDocuments = (
  documents: Document[],
  filterValues: FilterValues,
): Document[] => {
  const { dateFrom, dateTo, activeCategory, searchQuery } = filterValues

  let filteredDocuments = documents.filter((document) => {
    const minDate = dateFrom || new Date('1900-01-01')
    const maxDate = dateTo || startOfTomorrow()
    return isWithinInterval(new Date(document.date), {
      start: isBefore(maxDate, minDate) ? maxDate : minDate,
      end: isAfter(minDate, maxDate) ? minDate : maxDate,
    })
  })

  if (activeCategory.value) {
    filteredDocuments = filteredDocuments.filter(
      (document) => document.senderNatReg === activeCategory.value,
    )
  }

  if (searchQuery) {
    return filteredDocuments.filter((x) =>
      x.subject.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  return filteredDocuments
}

export const ServicePortalDocuments: ServicePortalModuleComponent = ({
  userInfo,
}) => {
  useNamespaces('sp.documents')
  Sentry.configureScope((scope) =>
    scope.setTransactionName('Electronic-Documents'),
  )

  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)
  const [searchInteractionEventSent, setSearchInteractionEventSent] = useState(
    false,
  )
  const { scrollToRef } = useScrollToRefOnUpdate([page])
  const { pathname } = useLocation()

  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )
  const { data, loading, error } = useListDocuments(userInfo.profile.nationalId)
  const categories = [defaultCategory, ...data.categories]
  const filteredDocuments = getFilteredDocuments(data.documents, filterValue)
  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(filteredDocuments.length / pageSize),
  }
  const handleDateFromInput = useCallback((value: Date) => {
    setPage(1)
    setFilterValue((oldState) => {
      const { dateTo } = oldState
      return {
        ...oldState,
        dateTo: dateTo ? (isAfter(value, dateTo) ? value : dateTo) : dateTo,
        dateFrom: value,
      }
    })
  }, [])

  const handleDateToInput = useCallback((value: Date) => {
    setPage(1)
    setFilterValue((oldState) => ({
      ...oldState,
      dateTo: value,
    }))
  }, [])

  const handlePageChange = useCallback((page: number) => setPage(page), [])
  const handleCategoryChange = useCallback((newCategory: ValueType<Option>) => {
    setPage(1)
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeCategory: newCategory as Option,
    }))
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues, searchQuery: value })
    if (!searchInteractionEventSent) {
      documentsSearchDocumentsInitialized(pathname)
      setSearchInteractionEventSent(true)
    }
  }, [])

  const handleClearFilters = useCallback(() => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues })
  }, [])

  const handleDateRangeButtonClick = () => setIsDateRangeOpen(!isDateRangeOpen)

  const hasActiveFilters = () => !isEqual(filterValue, defaultFilterValues)

  const documentsFoundText = () =>
    filteredDocuments.length === 1 ||
    (lang === 'is' && filteredDocuments.length % 10 === 1)
      ? defineMessage({
          id: 'sp.documents:found-singular',
          defaultMessage: 'skjal fannst',
        })
      : defineMessage({
          id: 'sp.documents:found',
          defaultMessage: 'skjöl fundust',
        })

  const { data: orgData } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}

  return (
    <Box marginBottom={[4, 4, 6, 10]}>
      <Stack space={3}>
        <Text variant="h3" as="h1">
          {formatMessage({
            id: 'sp.documents:title',
            defaultMessage: 'Pósthólf',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="7/12">
            <Text variant="default">
              {formatMessage({
                id: 'sp.documents:intro',
                defaultMessage:
                  'Hér munt þú geta fundið öll þau skjöl sem eru send til þín frá stofnunum ríkisins',
              })}
            </Text>
          </Column>
        </Columns>
        <Box marginTop={[1, 1, 2, 2, 6]}>
          <GridRow alignItems="flexEnd">
            <GridColumn paddingBottom={[1, 0]} span={['1/1', '3/8']}>
              <Box height="full">
                <Input
                  icon="search"
                  backgroundColor="blue"
                  size="xs"
                  value={filterValue.searchQuery}
                  onChange={(ev) => handleSearchChange(ev.target.value)}
                  name="rafraen-skjol-leit"
                  label={formatMessage(m.searchLabel)}
                  placeholder={formatMessage(m.searchPlaceholder)}
                />
              </Box>
            </GridColumn>
            <GridColumn span={['1/1', '3/8']}>
              <Select
                name="categories"
                backgroundColor="blue"
                size="xs"
                defaultValue={categories[0]}
                options={categories}
                value={filterValue.activeCategory}
                onChange={handleCategoryChange}
                label={formatMessage({
                  id: 'sp.documents:institution-label',
                  defaultMessage: 'Stofnun',
                })}
              />
            </GridColumn>
            <GridColumn span="2/8">
              <Hidden below="sm">
                <Button
                  variant="ghost"
                  fluid
                  icon={isDateRangeOpen ? 'close' : 'filter'}
                  iconType="outline"
                  size="small"
                  onClick={handleDateRangeButtonClick}
                >
                  {formatMessage({
                    id: 'sp.documents:select-range',
                    defaultMessage: 'Tímabil',
                  })}
                </Button>
              </Hidden>
            </GridColumn>
          </GridRow>
          <AnimateHeight duration={400} height={isDateRangeOpen ? 'auto' : 0}>
            <Box marginTop={[1, 3]}>
              <GridRow>
                <GridColumn paddingBottom={[1, 0]} span={['1/1', '6/12']}>
                  <DatePicker
                    label={formatMessage({
                      id: 'sp.documents:datepicker-dateFrom-label',
                      defaultMessage: 'Dagsetning frá',
                    })}
                    placeholderText={formatMessage({
                      id: 'sp.documents:datepicker-dateFrom-placeholder',
                      defaultMessage: 'Veldu dagsetningu',
                    })}
                    locale="is"
                    backgroundColor="blue"
                    size="xs"
                    selected={filterValue.dateFrom}
                    handleChange={handleDateFromInput}
                  />
                </GridColumn>
                <GridColumn span={['1/1', '6/12']}>
                  <DatePicker
                    label={formatMessage({
                      id: 'sp.documents:datepicker-dateTo-label',
                      defaultMessage: 'Dagsetning til',
                    })}
                    placeholderText={formatMessage({
                      id: 'sp.documents:datepicker-dateTo-placeholder',
                      defaultMessage: 'Veldu dagsetningu',
                    })}
                    locale="is"
                    backgroundColor="blue"
                    size="xs"
                    selected={filterValue.dateTo}
                    handleChange={handleDateToInput}
                    minDate={filterValue.dateFrom || undefined}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          </AnimateHeight>

          <Hidden above="xs">
            <Box display="flex" justifyContent="flexEnd" marginTop={1}>
              <Button
                variant="ghost"
                icon={isDateRangeOpen ? 'close' : 'filter'}
                iconType="outline"
                onClick={handleDateRangeButtonClick}
              >
                {formatMessage({
                  id: 'sp.documents:select-range',
                  defaultMessage: 'Tímabil',
                })}
              </Button>
            </Box>
          </Hidden>

          {hasActiveFilters() && (
            <Box marginTop={4}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="spaceBetween"
              >
                <Text variant="h3" as="h3">{`${
                  filteredDocuments.length
                } ${formatMessage(documentsFoundText())}`}</Text>
                <div>
                  <Button variant="text" onClick={handleClearFilters}>
                    {formatMessage({
                      id: 'sp.documents:clear-filters',
                      defaultMessage: 'Hreinsa filter',
                    })}
                  </Button>
                </div>
              </Box>
            </Box>
          )}

          <Box marginTop={4}>
            <Hidden below="sm">
              <Box
                className={styles.tableHeading}
                paddingY={2}
                background="blue100"
              >
                <GridRow>
                  <GridColumn span={['1/1', '2/12']}>
                    <Box paddingX={2}>
                      <Text variant="eyebrow" fontWeight="semiBold">
                        {formatMessage({
                          id: 'sp.documents:table-header-date',
                          defaultMessage: 'Dagsetning',
                        })}
                      </Text>
                    </Box>
                  </GridColumn>
                  <GridColumn span={['1/1', '6/12', '7/12', '6/12', '7/12']}>
                    <Box paddingX={2}>
                      <Text variant="eyebrow" fontWeight="semiBold">
                        {formatMessage({
                          id: 'sp.documents:table-header-information',
                          defaultMessage: 'Upplýsingar',
                        })}
                      </Text>
                    </Box>
                  </GridColumn>
                  <GridColumn span={['1/1', '4/12', '3/12', '4/12', '3/12']}>
                    <Box paddingX={2}>
                      <Text variant="eyebrow" fontWeight="semiBold">
                        {formatMessage({
                          id: 'sp.documents:table-header-institution',
                          defaultMessage: 'Stofnun',
                        })}
                      </Text>
                    </Box>
                  </GridColumn>
                </GridRow>
              </Box>
            </Hidden>
            {loading && (
              <Box display="flex" justifyContent="center" padding={4}>
                <LoadingDots large />
              </Box>
            )}
            {!loading && !error && filteredDocuments?.length === 0 && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Text variant="h3" as="h3">
                  {formatMessage({
                    id: 'sp.documents:not-found',
                    defaultMessage:
                      'Engin skjöl fundust fyrir gefin leitarskilyrði',
                  })}
                </Text>
              </Box>
            )}
            {error && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Text variant="h3" as="h3">
                  {formatMessage({
                    id: 'sp.documents:error',
                    defaultMessage:
                      'Tókst ekki að sækja rafræn skjöl, eitthvað fór úrskeiðis',
                  })}
                </Text>
              </Box>
            )}
            <Box>
              {filteredDocuments
                ?.slice(pagedDocuments.from, pagedDocuments.to)
                .map((document, index) => (
                  <Box key={document.id} ref={index === 0 ? scrollToRef : null}>
                    <DocumentLine
                      img={getOrganizationLogoUrl(
                        document.senderName,
                        organizations,
                      )}
                      documentLine={document}
                      userInfo={userInfo}
                    />
                  </Box>
                ))}
            </Box>
          </Box>

          {filteredDocuments && filteredDocuments.length > pageSize && (
            <Box marginTop={4}>
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
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

export default ServicePortalDocuments
