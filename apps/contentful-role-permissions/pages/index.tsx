import { InferGetServerSidePropsType } from 'next'
import { useState } from 'react'
import {
  Box,
  Text,
  DropdownMenu,
  Button,
  toast,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'

import {
  extractInitialCheckboxStateFromRolesAndContentTypes,
  getAllContentTypesInAscendingOrder,
  getAllRoles,
} from '../utils'
import { IDS_OF_ENTRIES_THAT_CAN_BE_CREATED } from '../constants'

import * as styles from './index.css'

const emptyFunction = () => {}

const Home = ({
  roles,
  contentTypes,
  initialCheckboxState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [checkboxState, setCheckboxState] = useState(initialCheckboxState)
  const [savedCheckboxState, setSavedCheckboxState] = useState(
    initialCheckboxState,
  )

  const onSave = () => {
    fetch('/api/update-role-permissions', {
      method: 'PUT',
      body: JSON.stringify(checkboxState),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success('Saved successfully')
        return setSavedCheckboxState(data)
      })
      .catch((err) => {
        console.error(err)
        return toast.error('Error occured during save')
      })
  }

  const canSave =
    JSON.stringify(savedCheckboxState) !== JSON.stringify(checkboxState)

  console.log(JSON.stringify(roles[roles.length - 1]))

  return (
    <Box className={styles.container}>
      <Box display="flex" flexDirection="row" justifyContent="flexEnd">
        <Button onClick={onSave} size="small" disabled={!canSave}>
          Save
        </Button>
      </Box>

      <Box className={styles.rolesContainer}>
        {roles.map((role) => (
          <Box
            border="standard"
            borderWidth="standard"
            borderRadius="standard"
            padding={3}
            key={role.name}
          >
            <Text variant="h4" as="label">
              {role.name}
            </Text>
            <DropdownMenu
              title="Editable types"
              icon="caretDown"
              hasScroll={true}
              items={contentTypes.map((contentType) => ({
                title: contentType.name,
                render: () => {
                  const checked = checkboxState[role.name][contentType.name]

                  const toggleCheckbox = () => {
                    setCheckboxState((prevState) => ({
                      ...prevState,
                      [role.name]: {
                        ...prevState[role.name],
                        [contentType.name]: !prevState[role.name][
                          contentType.name
                        ],
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
                        {contentType.name}
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
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export const getServerSideProps = async () => {
  const [roles, contentTypes] = await Promise.all([
    getAllRoles(),
    getAllContentTypesInAscendingOrder(),
  ])

  const rolesToShow = roles.filter((role) =>
    role.name.toLowerCase().startsWith('owner-'),
  )

  const initialCheckboxState = extractInitialCheckboxStateFromRolesAndContentTypes(
    rolesToShow,
    contentTypes,
    IDS_OF_ENTRIES_THAT_CAN_BE_CREATED,
  )
  return { props: { roles: rolesToShow, contentTypes, initialCheckboxState } }
}

export default Home
