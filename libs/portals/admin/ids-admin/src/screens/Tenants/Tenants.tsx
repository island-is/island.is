import React, { useState } from 'react'
import {
  Box,
  FilterInput,
  GridContainer,
  GridRow,
  Stack,
  Tag,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './Tenants.css'
import { Link, useLoaderData } from 'react-router-dom'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import type { AuthTenants } from './Tenants.loader'
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../lib/paths'
import { useLooseSearch } from '../../hooks/useLooseSearch'

const Tenants = () => {
  const originalTenantsList = useLoaderData() as AuthTenants
  const { formatMessage } = useLocale()

  const [tenantList, filterTenantList] = useLooseSearch(
    originalTenantsList,
    ['defaultEnvironment.displayName[0].value', 'defaultEnvironment.id'],
    'id',
  )
  const [inputSearchValue, setInputSearchValue] = useState('')

  const handleSearch = (value: string) => {
    setInputSearchValue(value)
    filterTenantList(value)
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
              <GridRow key={`tenant-${item.id}`} data-testid="tenant-list-item">
                <Link
                  className={styles.fill}
                  to={replaceParams({
                    href: IDSAdminPaths.IDSAdminClients,
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
                          <Tag
                            key={`tenant-${tag}`}
                            variant="purple"
                            outlined
                            disabled
                          >
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

export default Tenants
