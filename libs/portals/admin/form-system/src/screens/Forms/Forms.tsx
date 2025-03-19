import { Box, Button, Text, Inline } from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { TableRow } from '../../components/TableRow/TableRow'
import { CREATE_FORM, GET_FORMS } from '@island.is/form-system/graphql'
import { FormsLoaderResponse } from './Forms.loader'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useEffect, useState } from 'react'
import { FormSystemForm } from '@island.is/api/schema'
import { FormsHeader } from '../../components/Headers/FormsHeader'
import { TableRowHeader } from '../../components/TableRow/TableRowHeader'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'
import Control from 'react-select/dist/declarations/src/components/Control'

// import { Option } from '../../../../../../island-ui/core/src/lib/Select/Select.types'

export const Forms = () => {
  const navigate = useNavigate()
  const { control, controlDispatch, inSettings, setInSettings } =
    useContext(ControlContext)
  const { forms, organizations, isAdmin } =
    useLoaderData() as FormsLoaderResponse
  const { formatMessage } = useIntl()
  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM)
  const [getFormsQuery] = useLazyQuery(GET_FORMS, { fetchPolicy: 'no-cache' })

  const [formsState, setFormsState] = useState<FormSystemForm[]>(forms)
  const [organizationsState, setOrganizationsState] = useState(organizations)

  console.log('control organizationNationalId', control.organizationNationalId)

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
    if (data?.formSystemGetAllForms?.forms) {
      setFormsState(data.formSystemGetAllForms.forms)
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
