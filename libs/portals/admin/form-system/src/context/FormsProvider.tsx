import { useLazyQuery } from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import {
  FormsLoaderResponse,
  GET_FORMS,
  GET_ORGANIZATION_ADMIN,
} from '@island.is/form-system/graphql'
import { Option } from '@island.is/island-ui/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormsLocationState } from '../lib/utils/interfaces'
import { FormsContext, IFormsContext } from './FormsContext'

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
    organizationDelegations,
  } = formsLoader
  const [forms, updateForms] = useState<FormSystemForm[]>(formsState)
  const formsRevision = useRef(0)
  const setForms = useCallback<IFormsContext['setForms']>((update) => {
    formsRevision.current += 1
    updateForms(update)
  }, [])
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
  const [selectedDelegations, setSelectedDelegations] = useState<string[]>(
    organizationDelegations ?? [],
  )
  const organizationChangeRequest = useRef(0)
  const getOrganizationGeneration = useCallback(
    () => organizationChangeRequest.current,
    [],
  )

  const refreshForms = useCallback<IFormsContext['refreshForms']>(
    async (organizationGeneration) => {
      while (organizationGeneration === organizationChangeRequest.current) {
        const revision = formsRevision.current
        const { data, error } = await getFormsQuery({
          variables: { input: { nationalId: organizationNationalId } },
        })
        if (organizationGeneration !== organizationChangeRequest.current) return
        if (revision !== formsRevision.current) continue
        if (error) throw error
        const refreshedForms = data?.formSystemForms?.forms
        if (!refreshedForms) throw new Error('Missing forms list')
        setForms(refreshedForms)
        return refreshedForms
      }
    },
    [getFormsQuery, organizationNationalId, setForms],
  )

  const handleOrganizationChange = async (selected: { value: string }) => {
    const requestId = ++organizationChangeRequest.current
    setOrganizationNationalId(selected.value)
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
    if (requestId !== organizationChangeRequest.current) {
      return
    }
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

    if (requestId !== organizationChangeRequest.current) {
      return
    }
    const admin = permissionsData?.formSystemOrganizationAdmin
    const {
      organizationId,
      selectedCertificationTypes,
      selectedListTypes,
      selectedFieldTypes,
      organizationDelegations,
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
    if (organizationDelegations) {
      setSelectedDelegations(
        organizationDelegations.filter(Boolean) as string[],
      )
    }
  }

  useEffect(() => {
    setLocation('forms')
  }, [])

  const context: IFormsContext = useMemo(
    () => ({
      forms,
      setForms,
      getOrganizationGeneration,
      refreshForms,
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
      selectedDelegations,
      setSelectedDelegations,
      certificationTypes,
      listTypes,
      fieldTypes,
      handleOrganizationChange,
    }),
    [
      forms,
      setForms,
      getOrganizationGeneration,
      refreshForms,
      organizations,
      organizationId,
      organizationNationalId,
      isAdmin,
      location,
      selectedCertificationTypes,
      selectedListTypes,
      selectedFieldTypes,
      selectedDelegations,
      certificationTypes,
      listTypes,
      fieldTypes,
    ],
  )

  return (
    <FormsContext.Provider value={context}>{children}</FormsContext.Provider>
  )
}
