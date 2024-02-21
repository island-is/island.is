import { ContentTypeProps, RoleProps } from 'contentful-management'
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
  ToggleSwitchButton,
  Tooltip,
} from '@island.is/island-ui/core'

import {
  DEFAULT_EDITABLE_ENTRY_TYPE_IDS,
  DEFAULT_READ_ONLY_ENTRY_IDS,
} from '../../constants'
import { useCheckboxState } from '../../hooks/useCheckboxState'
import * as styles from './RoleCard.css'

interface RoleCardProps {
  role: RoleProps
  tagExists: boolean
  contentTypes: ContentTypeProps[]
  canReadAllAssets: boolean
}

const emptyFunction = () => {
  return undefined
}

export const RoleCard = ({
  role,
  tagExists,
  contentTypes,
  canReadAllAssets,
}: RoleCardProps) => {
  const [readOnlyState, setReadOnlyState] = useCheckboxState(
    'readonly',
    role,
    contentTypes,
  )
  const [editableState, setEditableState] = useCheckboxState(
    'edit',
    role,
    contentTypes,
  )

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
            <Button size="small">Save</Button>
          </Box>
        </Inline>

        <Inline space={5}>
          <Box>
            <Stack space={1}>
              <DropdownMenu
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
                        {DEFAULT_READ_ONLY_ENTRY_IDS.sort().map((id) => (
                          <Text key={id} variant="small">
                            {id}
                          </Text>
                        ))}
                      </div>
                    }
                  />
                </Button>

                <Button
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
                        {DEFAULT_EDITABLE_ENTRY_TYPE_IDS.sort().map((id) => (
                          <Text key={id} variant="small">
                            {id}
                          </Text>
                        ))}
                      </div>
                    }
                  />
                </Button>
                <Button
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
                checked={canReadAllAssets}
                label="Can read all assets"
                // onChange={() =>
                //   setRoleNamesThatCanReadAllAssets((prev) => {
                //     if (prev.includes(role.name))
                //       return prev.filter((name) => name !== role.name)
                //     return prev.concat(role.name)
                //   })
                // }
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
      </Stack>
    </Box>
  )
}
