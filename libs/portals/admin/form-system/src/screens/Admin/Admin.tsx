import { Box, Button, Text, Inline, Tabs } from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { TableRow } from '../../components/TableRow/TableRow'
import {
  AdminLoaderResponse,
  CREATE_FORM,
  GET_FORMS,
  GET_ORGANIZATION_ADMIN,
} from '@island.is/form-system/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useState } from 'react'
import { FormSystemForm } from '@island.is/api/schema'
import { TableRowHeader } from '../../components/TableRow/TableRowHeader'
import { divide } from 'lodash'
import { AdminHeader } from './AdminHeader'
import { PermissionsList } from '../../components/Admin/PermissionsList'

export const Admin = () => {
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

  const [getAdminQuery] = useLazyQuery(GET_ORGANIZATION_ADMIN, {
    fetchPolicy: 'no-cache',
  })
  const {
    organizationId,
    selectedCertificationTypes,
    selectedListTypes,
    selectedFieldTypes,
    certficationTypes,
    listTypes,
    fieldTypes,
    organizations,
  } = useLoaderData() as AdminLoaderResponse

  const [organizationsState, setOrganizationsState] = useState(organizations)
  const [organizationIdState, setOrganizationIdState] = useState(organizationId)
  const [selectedCertificationTypesState, setSelectedCertificationTypesState] =
    useState(selectedCertificationTypes)
  const [selectedListTypesState, setSelectedListTypesState] =
    useState(selectedListTypes)
  const [selectedFieldTypesState, setSelectedFieldTypesState] =
    useState(selectedFieldTypes)

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
    const updatedOrganizations = organizationsState.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizationsState(updatedOrganizations)

    const { data } = await getAdminQuery({
      variables: {
        input: {
          nationalId: selected.value,
        },
      },
    })

    if (data?.formSystemOrganizationAdmin.organizationId) {
      setOrganizationIdState(data.formSystemOrganizationAdmin.organizationId)
    }

    if (data?.formSystemOrganizationAdmin.selectedCertificationTypes) {
      setSelectedCertificationTypesState(
        data.formSystemOrganizationAdmin.selectedCertificationTypes,
      )
    }

    if (data?.formSystemOrganizationAdmin.selectedListTypes) {
      setSelectedListTypesState(
        data.formSystemOrganizationAdmin.selectedListTypes,
      )
    }

    if (data?.formSystemOrganizationAdmin.selectedFieldTypes) {
      setSelectedFieldTypesState(
        data.formSystemOrganizationAdmin.selectedFieldTypes,
      )
    }
  }

  const tabs = [
    {
      label: 'Vottorð',
      content: (
        <PermissionsList
          selectedPermissions={selectedCertificationTypesState}
          permissionsList={certficationTypes}
          organizationId={organizationIdState}
          setSelectedPermissionsState={setSelectedCertificationTypesState}
        />
      ),
    },
    {
      label: 'Listar',
      content: (
        <PermissionsList
          selectedPermissions={selectedListTypesState}
          permissionsList={listTypes}
          organizationId={organizationIdState}
          setSelectedPermissionsState={setSelectedListTypesState}
        />
      ),
    },
    {
      label: 'Innsláttarreitir',
      content: (
        <PermissionsList
          selectedPermissions={selectedFieldTypesState}
          permissionsList={fieldTypes}
          organizationId={organizationIdState}
          setSelectedPermissionsState={setSelectedFieldTypesState}
        />
      ),
    },
  ]

  return (
    <>
      <AdminHeader
        organizations={organizationsState}
        onOrganizationChange={handleOrganizationChange}
      />
      <Tabs label="Reglugerðir" tabs={tabs} contentBackground="white" />
    </>
  )
}
