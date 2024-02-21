import { useMemo, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import slugify from '@sindresorhus/slugify'

import { Box, Input, Stack, toast } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'

import { RoleCard } from '../components/RoleCard'
import {
  extractInitialCheckboxStateFromRolesAndContentTypes,
  extractInitialReadonlyCheckboxStateFromRolesAndContentTypes,
  extractInitialRoleNamesThatCanReadAllAssetsFromRoles,
  getAllContentTypesInAscendingOrder,
  getAllRoles,
  getAllTags,
  getTagNameToTagIdMap,
  narrowDownCheckboxState,
} from '../utils'
import * as styles from '../styles/index.css'

const Home = ({
  roles,
  contentTypes,
  initialCheckboxState,
  initialReadonlyCheckboxState,
  initialRoleNamesThatCanReadAllAssets,
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [checkboxState, setCheckboxState] = useState(initialCheckboxState)
  const [enabledRoleName, setEnabledRoleName] = useState<string>()
  const [savedState, setSavedState] = useState({
    checkboxState: initialCheckboxState,
    readonlyCheckboxState: initialReadonlyCheckboxState,
    roleNamesThatCanReadAllAssets: initialRoleNamesThatCanReadAllAssets,
    tags,
  })

  const [readonlyCheckboxState, setReadonlyCheckboxState] = useState(
    initialReadonlyCheckboxState,
  )

  const [roleNamesThatCanReadAllAssets, setRoleNamesThatCanReadAllAssets] =
    useState<string[]>(initialRoleNamesThatCanReadAllAssets)

  const [nameSearch, setNameSearch] = useState('')

  const onSave = () => {
    fetch('/api/update-role-permissions', {
      method: 'PUT',
      body: JSON.stringify({
        checkboxState: narrowDownCheckboxState(checkboxState, enabledRoleName),
        readonlyCheckboxState: narrowDownCheckboxState(
          readonlyCheckboxState,
          enabledRoleName,
        ),
        roleNamesThatCanReadAllAssets,
        tags,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success('Saved successfully')
        return setSavedState(data)
      })
      .catch((err) => {
        console.error(err)
        return toast.error('Error occured during save')
      })
  }

  const filteredRoles = useMemo(
    () =>
      roles.filter((role) =>
        role.name.toLowerCase().includes(nameSearch.toLowerCase()),
      ),
    [nameSearch, roles],
  )

  return (
    <Box className={styles.container}>
      <Stack space={2}>
        <Input
          name="name-search"
          label="Role name search"
          onChange={(ev) => setNameSearch(ev.target.value)}
          icon={{ name: 'search' }}
        />

        <Stack space={2}>
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.name}
              isEditable={enabledRoleName === role.name}
              toggleEditable={() => {
                setEnabledRoleName((name) =>
                  name === role.name ? '' : role.name,
                )
              }}
              role={role}
              tagExists={Boolean(
                tags.find((t) => t.name === slugify(role.name)),
              )}
              contentTypes={contentTypes}
              readOnlyState={readonlyCheckboxState[role.name]}
              editableState={checkboxState[role.name]}
              canReadAllAssets={roleNamesThatCanReadAllAssets.includes(
                role.name,
              )}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}

export const getServerSideProps = async () => {
  const [roles, contentTypes, tags] = await Promise.all([
    getAllRoles(),
    getAllContentTypesInAscendingOrder(),
    getAllTags(),
  ])

  const rolesToShow = roles
    .filter((role) => role.name.toLowerCase().startsWith('owner-'))
    .sort(sortAlpha('name'))

  const initialReadonlyCheckboxState =
    extractInitialReadonlyCheckboxStateFromRolesAndContentTypes(
      rolesToShow,
      contentTypes,
    )

  const initialCheckboxState =
    extractInitialCheckboxStateFromRolesAndContentTypes(
      rolesToShow,
      contentTypes,
    )

  const tagsMap = getTagNameToTagIdMap(tags)

  const initialRoleNamesThatCanReadAllAssets =
    extractInitialRoleNamesThatCanReadAllAssetsFromRoles(rolesToShow, tagsMap)

  return {
    props: {
      roles: rolesToShow,
      contentTypes,
      initialCheckboxState,
      initialReadonlyCheckboxState,
      initialRoleNamesThatCanReadAllAssets,
      tags,
    },
  }
}

export default Home
