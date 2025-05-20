import { useMemo, useState } from 'react'
import { ContentTypeProps, RoleProps, TagProps } from 'contentful-management'
import isEqual from 'lodash/isEqual'
import slugify from '@sindresorhus/slugify'

import {
  Box,
  Button,
  Checkbox,
  DropdownMenu,
  Hyphen,
  Inline,
  Stack,
  Text,
  toast,
  ToggleSwitchButton,
  Tooltip,
} from '@island.is/island-ui/core'

import {
  DEFAULT_EDITABLE_ENTRY_TYPE_IDS,
  DEFAULT_READ_ONLY_ENTRY_IDS,
} from '../../constants'
import { useCanReadAllAssetsState } from '../../hooks/useCanReadAllAssetsState'
import { useCheckboxState } from '../../hooks/useCheckboxState'
import * as styles from './RoleCard.css'

interface RoleCardProps {
  role: RoleProps
  contentTypes: ContentTypeProps[]
  tags: TagProps[]
}

const emptyFunction = () => {
  return undefined
}

export const RoleCard = ({ role, contentTypes, tags }: RoleCardProps) => {
  const {
    initialState: initialReadOnlyState,
    setInitialState: setInitialReadOnlyState,
    currentState: readOnlyState,
    setCurrentState: setReadOnlyState,
  } = useCheckboxState('readonly', role, contentTypes)
  const {
    initialState: initialEditableState,
    setInitialState: setInitialEditableState,
    currentState: editableState,
    setCurrentState: setEditableState,
  } = useCheckboxState('edit', role, contentTypes)
  const {
    currentState: canReadAllAssets,
    setCurrentState: setCanReadAllAssets,
    initialState: initialCanReadAllAssets,
    setInitialState: setInitialCanReadAllAssets,
  } = useCanReadAllAssetsState(role, tags)
  const [isSaving, setIsSaving] = useState(false)

  const canSave =
    !isEqual(initialReadOnlyState, readOnlyState) ||
    !isEqual(initialEditableState, editableState) ||
    initialCanReadAllAssets !== canReadAllAssets

  const onSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/update-role-permissions', {
        method: 'PUT',
        body: JSON.stringify({
          checkboxState: {
            [role.name]: editableState,
          },
          readOnlyCheckboxState: {
            [role.name]: readOnlyState,
          },
          tags,
          roleNamesThatCanReadAllAssets: canReadAllAssets ? [role.name] : [],
        }),
      })

      if (response.ok) {
        toast.success('Saved successfully')

        // Reset initial state so that the save button gets disabled
        setInitialReadOnlyState(readOnlyState)
        setInitialEditableState(editableState)
        setInitialCanReadAllAssets(canReadAllAssets)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error occured during save')
    }
    setIsSaving(false)
  }

  const tagExists = useMemo(() => {
    return Boolean(tags.find((t) => t.name === slugify(role.name)))
  }, [role.name, tags])

  const sortedDefaultReadOnlyEntryIds = useMemo(() => {
    return DEFAULT_READ_ONLY_ENTRY_IDS.sort()
  }, [])
  const sortedDefaultEditableEntryIds = useMemo(() => {
    return DEFAULT_EDITABLE_ENTRY_TYPE_IDS.sort()
  }, [])

  return (
    <Box
      border="standard"
      borderWidth="standard"
      borderRadius="standard"
      padding={3}
    >
      <Stack space={2}>
        <Inline justifyContent="spaceBetween" space={2}>
          <Box marginBottom={2}>
            <Inline alignY="top">
              <Stack space={0}>
                <Text truncate variant="h4" as="label" marginBottom={0}>
                  {role.name}
                </Text>
                <Inline alignY="center">
                  <Text variant="small">Tag: {slugify(role.name)}</Text>
                  {!tagExists && (
                    <Tooltip
                      text={`Tag with name ${slugify(
                        role.name,
                      )} does not exist`}
                      color="red400"
                    />
                  )}
                </Inline>
              </Stack>
            </Inline>
          </Box>

          <Box display="flex" flexDirection="row" justifyContent="flexEnd">
            <Button
              disabled={!canSave}
              size="small"
              onClick={onSave}
              loading={isSaving}
            >
              Save changes
            </Button>
          </Box>
        </Inline>

        <Inline space={5}>
          <Box>
            <Stack space={1}>
              <DropdownMenu
                fixed={true}
                title="Read only entries"
                icon="caretDown"
                menuClassName={styles.menuContainer}
                items={contentTypes.map((contentType) => ({
                  title: contentType.name,
                  render: () => {
                    const checked = readOnlyState[contentType.name]

                    const toggleCheckbox = () => {
                      setReadOnlyState((prevState) => ({
                        ...prevState,
                        [contentType.name]: !prevState[contentType.name],
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
                          disabled={isSaving}
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
                  disabled={isSaving}
                  variant="text"
                  size="small"
                  onClick={() => {
                    setReadOnlyState((prevState) => {
                      const newState = { ...prevState }
                      for (const contentTypeName in newState) {
                        const contentTypeSysId = contentTypes.find(
                          (type) => type.name === contentTypeName,
                        )?.sys?.id
                        newState[contentTypeName] =
                          DEFAULT_READ_ONLY_ENTRY_IDS.includes(contentTypeSysId)
                      }
                      return newState
                    })
                  }}
                >
                  Set to default
                  <Tooltip
                    placement="right"
                    text={
                      <div>
                        {sortedDefaultReadOnlyEntryIds.map((id) => (
                          <Text key={id} variant="small">
                            {id}
                          </Text>
                        ))}
                      </div>
                    }
                  />
                </Button>

                <Button
                  disabled={isSaving}
                  variant="text"
                  size="small"
                  onClick={() => {
                    setReadOnlyState((prevState) => {
                      const newState = { ...prevState }
                      for (const key in newState) {
                        newState[key] = true
                      }
                      return newState
                    })
                  }}
                >
                  Set all
                </Button>

                <Button
                  disabled={isSaving}
                  variant="text"
                  size="small"
                  onClick={() => {
                    setReadOnlyState((prevState) => {
                      const newState = { ...prevState }
                      for (const key in newState) {
                        newState[key] = false
                      }
                      return newState
                    })
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Stack space={1}>
              <DropdownMenu
                fixed={true}
                title="Editable entries"
                icon="caretDown"
                menuClassName={styles.menuContainer}
                items={contentTypes.map((contentType) => ({
                  title: contentType.name,
                  render: () => {
                    const checked = editableState[contentType.name]

                    const toggleCheckbox = () => {
                      setEditableState((prevState) => ({
                        ...prevState,
                        [contentType.name]: !prevState[contentType.name],
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
                          disabled={isSaving}
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
                  disabled={isSaving}
                  variant="text"
                  size="small"
                  onClick={() => {
                    setEditableState((prevState) => {
                      const newState = { ...prevState }
                      for (const contentTypeName in newState) {
                        const contentTypeSysId = contentTypes.find(
                          (type) => type.name === contentTypeName,
                        )?.sys?.id
                        newState[contentTypeName] =
                          DEFAULT_EDITABLE_ENTRY_TYPE_IDS.includes(
                            contentTypeSysId,
                          )
                      }
                      return newState
                    })
                  }}
                >
                  Set to default
                  <Tooltip
                    placement="right"
                    text={
                      <div>
                        {sortedDefaultEditableEntryIds.map((id) => (
                          <Text key={id} variant="small">
                            {id}
                          </Text>
                        ))}
                      </div>
                    }
                  />
                </Button>
                <Button
                  disabled={isSaving}
                  variant="text"
                  size="small"
                  onClick={() => {
                    setEditableState((prevState) => {
                      const newState = { ...prevState }
                      for (const contentTypeName in newState) {
                        const contentTypeSysId = contentTypes.find(
                          (type) => type.name === contentTypeName,
                        )?.sys?.id
                        newState[contentTypeName] =
                          DEFAULT_EDITABLE_ENTRY_TYPE_IDS.includes(
                            contentTypeSysId,
                          )
                            ? true
                            : newState[contentTypeName]
                      }
                      return newState
                    })
                  }}
                >
                  Bitwise OR default
                  <Tooltip
                    placement="right"
                    text={
                      <Text variant="small">
                        Only turn on what is in the default editable entry list
                        and leave everything else like it was (bitwise OR)
                      </Text>
                    }
                  />
                </Button>
                <Button
                  disabled={isSaving}
                  variant="text"
                  size="small"
                  onClick={() => {
                    setEditableState((prevState) => {
                      const newState = { ...prevState }
                      for (const key in newState) {
                        newState[key] = true
                      }
                      return newState
                    })
                  }}
                >
                  Set all
                </Button>
                <Button
                  disabled={isSaving}
                  variant="text"
                  size="small"
                  onClick={() => {
                    setEditableState((prevState) => {
                      const newState = { ...prevState }
                      for (const key in newState) {
                        newState[key] = false
                      }
                      return newState
                    })
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Stack>
          </Box>
          <Box marginTop={1}>
            <Inline alignY="center">
              <Checkbox
                disabled={isSaving}
                checked={canReadAllAssets}
                label="Can read all assets"
                onChange={() => {
                  setCanReadAllAssets((prev) => !prev)
                }}
              />
              <Tooltip
                placement="right"
                text={`If this is not checked then role can only view assets tagged with ${slugify(
                  role.name,
                )}`}
              />
            </Inline>
          </Box>
        </Inline>
      </Stack>
    </Box>
  )
}
