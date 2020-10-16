import React, { useState, ChangeEvent } from 'react'
import {
  Typography,
  Box,
  Stack,
  Columns,
  Column,
  ButtonDeprecated as Button,
  Select,
  Input,
  Pagination,
  Option,
  DatePicker,
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
import AnimateHeight from 'react-animate-height'
import * as styles from './Overview.treat'
import DocumentCard from '../../components/DocumentCard/DocumentCard'
import { ValueType } from 'react-select'
import { useLocale, useNamespaces } from '@island.is/localization'

const defaultCategory = { label: 'Allir flokkar', value: '' }
const pageSize = 4
const defaultStartDate = '2000-01-01T00:00:00.000'

type FilterValues = {
  search: string
  dateFrom: Date
  dateTo: Date
}

export const ServicePortalDocuments: ServicePortalModuleComponent = ({
  userInfo,
}) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterValue, setFilterValue] = useState<FilterValues>({
    search: '',
    dateFrom: new Date(defaultStartDate),
    dateTo: new Date(),
  })
  const [activeCategory, setActiveCategory] = useState<Option>(defaultCategory)
  const { data, loading, error } = useListDocuments(
    userInfo.profile.natreg,
    filterValue.dateFrom,
    filterValue.dateTo,
    page,
    pageSize,
    activeCategory?.value.toString() || '',
  )
  const { data: cats } = useDocumentCategories()
  useScrollTopOnUpdate([page])

  const categories = [defaultCategory].concat(
    cats?.map((x) => ({
      label: x.name,
      value: x.id,
    })) || [],
  )

  const handleExtendSearchClick = () => {
    if (searchOpen) {
      setSearchOpen(false)
      setFilterValue({
        search: '',
        dateFrom: new Date(defaultStartDate),
        dateTo: new Date(),
      })
    } else {
      setSearchOpen(true)
    }
  }

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFilterValue({
      ...filterValue,
      [e.target.name]: e.target.value,
    })
  }

  const handleDateFromInput = (value: Date) =>
    setFilterValue({
      ...filterValue,
      dateFrom: value,
    })

  const handleDateToInput = (value: Date) =>
    setFilterValue({
      ...filterValue,
      dateTo: value,
    })

  const handlePageChange = (page: number) => setPage(page)
  const handleCategoryChange = (cat: ValueType<Option>) =>
    setActiveCategory(cat as Option)

  return (
    <>
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
              <Columns align="right" space={1} collapseBelow="sm">
                <div className={styles.selectWrapper}>
                  <Select
                    name="categories"
                    defaultValue={categories[0]}
                    options={categories}
                    value={activeCategory}
                    onChange={handleCategoryChange}
                  />
                </div>
                <Column width="content">
                  <Button
                    variant="ghost"
                    icon={searchOpen ? 'close' : 'burger'}
                    onClick={handleExtendSearchClick}
                  >
                    {searchOpen
                      ? formatMessage({
                          id: 'sp.documents:close-filters',
                          defaultMessage: 'Loka ítarleit',
                        })
                      : formatMessage({
                          id: 'sp.documents:filters',
                          defaultMessage: 'Ítarleit',
                        })}
                  </Button>
                </Column>
              </Columns>
              <AnimateHeight height={searchOpen ? 'auto' : 0}>
                <Box
                  background="blue100"
                  paddingY={3}
                  paddingX={4}
                  borderRadius="large"
                  marginTop={2}
                >
                  <Stack space={2}>
                    <Input
                      name="search"
                      value={filterValue.search}
                      onChange={handleInput}
                      placeholder="Leita í skjölum... (Óvirkt)"
                    />
                    <Columns space={2} collapseBelow="sm">
                      <Column width="1/2">
                        <DatePicker
                          label="Frá"
                          placeholderText="Veldu dagsetningu"
                          locale="is"
                          value={filterValue.dateFrom?.toString() || undefined}
                          handleChange={handleDateFromInput}
                        />
                      </Column>
                      <Column width="1/2">
                        <DatePicker
                          label="Til"
                          placeholderText="Veldu dagsetningu"
                          locale="is"
                          value={filterValue.dateTo?.toString() || undefined}
                          handleChange={handleDateToInput}
                        />
                      </Column>
                    </Columns>
                  </Stack>
                </Box>
              </AnimateHeight>
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
            {!loading && !error && data?.length === 0 && (
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
            {data?.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
            {data && data.length > 0 && (
              <Pagination
                page={page}
                totalPages={data?.length === pageSize ? page + 1 : page}
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
    </>
  )
}

export default ServicePortalDocuments
