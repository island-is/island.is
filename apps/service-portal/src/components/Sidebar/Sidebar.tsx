/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect } from 'react'
import { Box, Typography, Stack, Divider } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { useStateValue } from '../../stateProvider'

export const Sidebar: FC<{}> = () => {
  const [{ modules, navigation }, dispatch] = useStateValue()

  useEffect(() => {
    async function fetchNavigation() {
      const nav = await modules.applicationsModule.navigation()
      dispatch({
        type: 'setNavigation',
        payload: {
          ...navigation,
          applications: nav,
        },
      })
    }
    fetchNavigation()
  }, [dispatch, navigation, modules.applicationsModule])

  return (
    <Box background="purple100" padding={4}>
      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h4">
          Sidebar
        </Typography>
        <Stack space={[1, 1, 2]}>
          <Divider weight="alternate" />
          {navigation.applications && (
            <Link to={navigation.applications.url}>
              <Box textAlign="left" outline="none">
                <Typography variant="p" as="span">
                  {navigation.applications.name}
                </Typography>
              </Box>
            </Link>
          )}
        </Stack>
        <Divider />
      </Stack>
    </Box>
  )
}

export default Sidebar
