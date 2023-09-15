import { InferGetServerSidePropsType } from 'next'
import { useMemo, useState } from 'react'
import slugify from '@sindresorhus/slugify'
import {
  Box,
  Text,
  DropdownMenu,
  Button,
  toast,
  ToggleSwitchButton,
  Hyphen,
  Stack,
  Inline,
  Checkbox,
  Tooltip,
  Input,
} from '@island.is/island-ui/core'

import {
  extractInitialCheckboxStateFromRolesAndContentTypes,
  extractInitialRoleNamesThatCanReadAllAssetsFromRoles,
  extractInitialReadonlyCheckboxStateFromRolesAndContentTypes,
  getAllContentTypesInAscendingOrder,
  getAllRoles,
  getAllTags,
  getTagNameToTagIdMap,
} from '../utils'
import {
  DEFAULT_EDITABLE_ENTRY_TYPE_IDS,
  DEFAULT_READ_ONLY_ENTRY_IDS,
} from '../constants'

import * as styles from '../styles/index.css'

const emptyFunction = () => {
  return undefined
}

const Home = ({
  roles,
  contentTypes,
  initialCheckboxState,
  initialReadonlyCheckboxState,
  initialRoleNamesThatCanReadAllAssets,
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [checkboxState, setCheckboxState] = useState(initialCheckboxState)

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
        checkboxState,
        readonlyCheckboxState,
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

  const canSave =
    JSON.stringify(savedState) !==
    JSON.stringify({
      checkboxState,
      readonlyCheckboxState,
      roleNamesThatCanReadAllAssets,
      tags,
    })

  const filteredRoles = useMemo(
    () =>
      roles.filter((role) =>
        role.name.toLowerCase().includes(nameSearch.toLowerCase()),
      ),
    [nameSearch, roles],
  )

  return (
    <Box className={styles.container}>
      <Input
        name="name-search"
        label="Role name search"
        onChange={(ev) => setNameSearch(ev.target.value)}
      />

      <Box display="flex" flexDirection="row" justifyContent="flexEnd">
        <Button onClick={onSave} size="small" disabled={!canSave}>
          Save
        </Button>
      </Box>

      <Box className={styles.rolesContainer}>
        {filteredRoles.map((role) => (
          <Box
            border="standard"
            borderWidth="standard"
            borderRadius="standard"
            padding={3}
            key={role.name}
          >
            <Box marginBottom={2}>
              <Text truncate variant="h4" as="label" marginBottom={0}>
                {role.name}
              </Text>
              <Inline alignY="center">
                <Text variant="small">Tag: {slugify(role.name)}</Text>
                {!tags.find((t) => t.name === slugify(role.name)) && (
                  <Tooltip
                    text={`Tag with name ${slugify(role.name)} does not exist`}
                    color="red400"
                  />
                )}
              </Inline>
            </Box>

            <Inline space={5}>
              <Box>
                <DropdownMenu
                  title="Read only entries"
                  icon="caretDown"
                  menuClassName={styles.menuContainer}
                  items={contentTypes.map((contentType) => ({
                    title: contentType.name,
                    render: () => {
                      const checked =
                        readonlyCheckboxState[role.name][contentType.name]

                      const toggleCheckbox = () => {
                        setReadonlyCheckboxState((prevState) => ({
                          ...prevState,
                          [role.name]: {
                            ...prevState[role.name],
                            [contentType.name]:
                              !prevState[role.name][contentType.name],
                          },
                        }))
                      }

                      return (
                        <Box
                          borderBottomWidth="standard"
                          border="standard"
                          tabIndex={0}
                          key={`${role.name}-${contentType.name}`}
                          userSelect="none"
                          cursor="pointer"
                          display="flex"
                          flexDirection="row"
                          flexWrap="nowrap"
                          alignItems="center"
                          justifyContent="spaceBetween"
                          padding={1}
                          onClick={toggleCheckbox}
                          onKeyDown={(ev) => {
                            if (ev.key === ' ' || ev.key === 'Enter') {
                              ev.preventDefault()
                              toggleCheckbox()
                            }
                          }}
                        >
                          <Text
                            variant="small"
                            color={checked ? 'blue400' : 'currentColor'}
                          >
                            <Hyphen>{contentType.name}</Hyphen>
                          </Text>
                          <ToggleSwitchButton
                            checked={checked}
                            label=""
                            hiddenLabel={true}
                            onChange={emptyFunction}
                          />
                        </Box>
                      )
                    },
                  }))}
                />

                <Stack space={1}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setReadonlyCheckboxState((prevState) => {
                        const newState = JSON.parse(JSON.stringify(prevState))

                        for (const roleName in prevState) {
                          for (const contentTypeName in prevState[roleName]) {
                            if (
                              DEFAULT_READ_ONLY_ENTRY_IDS.includes(
                                contentTypes.find(
                                  (type) => type.name === contentTypeName,
                                )?.sys?.id,
                              )
                            ) {
                              newState[roleName][contentTypeName] = true
                            } else {
                              newState[roleName][contentTypeName] = false
                            }
                          }
                        }

                        return newState
                      })
                    }}
                  >
                    Set to default
                  </Button>

                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setReadonlyCheckboxState((prevState) => {
                        const newState = JSON.parse(JSON.stringify(prevState))
                        for (const roleName in prevState) {
                          for (const contentTypeName in prevState[roleName]) {
                            newState[roleName][contentTypeName] = true
                          }
                        }
                        return newState
                      })
                    }}
                  >
                    Set all
                  </Button>

                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setReadonlyCheckboxState((prevState) => {
                        const newState = JSON.parse(JSON.stringify(prevState))
                        for (const roleName in prevState) {
                          for (const contentTypeName in prevState[roleName]) {
                            newState[roleName][contentTypeName] = false
                          }
                        }
                        return newState
                      })
                    }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Box>
              <Box>
                <DropdownMenu
                  title="Editable entries"
                  icon="caretDown"
                  menuClassName={styles.menuContainer}
                  items={contentTypes.map((contentType) => ({
                    title: contentType.name,
                    render: () => {
                      const checked = checkboxState[role.name][contentType.name]

                      const toggleCheckbox = () => {
                        setCheckboxState((prevState) => ({
                          ...prevState,
                          [role.name]: {
                            ...prevState[role.name],
                            [contentType.name]:
                              !prevState[role.name][contentType.name],
                          },
                        }))
                      }

                      return (
                        <Box
                          borderBottomWidth="standard"
                          border="standard"
                          tabIndex={0}
                          key={`${role.name}-${contentType.name}`}
                          userSelect="none"
                          cursor="pointer"
                          display="flex"
                          flexDirection="row"
                          flexWrap="nowrap"
                          alignItems="center"
                          justifyContent="spaceBetween"
                          padding={1}
                          onClick={toggleCheckbox}
                          onKeyDown={(ev) => {
                            if (ev.key === ' ' || ev.key === 'Enter') {
                              ev.preventDefault()
                              toggleCheckbox()
                            }
                          }}
                        >
                          <Text
                            variant="small"
                            color={checked ? 'blue400' : 'currentColor'}
                          >
                            <Hyphen>{contentType.name}</Hyphen>
                          </Text>
                          <ToggleSwitchButton
                            checked={checked}
                            label=""
                            hiddenLabel={true}
                            onChange={emptyFunction}
                          />
                        </Box>
                      )
                    },
                  }))}
                />

                <Stack space={1}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setCheckboxState((prevState) => {
                        const newState = JSON.parse(JSON.stringify(prevState))

                        for (const roleName in prevState) {
                          for (const contentTypeName in prevState[roleName]) {
                            if (
                              DEFAULT_EDITABLE_ENTRY_TYPE_IDS.includes(
                                contentTypes.find(
                                  (type) => type.name === contentTypeName,
                                )?.sys?.id,
                              )
                            ) {
                              newState[roleName][contentTypeName] = true
                            } else {
                              newState[roleName][contentTypeName] = false
                            }
                          }
                        }

                        return newState
                      })
                    }}
                  >
                    Set to default
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setCheckboxState((prevState) => {
                        const newState = JSON.parse(JSON.stringify(prevState))
                        for (const roleName in prevState) {
                          for (const contentTypeName in prevState[roleName]) {
                            newState[roleName][contentTypeName] = true
                          }
                        }
                        return newState
                      })
                    }}
                  >
                    Set all
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setCheckboxState((prevState) => {
                        const newState = JSON.parse(JSON.stringify(prevState))
                        for (const roleName in prevState) {
                          for (const contentTypeName in prevState[roleName]) {
                            newState[roleName][contentTypeName] = false
                          }
                        }
                        return newState
                      })
                    }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Box>
              <Box marginTop={1}>
                <Inline alignY="center">
                  <Checkbox
                    checked={roleNamesThatCanReadAllAssets.includes(role.name)}
                    label="Can read all assets"
                    onChange={() =>
                      setRoleNamesThatCanReadAllAssets((prev) => {
                        if (prev.includes(role.name))
                          return prev.filter((name) => name !== role.name)
                        return prev.concat(role.name)
                      })
                    }
                  />
                  <Tooltip
                    placement="right"
                    text={`If this is not checked then roles can only read assets tagged with ${slugify(
                      role.name,
                    )}`}
                  />
                </Inline>
              </Box>
            </Inline>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export const getServerSideProps = async () => {
  const [roles, contentTypes, tags] = await Promise.all([
    getAllRoles(),
    getAllContentTypesInAscendingOrder(),
    getAllTags(),
  ])

  const rolesToShow = roles.filter((role) =>
    role.name.toLowerCase().startsWith('owner-'),
  )

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
