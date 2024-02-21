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
} from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'

import { RoleCard } from '../components/RoleCard'
import {
  extractInitialRoleNamesThatCanReadAllAssetsFromRoles,
  getAllContentTypesInAscendingOrder,
  getAllRoles,
  getAllTags,
  getTagNameToTagIdMap,
} from '../utils'
import * as styles from './Home.css'

const INITIAL_PAGE_SIZE = 3
const DEBOUNCE_TIME = 300

const Home = ({
  roles,
  contentTypes,
  initialRoleNamesThatCanReadAllAssets,
  tags,
}: InferGetServerSidePropsType<typeof getProps>) => {
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)

  const [roleNamesThatCanReadAllAssets, setRoleNamesThatCanReadAllAssets] =
    useState<string[]>(initialRoleNamesThatCanReadAllAssets)

  const [nameSearch, setNameSearch] = useState('')

  // const onSave = () => {
  //   fetch('/api/update-role-permissions', {
  //     method: 'PUT',
  //     body: JSON.stringify({
  //       checkboxState: narrowDownCheckboxState(checkboxState, enabledRoleName),
  //       readonlyCheckboxState: narrowDownCheckboxState(
  //         readonlyCheckboxState,
  //         enabledRoleName,
  //       ),
  //       roleNamesThatCanReadAllAssets,
  //       tags,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       toast.success('Saved successfully')
  //       return setSavedState(data)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       return toast.error('Error occured during save')
  //     })
  // }

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
          <Input
            name="name-search"
            label="Role name search"
            onChange={(ev) => handleFilterChange(ev.target.value)}
            icon={{ name: 'search' }}
          />
          <Stack space={2}>
            {filteredRoles.slice(0, pageSize).map((role) => (
              <RoleCard
                key={role.name}
                role={role}
                tagExists={Boolean(
                  tags.find((t) => t.name === slugify(role.name)),
                )}
                contentTypes={contentTypes}
                canReadAllAssets={roleNamesThatCanReadAllAssets.includes(
                  role.name,
                )}
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

  const tagsMap = getTagNameToTagIdMap(tags)

  const initialRoleNamesThatCanReadAllAssets =
    extractInitialRoleNamesThatCanReadAllAssetsFromRoles(rolesToShow, tagsMap)

  return {
    props: {
      roles: rolesToShow,
      contentTypes,
      initialRoleNamesThatCanReadAllAssets,
      tags,
    },
  }
}

export const Screen = Home
