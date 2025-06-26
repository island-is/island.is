import { useContext, useEffect } from 'react'
import { TableHeader } from './components/Table/TableHeader'
import { FormsContext } from '../../context/FormsContext'
import { TableRow } from './components/Table/TableRow'
import { useMutation } from '@apollo/client'
import { CREATE_FORM } from '@island.is/form-system/graphql'
import { Box, Button, GridRow } from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { OrganizationSelect } from '../OrganizationSelect'

export const Forms = () => {
  const {
    forms,
    setForms,
    isAdmin,
    organizationNationalId,
    handleOrganizationChange,
  } = useContext(FormsContext)
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM, {
    onCompleted: (newFormData) => {
      if (newFormData?.createFormSystemForm?.form) {
        setForms((prevForms) => [
          ...prevForms,
          newFormData.createFormSystemForm.form,
        ])
      }
    },
  })

  const createForm = async () => {
    try {
      const { data } = await formSystemCreateFormMutation({
        variables: {
          input: {
            organizationNationalId: organizationNationalId,
          },
        },
      })
      navigate(
        FormSystemPaths.Form.replace(
          ':formId',
          String(data?.createFormSystemForm?.form?.id),
        ),
      )
    } catch (error) {
      throw new Error(
        `Error creating form: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  useEffect(() => {
    if (isAdmin && organizationNationalId && handleOrganizationChange) {
      handleOrganizationChange({ value: organizationNationalId })
    }
  }, [])

  return (
    <>
      <GridRow>
        <Box
          marginTop={4}
          marginBottom={8}
          marginRight={1}
          marginLeft={2}
          display="flex"
          justifyContent="flexEnd"
          width="full"
        >
          <Box justifyContent="spaceBetween" display="flex" width="full">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              columnGap={4}
            >
              <Button size="default" onClick={createForm}>
                {formatMessage(m.newForm)}
              </Button>
            </Box>
            <OrganizationSelect />
          </Box>
        </Box>
      </GridRow>
      <TableHeader />
      {forms &&
        forms?.map((f) => {
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
              setFormsState={setForms}
            />
          )
        })}
    </>
  )
}
