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
import { divide } from 'lodash'
import { AdminHeader } from './AdminHeader'
import { AdminLoaderResponse } from './Admin.loader'
// import { Option } from '../../../../../../island-ui/core/src/lib/Select/Select.types'

export const Admin = () => {
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM)
  const [getFormsQuery] = useLazyQuery(GET_FORMS)
  const { selectedCertificationTypes, certficationTypes, organizations } =
    useLoaderData() as AdminLoaderResponse

  const [organizationsState, setOrganizationsState] = useState(organizations)

  const handleOrganizationChange = async (selected: {
    value: string | undefined
  }) => {
    const updatedOrganizations = organizationsState.map((org) => ({
      ...org,
      isSelected: org.value === selected.value,
    }))
    setOrganizationsState(updatedOrganizations)

    // const { data } = await getFormsQuery({
    //   variables: {
    //     input: {
    //       nationalId: selected.value,
    //     },
    //   },
    // })
    // if (data?.formSystemGetAllForms?.forms) {
    //   setFormsState(data.formSystemGetAllForms.forms)
    // }
  }

  return (
    <>
      <AdminHeader
        organizations={organizationsState}
        onOrganizationChange={handleOrganizationChange}
      />
    </>
  )
}
