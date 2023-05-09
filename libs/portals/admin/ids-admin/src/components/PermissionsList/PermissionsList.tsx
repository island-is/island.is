import {
  ActionCard,
  Box,
  Button,
  GridRow,
  LinkV2,
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

const loaderData = [
  {
    displayName: 'Stjórnborð Ísland.is',
    id: '@admin.island.is',
    environments: ['Production', 'Staging', 'Development'],
  },
]

function PermissionsList() {
  const { formatMessage } = useLocale()
  // const loaderData = useLoaderData() as string[]
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
            No permission created
          </Text>
          <Text marginBottom={3}>
            Lorem ipsum dolor sit amet consectetur. A non ut nulla vitae mauris
            accumsan at tellus facilisi.
          </Text>

          {createButton}

          <LinkV2
            href="#"
            color="blue400"
            underline="normal"
            underlineVisibility="always"
          >
            Learn more
          </LinkV2>
        </Box>
      </Box>
    )
  }

  const list = () => {
    return (
      <Box>
        {loaderData.map((item) => {
          return (
            <ActionCard
              key={item.id}
              cta={{ label: 'Breyta', variant: 'ghost' }}
              heading={item.displayName}
              text={item.id}
            />
          )
        })}
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
          <Text>
            Lorem ipsum dolor sit amet consectetur. A non ut nulla vitae mauris
            accumsan at tellus facilisi.
          </Text>
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
