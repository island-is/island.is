import React, { useState } from 'react'
import {
  Box,
  Filter,
  FilterInput,
  GridContainer,
  GridRow,
  Stack,
  Tag,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './TenantsList.css'
import { Link, useLoaderData } from 'react-router-dom'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import type { AuthTenantsList } from './TenantsList.loader'
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../lib/paths'

const TenantsList = () => {
  const originalTenantsList = useLoaderData() as AuthTenantsList
  const { formatMessage } = useLocale()
  const [tenantList, setTenantList] = useState<AuthTenantsList>(
    originalTenantsList,
  )
  const [inputSearchValue, setInputSearchValue] = useState('')

  const handleSearch = (value: string) => {
    setInputSearchValue(value)

    if (value.length > 0) {
      const filteredList = originalTenantsList.filter((tenant) => {
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
      setTenantList(originalTenantsList)
    }
  }

  return (
    <GridColumn span={['12/12', '12/12', '10/12']} offset={['0', '0', '1/12']}>
      <IntroHeader
        title={formatMessage(m.idsAdmin)}
        intro={formatMessage(m.idsAdminDescription)}
      />
      <GridContainer className={styles.relative}>
        <Stack space={[2, 2, 3, 3]}>
          <GridRow>
            <FilterInput
              placeholder={formatMessage(m.searchPlaceholder)}
              name="session-nationalId-input"
              value={inputSearchValue}
              onChange={handleSearch}
              backgroundColor="blue"
            />
          </GridRow>
          <Stack space={[1, 1, 2, 2]}>
            {tenantList.map((item) => (
              <GridRow key={`tenants-${item.id}`}>
                <Link
                  className={styles.fill}
                  to={replaceParams({
                    href: IDSAdminPaths.IDSAdminTenants,
                    params: {
                      tenant: item.id,
                    },
                  })}
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
                      flexDirection={['column', 'column', 'row', 'row', 'row']}
                      alignItems={'flexEnd'}
                      justifyContent={'flexEnd'}
                    >
                      {item.availableEnvironments.map((tag, index) => (
                        <Box margin={'smallGutter'} key={`tenant-${index}`}>
                          <Tag key={`tenant-${tag}`} variant="purple" outlined>
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
        </Stack>
      </GridContainer>
    </GridColumn>
  )
}

export default TenantsList
