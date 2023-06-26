import React, { useState } from 'react'
import { Outlet, useLoaderData, useNavigate, useParams } from 'react-router-dom'

import {
  Box,
  Button,
  FilterInput,
  GridRow,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'
import * as styles from './Permissions.css'
import { IDSAdminPaths } from '../../lib/paths'
import IdsAdminCard from '../../components/IdsAdminCard/IdsAdminCard'
import { PermissionsLoaderData } from './Permissions.loader'
import { useLooseSearch } from '../../hooks/useLooseSearch'

function Permissions() {
  const { formatMessage, locale } = useLocale()
  const permissionsList = useLoaderData() as PermissionsLoaderData
  const isEmpty = permissionsList.data.length === 0
  const navigate = useNavigate()
  const { tenant } = useParams()
  const [inputSearchValue, setInputSearchValue] = useState('')
  const [filteredPermissions, filterPermissions] = useLooseSearch(
    permissionsList.data,
    ['environments[0].displayName[0].value', 'scopeName'],
    'environments[0].displayName[0].value',
  )

  const handleSearch = (value = '') => {
    setInputSearchValue(value)
    filterPermissions(value)
  }

  const handleCreatePermission = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminPermissionsCreate,
        params: { tenant },
      }),
    )
  }

  const createButton = (
    <Button onClick={handleCreatePermission} size="small">
      {formatMessage(m.createPermission)}
    </Button>
  )

  const renderEmptyState = () => (
    <Box
      borderRadius="large"
      borderColor="blue200"
      borderWidth="standard"
      paddingY={[5, 8]}
      paddingX={[5, 8]}
      textAlign="center"
      maxLength={10}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        rowGap={3}
        className={styles.emptyContainer}
        marginX="auto"
      >
        <Text as="h2" variant="h3">
          {formatMessage(m.permissionEmptyHeading)}
        </Text>
        <Text marginBottom={3}>
          {formatMessage(m.permissionEmptyDescription)}
        </Text>
        {createButton}
        <LinkV2
          href="#"
          color="blue400"
          underline="normal"
          underlineVisibility="always"
        >
          {formatMessage(m.learnMore)}
        </LinkV2>
      </Box>
    </Box>
  )

  /**
   * Finds the title of the permission, a.k.a displayName for default environment
   */
  const findPermissionTitle = (
    permission: PermissionsLoaderData['data'][0],
    defaultEnvironment: PermissionsLoaderData['data'][0]['defaultEnvironment']['environment'],
  ) => {
    return permission.environments
      .find(({ environment }) => environment === defaultEnvironment)
      ?.displayName.find((translatedValue) => translatedValue.locale === locale)
      ?.value
  }

  const renderList = () => {
    return (
      <Box marginY={1}>
        <Box className={styles.filterContainer} marginBottom={3}>
          <FilterInput
            placeholder={formatMessage(m.permissionsSearchPlaceholder)}
            name="permission-search"
            value={inputSearchValue}
            onChange={handleSearch}
            backgroundColor="blue"
          />
        </Box>

        <Stack space={2}>
          {filteredPermissions.map((item) => {
            const href = replaceParams({
              href: IDSAdminPaths.IDSAdminPermission,
              params: {
                tenant,
                permission: item.scopeName,
              },
            })

            return (
              <IdsAdminCard
                key={item.scopeName}
                dataTestId="tenant-permissions-list-item"
                cta={{
                  label: formatMessage(m.change),
                  to: href,
                }}
                title={findPermissionTitle(
                  item,
                  item.defaultEnvironment.environment,
                )}
                text={item.scopeName}
                tags={item.availableEnvironments.map((tag) => ({
                  children: tag,
                  onClick: () => navigate(`${href}?env=${tag}`),
                }))}
              />
            )
          })}
        </Stack>
      </Box>
    )
  }

  return (
    <GridRow direction="column">
      <Box
        className={styles.headerContainer}
        rowGap={2}
        columnGap={5}
        marginBottom={5}
      >
        <Box display="flex" flexDirection="column" rowGap={2}>
          <Text as="h1" variant="h2">
            {formatMessage(m.permissions)}
          </Text>
          <Text>{formatMessage(m.permissionListDescription)}</Text>
        </Box>
        {isEmpty ? null : (
          <Box display="flex" alignItems="center">
            {createButton}
          </Box>
        )}
      </Box>

      {isEmpty ? renderEmptyState() : renderList()}
      <Outlet />
    </GridRow>
  )
}

export default Permissions
