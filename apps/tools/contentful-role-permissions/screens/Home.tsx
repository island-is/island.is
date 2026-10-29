import { useMemo, useState } from 'react'
import debounce from 'lodash/debounce'
import { InferGetServerSidePropsType } from 'next'
import slugify from '@sindresorhus/slugify'

import {
  Box,
  Button,
  GridContainer,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'

import { BulkAddEditableContentType } from '../components/BulkAddEditableContentType'
import { RoleCard } from '../components/RoleCard'
import {
  getAllContentTypesInAscendingOrder,
  getAllRoles,
  getAllTags,
} from '../utils'
import * as styles from './Home.css'

const INITIAL_PAGE_SIZE = 2
const DEBOUNCE_TIME = 300

const Home = ({
  roles: initialRoles,
  contentTypes,
  tags,
}: InferGetServerSidePropsType<typeof getProps>) => {
  const [roles, setRoles] = useState(initialRoles)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)

  const [nameSearch, setNameSearch] = useState('')

  const filteredRoles = useMemo(
    () =>
      roles.filter(
        (role) =>
          role.name.toLowerCase().includes(nameSearch.toLowerCase()) ||
          slugify(role.name).includes(slugify(nameSearch)),
      ),
    [nameSearch, roles],
  )

  const handleFilterChange = debounce((value: string) => {
    setNameSearch(value)
    setPageSize(INITIAL_PAGE_SIZE)
  }, DEBOUNCE_TIME)

  return (
    <Box className={styles.container}>
      <GridContainer>
        <Stack space={2}>
          <BulkAddEditableContentType
            roles={roles}
            contentTypes={contentTypes}
            tags={tags}
            onRoleUpdated={(updatedRole) =>
              setRoles((prev) =>
                prev.map((role) =>
                  role.sys.id === updatedRole.sys.id ? updatedRole : role,
                ),
              )
            }
          />
          <Input
            name="name-search"
            label="Role name search"
            onChange={(ev) => handleFilterChange(ev.target.value)}
            icon={{ name: 'search' }}
          />
          <Stack space={2}>
            {filteredRoles.slice(0, pageSize).map((role) => (
              <RoleCard
                // Remount with fresh state when the role is updated elsewhere
                key={`${role.name}-${role.sys.version}`}
                role={role}
                contentTypes={contentTypes}
                tags={tags}
              />
            ))}
            {pageSize < filteredRoles.length && (
              <Box display="flex" justifyContent="center">
                <Button
                  size="small"
                  onClick={() => {
                    setPageSize((prev) => prev + INITIAL_PAGE_SIZE)
                  }}
                >
                  See more ({filteredRoles.length - pageSize})
                </Button>
              </Box>
            )}
            <Box display="flex" justifyContent="center">
              <Stack space={2}>
                {filteredRoles.slice(pageSize).map((role) => (
                  <Text key={role.name} variant="small">
                    {role.name}
                  </Text>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </GridContainer>
    </Box>
  )
}

export const getProps = async () => {
  const [roles, contentTypes, tags] = await Promise.all([
    getAllRoles(),
    getAllContentTypesInAscendingOrder(),
    getAllTags(),
  ])

  const rolesToShow = roles
    .filter((role) => role.name.toLowerCase().startsWith('owner-'))
    .sort(sortAlpha('name'))

  return {
    props: {
      roles: rolesToShow,
      contentTypes,
      tags,
    },
  }
}

export const Screen = Home
