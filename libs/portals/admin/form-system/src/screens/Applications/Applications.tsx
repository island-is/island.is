import { useLoaderData } from 'react-router-dom'
import { ApplicationsLoaderResponse } from '@island.is/form-system/graphql'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useState } from 'react'
import { ApplicationsHeader } from '../../components/Headers/ApplicationsHeader'

export const Applications = () => {
  const { organizations, isAdmin } =
    useLoaderData() as ApplicationsLoaderResponse
  const { formatMessage } = useIntl()

  const [organizationsState, setOrganizationsState] = useState(organizations)

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
    const updatedOrganizations = organizationsState.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizationsState(updatedOrganizations)
  }
  return (
    <>
      <ApplicationsHeader
        organizations={organizationsState}
        onOrganizationChange={handleOrganizationChange}
        isAdmin={isAdmin}
      />
      <div>{formatMessage(m.applications)}</div>
    </>
  )
}
