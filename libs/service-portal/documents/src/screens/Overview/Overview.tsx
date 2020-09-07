import React, { useState, ChangeEvent } from 'react'
import {
  Typography,
  Box,
  Stack,
  Columns,
  Column,
  Button,
  Select,
  Input,
  Pagination,
  Option,
} from '@island.is/island-ui/core'
import {
  useListDocuments,
  useDocumentCategories,
} from '@island.is/service-portal/graphql'
import {
  ActionMenuItem,
  useScrollTopOnUpdate,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { ActionCard, ActionCardLoader } from '@island.is/service-portal/core'
import AnimateHeight from 'react-animate-height'
import * as styles from './Overview.treat'

const defaultCategory = { label: 'Allir flokkar', value: '' }

export const ServicePortalDocuments: ServicePortalModuleComponent = ({
  userInfo,
}) => {
  const [page, setPage] = useState(1)
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterValue, setFilterValue] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
  })
  const [activeCategory, setActiveCategory] = useState<Option>(defaultCategory)
  const { data, loading, error } = useListDocuments(
    userInfo.user.profile.natreg,
    page,
    4,
    activeCategory?.value.toString() || '',
  )
  const { data: cats } = useDocumentCategories()
  useScrollTopOnUpdate([page])

  const categories = [defaultCategory].concat(
    cats?.map((x) => ({
      label: x.name,
      value: x.id,
    })),
  )

  const handleExtendSearchClick = () => {
    if (searchOpen) {
      setSearchOpen(false)
      setFilterValue({
        search: '',
        dateFrom: '',
        dateTo: '',
      })
    } else {
      setSearchOpen(true)
    }
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue({
      ...filterValue,
      [e.target.name]: e.target.value,
    })
  }

  const handlePageChange = (page: number) => setPage(page)
  const handleCategoryChange = (cat: Option) => setActiveCategory(cat)

  return (
    <>
      <Stack space={3}>
        <Typography variant="h1" as="h1">
          Rafræn skjöl
        </Typography>
        <Columns collapseBelow="sm">
          <Column width="7/12">
            <Typography variant="intro">
              Hér getur þú fundið öll þau skjöl sem eru send til þín frá
              stofnunum ríkisins.
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
                    icon={searchOpen ? 'close' : 'search'}
                    onClick={handleExtendSearchClick}
                  >
                    {searchOpen ? 'Loka ítarleit' : 'Ítarleit'}
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
                  <Columns space={2}>
                    <Column>
                      <Input
                        name="search"
                        value={filterValue.search}
                        onChange={handleInput}
                        placeholder="Leita í skjölum..."
                      />
                    </Column>
                    <Column width="1/4">
                      <Input
                        placeholder="Frá"
                        name="dateFrom"
                        value={filterValue.dateFrom}
                        onChange={handleInput}
                      />
                    </Column>
                    <Column width="1/4">
                      <Input
                        placeholder="Til"
                        name="dateTo"
                        value={filterValue.dateTo}
                        onChange={handleInput}
                      />
                    </Column>
                  </Columns>
                </Box>
              </AnimateHeight>
            </div>
            {loading && <ActionCardLoader repeat={3} />}
            {error && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Typography variant="h3">
                  Tókst ekki að sækja rafræn skjöl, eitthvað fór úrskeiðis
                </Typography>
              </Box>
            )}
            {!loading && !error && data?.length === 0 && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Typography variant="h3">
                  Engin skjöl fundust fyrir gefin leitarskilyrði
                </Typography>
              </Box>
            )}
            {data?.map((document) => (
              <ActionCard
                title={document.subject}
                date={new Date(document.date)}
                label={document.senderName}
                url="https://island.is/"
                external
                key={document.id}
                actionMenuRender={() => (
                  <>
                    <ActionMenuItem>Fela skjal</ActionMenuItem>
                    <ActionMenuItem>Eyða skjali</ActionMenuItem>
                  </>
                )}
              />
            ))}
            <Pagination
              page={page}
              totalPages={10}
              renderLink={(page, className, children) => (
                <button
                  className={className}
                  onClick={handlePageChange.bind(null, page)}
                >
                  {children}
                </button>
              )}
            />
          </Stack>
        </Box>
      </Stack>
    </>
  )
}

export default ServicePortalDocuments
