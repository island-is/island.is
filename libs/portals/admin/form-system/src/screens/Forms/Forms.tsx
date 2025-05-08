import { Box } from '@island.is/island-ui/core'
import { useLoaderData } from 'react-router-dom'
import { TableRow } from '../../components/TableRow/TableRow'
import { FormsLoaderResponse, GET_FORMS } from '@island.is/form-system/graphql'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { FormSystemForm } from '@island.is/api/schema'
import { FormsHeader } from './FormsHeader'
import { TableRowHeader } from '../../components/TableRow/TableRowHeader'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'

export const Forms = () => {
  const { control } = useContext(ControlContext)
  const { forms, organizations, isAdmin, organizationNationalId } =
    useLoaderData() as FormsLoaderResponse
  const [getFormsQuery] = useLazyQuery(GET_FORMS, { fetchPolicy: 'no-cache' })

  const [formsState, setFormsState] = useState<FormSystemForm[]>(forms)
  const [organizationsState, setOrganizationsState] = useState(organizations)

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
    const updatedOrganizations = organizationsState.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizationsState(updatedOrganizations)

    const { data } = await getFormsQuery({
      variables: {
        input: {
          nationalId: selected.value,
        },
      },
    })
    if (data?.formSystemForms?.forms) {
      setFormsState(data.formSystemForms.forms)
    }
  }

  useEffect(() => {
    if (isAdmin && control.organizationNationalId) {
      handleOrganizationChange({ value: control.organizationNationalId })
    }
  }, [])

  if (forms) {
    return (
      <>
        <FormsHeader
          setFormsState={setFormsState}
          organizations={organizationsState}
          onOrganizationChange={handleOrganizationChange}
          isAdmin={isAdmin}
          organizationNationalId={organizationNationalId}
        />

        <Box marginTop={5}></Box>

        <TableRowHeader />
        {forms &&
          formsState?.map((f) => {
            return (
              <TableRow
                key={f?.id}
                id={f?.id}
                name={f?.name?.is ?? ''}
                org={f?.organizationId}
                isHeader={false}
                translated={f?.isTranslated ?? false}
                slug={f?.slug ?? ''}
                beenPublished={f?.beenPublished ?? false}
                setFormsState={setFormsState}
              />
            )
          })}
      </>
    )
  }
  return <></>
}

export default Forms
