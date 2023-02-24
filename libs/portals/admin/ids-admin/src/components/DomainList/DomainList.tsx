import {
  Box,
  Button,
  Filter,
  FilterInput,
  GridContainer,
  GridRow,
  LoadingDots,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './DomainList.css'
import React, { useState } from 'react'
import { useDomainsListQuery } from './DomainsList.generated'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { AuthAdminTenant } from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const DomainList = () => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()

  const [inputSearchValue, setInputSearchValue] = useState('')
  const [tenantList, setTenantList] = useState<AuthAdminTenant[]>([])

  const { data, loading, error } = useDomainsListQuery({
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
          tenant.mergedEnvironment.displayName[0].value
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          tenant.mergedEnvironment.id
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
          <Box marginTop={'gutter'} display={'flex'} justifyContent={'center'}>
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
                          {item.mergedEnvironment.displayName[0].value}
                        </Text>
                        <Text variant={'default'}>
                          {item.mergedEnvironment.name}
                        </Text>
                        <Box
                          display={'flex'}
                          flexDirection={'row'}
                          columnGap={'gutter'}
                        >
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              navigate(`/innskraningarkerfi/${item.id}/`)
                            }}
                            size="small"
                            variant="text"
                          >
                            {item.mergedEnvironment.applicationCount +
                              ' applications'}
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              navigate(
                                `/innskraningarkerfi/${item.id}/vefthjonustur`,
                              )
                            }}
                            size="small"
                            variant="text"
                          >
                            {item.mergedEnvironment.apiCount + ' APIs'}
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={['column', 'column', 'row', 'row', 'row']}
                      alignItems={'flexEnd'}
                      justifyContent={'flexEnd'}
                    >
                      {item.mergedEnvironment.environment.map((tag) => (
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
  )
}

export default DomainList
