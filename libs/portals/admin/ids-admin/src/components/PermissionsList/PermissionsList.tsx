import {
  Box,
  Button,
  GridRow,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  Outlet,
  // useLoaderData,
  useNavigate,
  useParams,
} from 'react-router-dom'
import * as styles from './PermissionsList.css'
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../lib/paths'
import React from 'react'
import IdsAdminCard from '../../shared/components/IdsAdminCard/IdsAdminCard'

// TODO: MOCK DATA
const loaderData = [
  {
    displayName: 'Stjórnborð Ísland.is',
    id: '@admin.island.is',
    environments: ['Production', 'Staging', 'Development'],
  },
  {
    displayName: 'Vegagerðin',
    id: '@admin.island.is',
    environments: ['Production', 'Staging', 'Development'],
  },
]

function PermissionsList() {
  const { formatMessage } = useLocale()
  // const loaderData = useLoaderData()
  const isEmpty = !Array.isArray(loaderData) || loaderData.length === 0
  const navigate = useNavigate()
  const { tenant } = useParams()

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

  const emptyState = () => {
    return (
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
  }

  const list = () => {
    return (
      <Stack space={2}>
        {loaderData.map((item) => {
          const tags = item.environments.map((env) => ({ children: env }))
          return (
            <IdsAdminCard
              key={item.id}
              // cta={{ label: formatMessage(m.change), to: '#' }} TODO
              title={item.displayName}
              text={item.id}
              tags={tags}
            />
          )
        })}
      </Stack>
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

      {isEmpty ? emptyState() : list()}
      <Outlet />
    </GridRow>
  )
}

export default PermissionsList
