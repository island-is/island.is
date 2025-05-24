import { Tabs } from '@island.is/island-ui/core'
import { useLoaderData } from 'react-router-dom'
import {
  AdminLoaderResponse,
  GET_ORGANIZATION_ADMIN,
} from '@island.is/form-system/graphql'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { AdminHeader } from './AdminHeader'
import { PermissionsList } from '../../components/Admin/PermissionsList'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'

export const Admin = () => {
  const { control } = useContext(ControlContext)
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

  useEffect(() => {
    if (control.organizationNationalId) {
      handleOrganizationChange({ value: control.organizationNationalId })
    }
  }, [])

  const tabs = [
    {
      label: formatMessage(m.certifications),
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
      label: formatMessage(m.lists),
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
      label: formatMessage(m.inputFields),
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
      <Tabs
        label={formatMessage(m.regulations)}
        tabs={tabs}
        contentBackground="white"
      />
    </>
  )
}
