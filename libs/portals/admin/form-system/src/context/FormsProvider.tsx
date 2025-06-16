import { FormsLoaderResponse, GET_FORMS } from '@island.is/form-system/graphql'
import { useEffect, useState } from 'react'
import { Option } from '@island.is/island-ui/core'
import { FormsContext, IFormsContext } from './FormsContext'
import { FormSystemApplication, FormSystemForm } from '@island.is/api/schema'
import { useLazyQuery } from '@apollo/client'
import { FormsLocationState } from '../lib/utils/interfaces'
import { useMemo } from 'react'

interface Props {
  children: React.ReactNode
  formsLoader: FormsLoaderResponse
}

export const FormsProvider = ({
  children,
  formsLoader
}: Props) => {
  const {
    forms: formsState,
    organizations: orgs,
    isAdmin,
    organizationId: orgId,
    organizationNationalId: orgNationalId,
    applications: apps,
    selectedCertificationTypes: selectedCert,
    selectedListTypes: selectedList,
    selectedFieldTypes: selectedField,
    certificationTypes,
    listTypes,
    fieldTypes,
  } = formsLoader
  const [forms, setForms] = useState<FormSystemForm[]>(formsState)
  const [organizations, setOrganizations] = useState<Option<string>[]>(orgs)
  const [applications, setApplications] = useState<FormSystemApplication[]>(apps)
  const [getFormsQuery] = useLazyQuery(GET_FORMS, { fetchPolicy: 'no-cache' })
  const [location, setLocation] = useState<FormsLocationState>('forms')
  const [organizationNationalId, setOrganizationNationalId] = useState<string>(orgNationalId)
  const [organizationId, setOrganizationId] = useState<string>(orgId)
  const [selectedCertificationTypes, setSelectedCertificationTypes] = useState<string[]>(selectedCert)
  const [selectedListTypes, setSelectedListTypes] = useState<string[]>(selectedList)
  const [selectedFieldTypes, setSelectedFieldTypes] = useState<string[]>(selectedField)

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
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
  }

  useEffect(() => {
    setLocation('forms')
  }, [])

  // useEffect(() => {
  //   if (isAdmin && control.organizationNationalId) {
  //     handleOrganizationChange({ value: control.organizationNationalId })
  //   }
  // }, [])

  const context: IFormsContext = useMemo(() => ({
    forms,
    setForms,
    organizations,
    setOrganizations,
    organizationId,
    setOrganizationId,
    organizationNationalId,
    setOrganizationNationalId,
    applications,
    isAdmin,
    setApplications,
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
  }), [
    forms,
    organizations,
    organizationId,
    organizationNationalId,
    applications,
    isAdmin,
    location,
    selectedCertificationTypes,
    selectedListTypes,
    selectedFieldTypes,
    certificationTypes,
    listTypes,
    fieldTypes,
  ])

  return (
    <FormsContext.Provider value={context}>
      {children}
    </FormsContext.Provider>
  )
}