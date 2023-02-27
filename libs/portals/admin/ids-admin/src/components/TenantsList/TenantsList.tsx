import {
  Box,
  Filter,
  FilterInput,
  GridContainer,
  GridRow,
  LoadingDots,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './TenantsList.css'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useOutletContext } from 'react-router-dom'
import { AuthAdminTenant } from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useTenantsListQuery } from './TenantsList.generated'
import { IntroHeader } from '@island.is/portals/core'

const TenantsList = () => {
  const { formatMessage } = useLocale()
  const { setBackValue } = useOutletContext<{
    setBackValue: (value: string) => void
  }>()

  const [inputSearchValue, setInputSearchValue] = useState('')
  const [tenantList, setTenantList] = useState<AuthAdminTenant[]>([])

  useEffect(() => {
    setBackValue('/')
  }, [])

  const { data, loading, error } = useTenantsListQuery({
    onCompleted: (data) => {
      setTenantList(data?.authAdminTenants?.data as AuthAdminTenant[])
    },
    onError: () => {
      toast.error(formatMessage(m.errorLoadingData))
    },
  })

  const handleSearch = (value: string) => {
    setInputSearchValue(value)

    if (value.length > 0) {
      const filteredList = tenantList.filter((tenant) => {
        return (
          tenant.defaultEnvironment.displayName[0].value
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          tenant.defaultEnvironment.id
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      })
      setTenantList(filteredList)
    } else {
      setTenantList(data?.authAdminTenants?.data as AuthAdminTenant[])
    }
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.idsAdmin)}
        intro={formatMessage(m.idsAdminDescription)}
      />
      <GridContainer className={styles.relative}>
        <Stack space={[2, 2, 3, 3]}>
          <GridRow>
            <Filter
              variant={'popover'}
              align="left"
              reverse
              labelClear={formatMessage(m.clearFilter)}
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelOpen={formatMessage(m.openFilter)}
              labelClose={formatMessage(m.closeFilter)}
              resultCount={0}
              filterInput={
                <FilterInput
                  placeholder={formatMessage(m.searchPlaceholder)}
                  name="session-nationalId-input"
                  value={inputSearchValue}
                  onChange={handleSearch}
                  backgroundColor="blue"
                />
              }
              onFilterClear={() => {
                setInputSearchValue('')
              }}
            />
          </GridRow>
          {loading ? (
            <Box display={'flex'} justifyContent={'center'}>
              <LoadingDots large />
            </Box>
          ) : error ? (
            <Box
              marginTop={'gutter'}
              display={'flex'}
              justifyContent={'center'}
            >
              <Text>{formatMessage(m.errorLoadingData)}</Text>
            </Box>
          ) : (
            <Stack space={[1, 1, 2, 2]}>
              {tenantList.map((item) => (
                <GridRow>
                  <Link
                    className={styles.fill}
                    to={`/innskraningarkerfi/${item.id}/`}
                  >
                    <Box
                      className={styles.linkContainer}
                      display={'flex'}
                      borderRadius={'large'}
                      border={'standard'}
                      width={'full'}
                      paddingX={4}
                      paddingY={3}
                      justifyContent={'spaceBetween'}
                      alignItems={'center'}
                    >
                      <Box>
                        <Stack space={1}>
                          <Text variant={'h3'} color={'blue400'}>
                            {item.defaultEnvironment.displayName[0].value}
                          </Text>
                          <Text variant={'default'}>
                            {item.defaultEnvironment.name}
                          </Text>
                        </Stack>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection={[
                          'column',
                          'column',
                          'row',
                          'row',
                          'row',
                        ]}
                        alignItems={'flexEnd'}
                        justifyContent={'flexEnd'}
                      >
                        {item.availableEnvironments.map((tag) => (
                          <Box margin={'smallGutter'}>
                            <Tag variant="purple" outlined>
                              {tag}
                            </Tag>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Link>
                </GridRow>
              ))}
            </Stack>
          )}
        </Stack>
      </GridContainer>
    </>
  )
}

export default TenantsList
