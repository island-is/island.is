import {
  FormsLoaderResponse,
  GET_FORMS,
  GET_ORGANIZATION_ADMIN,
} from '@island.is/form-system/graphql'
import { useEffect, useState } from 'react'
import { Option } from '@island.is/island-ui/core'
import { FormsContext, IFormsContext } from './FormsContext'
import { FormSystemForm } from '@island.is/api/schema'
import { useLazyQuery } from '@apollo/client'
import { FormsLocationState } from '../lib/utils/interfaces'
import { useMemo } from 'react'

interface Props {
  children: React.ReactNode
  formsLoader: FormsLoaderResponse
}

export const FormsProvider = ({ children, formsLoader }: Props) => {
  const {
    forms: formsState,
    organizations: orgs,
    isAdmin,
    organizationId: orgId,
    organizationNationalId: orgNationalId,
    selectedCertificationTypes: selectedCert,
    selectedListTypes: selectedList,
    selectedFieldTypes: selectedField,
    certificationTypes,
    listTypes,
    fieldTypes,
  } = formsLoader
  const [forms, setForms] = useState<FormSystemForm[]>(formsState)
  const [organizations, setOrganizations] = useState<Option<string>[]>(orgs)
  const [getFormsQuery] = useLazyQuery(GET_FORMS, { fetchPolicy: 'no-cache' })
  const [getAdminQuery] = useLazyQuery(GET_ORGANIZATION_ADMIN, {
    fetchPolicy: 'no-cache',
  })
  const [location, setLocation] = useState<FormsLocationState>('forms')
  const [organizationNationalId, setOrganizationNationalId] =
    useState<string>(orgNationalId)
  const [organizationId, setOrganizationId] = useState<string>(orgId)
  const [selectedCertificationTypes, setSelectedCertificationTypes] =
    useState<string[]>(selectedCert)
  const [selectedListTypes, setSelectedListTypes] =
    useState<string[]>(selectedList)
  const [selectedFieldTypes, setSelectedFieldTypes] =
    useState<string[]>(selectedField)

  const handleOrganizationChange = async (selected: { value: string }) => {
    const updatedOrganizations = organizations.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizations(updatedOrganizations)

    const { data } = await getFormsQuery({
      variables: {
        input: {
          nationalId: selected.value,
        },
      },
    })
    if (data?.formSystemForms?.forms) {
      setForms(data.formSystemForms.forms)
    }

    const { data: permissionsData } = await getAdminQuery({
      variables: {
        input: {
          nationalId: selected.value,
        },
      },
    })

    const admin = permissionsData?.formSystemOrganizationAdmin
    const {
      organizationId,
      selectedCertificationTypes,
      selectedListTypes,
      selectedFieldTypes,
    } = admin

    if (organizationId) {
      setOrganizationId(organizationId)
    }
    if (selectedCertificationTypes) {
      setSelectedCertificationTypes(selectedCertificationTypes)
    }
    if (selectedListTypes) {
      setSelectedListTypes(selectedListTypes)
    }
    if (selectedFieldTypes) {
      setSelectedFieldTypes(selectedFieldTypes)
    }
  }

  useEffect(() => {
    setLocation('forms')
  }, [])

  const context: IFormsContext = useMemo(
    () => ({
      forms,
      setForms,
      organizations,
      setOrganizations,
      organizationId,
      setOrganizationId,
      organizationNationalId,
      setOrganizationNationalId,
      isAdmin,
      location,
      setLocation,
      selectedCertificationTypes,
      setSelectedCertificationTypes,
      selectedListTypes,
      setSelectedListTypes,
      selectedFieldTypes,
      setSelectedFieldTypes,
      certificationTypes,
      listTypes,
      fieldTypes,
      handleOrganizationChange,
    }),
    [
      forms,
      organizations,
      organizationId,
      organizationNationalId,
      isAdmin,
      location,
      selectedCertificationTypes,
      selectedListTypes,
      selectedFieldTypes,
      certificationTypes,
      listTypes,
      fieldTypes,
    ],
  )

  return (
    <FormsContext.Provider value={context}>{children}</FormsContext.Provider>
  )
}
