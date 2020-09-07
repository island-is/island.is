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
} from '@island.is/island-ui/core'
import { useListDocuments } from '@island.is/service-portal/graphql'
import {
  ActionMenuItem,
  useScrollTopOnUpdate,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { ActionCard, ActionCardLoader } from '@island.is/service-portal/core'
import AnimateHeight from 'react-animate-height'
import * as styles from './Overview.treat'

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
  const { data, loading, error } = useListDocuments(
    userInfo.user.profile.natreg,
    page,
    4,
  )
  useScrollTopOnUpdate([page])

  const categories = [
    { label: 'Allir flokkar', value: '' },
    { label: 'Fjármál', value: 'Fjármál' },
    { label: 'Húsnæði og eignir', value: 'Húsnæði og eignir' },
    { label: 'Starfsleyfi', value: 'Starfsleyfi' },
  ]

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
              <Typography variant="h3">
                Tókst ekki að sækja rafræn skjöl, eitthvað fór úrskeiðis
              </Typography>
            )}
            {data?.map((document) => (
              <ActionCard
                title={document.subject}
                date={new Date(document.date)}
                label={document.senderName}
                text={'Hérna gæti komið texti um skjalið ef hann væri í boði'}
                url="https://island.is/"
                external
                key={document.id}
                actionMenuRender={() => (
                  <>
                    <ActionMenuItem>Fela skjal</ActionMenuItem>
                    <ActionMenuItem>Eyða skjali</ActionMenuItem>
                  </>
                )}
                buttonRender={() => (
                  <Button variant="ghost" size="small" leftIcon="file">
                    Sakavottorð
                  </Button>
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
