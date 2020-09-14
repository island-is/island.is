import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ApplicationCard, {
  MockApplication,
} from '../../components/ApplicationCard/ApplicationCard'
import { Typography, Box, Stack } from '@island.is/island-ui/core'

const mockApplications: MockApplication[] = [
  {
    name: 'Stafrænt ökuskírteini',
    date: '2020-07-27T00:00:00.000',
    status: true,
    url: 'https://leyfisumsokn.island.is/Home/Completed?applicationID=93202',
  },
  {
    name: 'Stafrænt ökuskírteini',
    date: '2020-06-22T00:00:00.000',
    status: false,
    url: 'https://leyfisumsokn.island.is/Home/Completed?applicationID=93202',
  },
]

const ApplicationList: ServicePortalModuleComponent = () => {
  return (
    <>
      <Box marginBottom={5}>
        <Typography variant="h1">Umsóknir</Typography>
      </Box>
      <Stack space={2}>
        {mockApplications.map((application, index) => (
          <ApplicationCard application={application} key={index} />
        ))}
      </Stack>
    </>
  )
}

export default ApplicationList
