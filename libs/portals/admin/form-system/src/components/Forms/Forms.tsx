import { useContext, useEffect } from "react"
import { TableRowHeader } from "../TableRow/TableRowHeader"
import { FormsContext } from "../../context/FormsContext"
import { TableRow } from "../TableRow/TableRow"
import { useLazyQuery, useMutation } from "@apollo/client"
import { CREATE_FORM, GET_FORMS } from '@island.is/form-system/graphql'
import { Box, Button, GridRow, Select, } from '@island.is/island-ui/core'
import { useNavigate } from "react-router-dom"
import { FormSystemPaths } from "../../lib/paths"
import { useIntl } from "react-intl"
import { m } from '@island.is/form-system/ui'


export const Forms = () => {
  const {
    forms,
    setForms,
    organizations,
    setOrganizations,
    isAdmin,
    organizationNationalId,
    setOrganizationNationalId } = useContext(FormsContext)
  const [getFormsQuery] = useLazyQuery(GET_FORMS, { fetchPolicy: 'no-cache' })
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

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
    }
    catch (error) {
      console.error('Error creating form:', error)
    }
  }

  useEffect(() => {
    if (isAdmin && organizationNationalId) {
      handleOrganizationChange({ value: organizationNationalId })
    }
  }, [])

  return (
    <Box marginTop={5}>
      <Box marginTop={5} marginBottom={5}>
        <GridRow>
          <Box
            marginLeft={2}
            marginRight={2}
            justifyContent="spaceBetween"
            display="flex"
            width="full"
          >
            <Button
              size="default"
              onClick={createForm}
            >
              {formatMessage(m.newForm)}
            </Button>
            {isAdmin && (
              <Select
                name="organizations"
                label={formatMessage(m.organization)}
                options={organizations}
                size="sm"
                value={organizations.find(org => org.value === organizationNationalId)}
                onChange={selected => {
                  if (selected) {
                    setOrganizationNationalId(selected.value)
                    handleOrganizationChange({ value: selected.value })
                  }
                }}
              />
            )}
          </Box>
        </GridRow>
      </Box>
      <TableRowHeader />
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
    </Box>
  )
}