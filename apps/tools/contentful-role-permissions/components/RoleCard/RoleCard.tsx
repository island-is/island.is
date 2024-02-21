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
import * as styles from './RoleCard.css'

interface RoleCardProps {
  role: RoleProps
  isEditable: boolean
  toggleEditable: () => void
  tagExists: boolean
  contentTypes: ContentTypeProps[]
  readOnlyState: Record<string, boolean>
  editableState: Record<string, boolean>
  canReadAllAssets: boolean
}

const emptyFunction = () => {
  return undefined
}

export const RoleCard = ({
  isEditable,
  toggleEditable,
  role,
  tagExists,
  contentTypes,
  readOnlyState,
  editableState,
  canReadAllAssets,
}: RoleCardProps) => {
  return (
    <Box
      border="standard"
      borderWidth="standard"
      borderRadius="standard"
      padding={3}
      style={{ opacity: isEditable ? '1' : '0.6' }}
    >
      <Stack space={2}>
        <Inline justifyContent="spaceBetween" space={2}>
          <Box marginBottom={2}>
            <Inline alignY="top">
              <Checkbox checked={isEditable} onChange={toggleEditable} />
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
          {isEditable && (
            <Box display="flex" flexDirection="row" justifyContent="flexEnd">
              <Button size="small">Save</Button>
            </Box>
          )}
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
                      // setReadonlyCheckboxState((prevState) => ({
                      //   ...prevState,
                      //   [role.name]: {
                      //     ...prevState[role.name],
                      //     [contentType.name]:
                      //       !prevState[role.name][contentType.name],
                      //   },
                      // }))
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
                          disabled={!isEditable}
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
                  disabled={!isEditable}
                  variant="text"
                  size="small"
                  onClick={() => {
                    // setReadonlyCheckboxState((prevState) => {
                    //   const newState = JSON.parse(JSON.stringify(prevState))
                    //   for (const roleName in prevState) {
                    //     for (const contentTypeName in prevState[roleName]) {
                    //       if (
                    //         DEFAULT_READ_ONLY_ENTRY_IDS.includes(
                    //           contentTypes.find(
                    //             (type) => type.name === contentTypeName,
                    //           )?.sys?.id,
                    //         )
                    //       ) {
                    //         newState[roleName][contentTypeName] = true
                    //       } else {
                    //         newState[roleName][contentTypeName] = false
                    //       }
                    //     }
                    //   }
                    //   return newState
                    // })
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
                  disabled={!isEditable}
                  variant="text"
                  size="small"
                  onClick={() => {
                    // setReadonlyCheckboxState((prevState) => {
                    //   const newState = JSON.parse(JSON.stringify(prevState))
                    //   for (const roleName in prevState) {
                    //     for (const contentTypeName in prevState[roleName]) {
                    //       newState[roleName][contentTypeName] = true
                    //     }
                    //   }
                    //   return newState
                    // })
                  }}
                >
                  Set all
                </Button>

                <Button
                  disabled={!isEditable}
                  variant="text"
                  size="small"
                  onClick={() => {
                    // setReadonlyCheckboxState((prevState) => {
                    //   const newState = JSON.parse(JSON.stringify(prevState))
                    //   for (const roleName in prevState) {
                    //     for (const contentTypeName in prevState[roleName]) {
                    //       newState[roleName][contentTypeName] = false
                    //     }
                    //   }
                    //   return newState
                    // })
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
                      // setCheckboxState((prevState) => ({
                      //   ...prevState,
                      //   [role.name]: {
                      //     ...prevState[role.name],
                      //     [contentType.name]:
                      //       !prevState[role.name][contentType.name],
                      //   },
                      // }))
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
                          disabled={!isEditable}
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
                  disabled={!isEditable}
                  variant="text"
                  size="small"
                  onClick={() => {
                    // setCheckboxState((prevState) => {
                    //   const newState = JSON.parse(JSON.stringify(prevState))
                    //   for (const roleName in prevState) {
                    //     for (const contentTypeName in prevState[roleName]) {
                    //       if (
                    //         DEFAULT_EDITABLE_ENTRY_TYPE_IDS.includes(
                    //           contentTypes.find(
                    //             (type) => type.name === contentTypeName,
                    //           )?.sys?.id,
                    //         )
                    //       ) {
                    //         newState[roleName][contentTypeName] = true
                    //       } else {
                    //         newState[roleName][contentTypeName] = false
                    //       }
                    //     }
                    //   }
                    //   return newState
                    // })
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
                  disabled={!isEditable}
                  variant="text"
                  size="small"
                  onClick={() => {
                    // setCheckboxState((prevState) => {
                    //   const newState = JSON.parse(JSON.stringify(prevState))
                    //   for (const roleName in prevState) {
                    //     for (const contentTypeName in prevState[roleName]) {
                    //       newState[roleName][contentTypeName] = true
                    //     }
                    //   }
                    //   return newState
                    // })
                  }}
                >
                  Set all
                </Button>
                <Button
                  disabled={!isEditable}
                  variant="text"
                  size="small"
                  onClick={() => {
                    // setCheckboxState((prevState) => {
                    //   const newState = JSON.parse(JSON.stringify(prevState))
                    //   for (const roleName in prevState) {
                    //     for (const contentTypeName in prevState[roleName]) {
                    //       newState[roleName][contentTypeName] = false
                    //     }
                    //   }
                    //   return newState
                    // })
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
                disabled={!isEditable}
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
