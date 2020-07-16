/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, Suspense, useEffect, useState } from 'react'
import { Box, Typography, Stack, Divider } from '@island.is/island-ui/core'
import { useStateValue } from '../../stateProvider'

export const Dashboard: FC<{}> = () => {
  const [{ modules }] = useStateValue()
  const [ApplicationWidgets, setApplicationWidgets] = useState<any>()

  useEffect(() => {
    async function fetchWidgets() {
      const ApplicationWidgets = await modules.applicationsModule.widgets()
      setApplicationWidgets(ApplicationWidgets)
    }

    fetchWidgets()
  }, [modules.applicationsModule])

  return (
    <Box padding={4}>
      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h4">
          Dashboard
        </Typography>
        <Divider />
        {ApplicationWidgets && (
          <Suspense fallback="Loading">
            <ApplicationWidgets />
          </Suspense>
        )}
      </Stack>
    </Box>
  )
}

export default Dashboard
