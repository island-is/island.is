import { useLoaderData } from 'react-router-dom'
import {
  ApplicationsLoaderResponse,
  GET_APPLICATIONS,
} from '@island.is/form-system/graphql'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useEffect, useState } from 'react'
import { ApplicationsHeader } from './ApplicationsHeader'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { useLazyQuery } from '@apollo/client'
import { Box } from '@island.is/island-ui/core'
import { ApplicationsTableHeader } from '../../components/ApplicationsTable/ApplicationsTableHeader'
import { ApplicationsTableRow } from '../../components/ApplicationsTable/ApplicationsTableRow'

export const Applications = () => {
  const { control } = useContext(ControlContext)
  const { applications, organizationNationalId, organizations, isAdmin } =
    useLoaderData() as ApplicationsLoaderResponse
  const { formatMessage } = useIntl()
  const [getApplicationsQuery] = useLazyQuery(GET_APPLICATIONS, {
    fetchPolicy: 'no-cache',
  })

  const [applicationsState, setApplicationsState] = useState(applications)
  const [organizationsState, setOrganizationsState] = useState(organizations)

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
    const updatedOrganizations = organizationsState.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizationsState(updatedOrganizations)

    const { data } = await getApplicationsQuery({
      variables: {
        input: {
          organizationNationalId: selected.value,
          page: 1,
          limit: 20,
          isTest: true,
        },
      },
    })
    if (data?.formSystemApplications?.applications) {
      setApplicationsState(data.formSystemApplications.applications)
    }
  }

  useEffect(() => {
    if (isAdmin && control.organizationNationalId) {
      handleOrganizationChange({ value: control.organizationNationalId })
    }
  }, [control.organizationNationalId])

  return (
    <>
      <ApplicationsHeader
        organizations={organizationsState}
        onOrganizationChange={handleOrganizationChange}
        isAdmin={isAdmin}
      />
      <Box marginTop={5}></Box>
      <ApplicationsTableHeader />
      {applicationsState &&
        applicationsState?.map((a) => (
          <ApplicationsTableRow
            key={a?.id}
            submittedAt={a?.submittedAt}
            status={a?.status}
          />
        ))}
    </>
  )
}
