import { Box, Button, Text, Inline } from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { TableRow } from '../../components/TableRow/TableRow'
import { CREATE_FORM, GET_FORMS } from '@island.is/form-system/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useState } from 'react'
import { FormSystemForm } from '@island.is/api/schema'
import { TableRowHeader } from '../../components/TableRow/TableRowHeader'
import { ApplicationsLoaderResponse } from './Applications.loader'
import { ApplicationsHeader } from './ApplicationsHeader'
// import { Option } from '../../../../../../island-ui/core/src/lib/Select/Select.types'

export const Applications = () => {
  const navigate = useNavigate()
  const { forms, organizations, isAdmin } =
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
      <div>Applicaions</div>
    </>
  )
}
