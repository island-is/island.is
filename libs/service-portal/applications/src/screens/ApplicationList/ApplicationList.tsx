import React from 'react'
import format from 'date-fns/format'
import {
  ActionCardLoader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import ApplicationCard, {
  MockApplication,
} from '../../components/ApplicationCard/ApplicationCard'
import { Typography, Box, Stack } from '@island.is/island-ui/core'
import { useListApplications } from '@island.is/service-portal/graphql'
import { Application } from '@island.is/application/template'

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

const ApplicationList: ServicePortalModuleComponent = ({ userInfo }) => {
  const { data: applications, loading, error } = useListApplications(
    userInfo.user.profile.natreg,
  )

  return (
    <>
      <Box marginBottom={5}>
        <Typography variant="h1">Umsóknir</Typography>
      </Box>
      {loading && <ActionCardLoader repeat={3} />}
      <Stack space={2}>
        {mockApplications.map(({ name, date, status, url }, index) => (
          <ApplicationCard
            key={index}
            name={name}
            date={date}
            status={status}
            url={url}
            progress={50}
          />
        ))}
        {applications?.map((application: Application) => (
          <ApplicationCard
            key={application.id}
            name={application.name || application.typeId}
            date={format(new Date(application.modified), 'MMMM')}
            status={application.state === 'approved'}
            url={`http://localhost:4200/applications${application.id}`} // TODO update to correct path
            progress={application.progress ? application.progress * 100 : 0}
          />
        ))}
      </Stack>
    </>
  )
}

export default ApplicationList
