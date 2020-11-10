import React from 'react'
import format from 'date-fns/format'
import {
  ActionCardLoader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard'
import { Text, Box, Stack } from '@island.is/island-ui/core'
import { useApplicantApplications } from '@island.is/service-portal/graphql'
import { useAssigneeApplications } from '@island.is/service-portal/graphql'
import { Application } from '@island.is/application/core'

const ApplicationList: ServicePortalModuleComponent = ({ userInfo }) => {
  const { data: applications, loading, error } = useApplicantApplications(
    userInfo.profile.nationalId,
  )

  const {
    data: assigneeApplications,
    loading: assigneeApplicationsLoading,
    error: assigneeApplicationsError,
  } = useAssigneeApplications(userInfo.profile.nationalId)

  return (
    <>
      <Box marginBottom={5}>
        <Text variant="h1">Umsóknir</Text>
      </Box>
      {loading && <ActionCardLoader repeat={3} />}
      {error && (
        <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
          <Text variant="h3">
            Tókst ekki að sækja umsóknir, eitthvað fór úrskeiðis
          </Text>
        </Box>
      )}
      <Stack space={2}>
        {applications?.map((application: Application) => (
          <ApplicationCard
            key={application.id}
            name={application.name || application.typeId}
            date={format(new Date(application.modified), 'MMMM')}
            isComplete={application.progress === 1}
            url={`http://localhost:4200/applications${application.id}`} // TODO update to correct path
            progress={application.progress ? application.progress * 100 : 0}
          />
        ))}
      </Stack>

      <Box marginTop={5} marginBottom={5}>
        <Text variant="h1">Umsóknir til samþykktar</Text>
      </Box>
      {assigneeApplicationsLoading && <ActionCardLoader repeat={3} />}
      {assigneeApplicationsError && (
        <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
          <Text variant="h3">
            Tókst ekki að sækja umsóknir, eitthvað fór úrskeiðis
          </Text>
        </Box>
      )}
      <Stack space={2}>
        {assigneeApplications?.map((application: Application) => (
          <ApplicationCard
            key={application.id}
            name={application.name || application.typeId}
            date={format(new Date(application.modified), 'MMMM')}
            isComplete={application.progress === 1}
            url={`http://localhost:4200/applications${application.id}`} // TODO update to correct path
            progress={application.progress ? application.progress * 100 : 0}
          />
        ))}
      </Stack>
    </>
  )
}

export default ApplicationList
