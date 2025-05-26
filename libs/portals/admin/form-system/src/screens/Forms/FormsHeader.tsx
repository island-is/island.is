import {
  Box,
  Button,
  GridRow as Row,
  Select,
  Option,
} from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { CREATE_FORM } from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Dispatch, SetStateAction } from 'react'
import { FormSystemForm } from '@island.is/api/schema'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'

interface Props {
  setFormsState: Dispatch<SetStateAction<FormSystemForm[]>>
  organizations: Option<string>[]
  onOrganizationChange: (selected: { value: string }) => void
  isAdmin: boolean
  organizationNationalId: string
}

export const FormsHeader = (props: Props) => {
  const {
    setFormsState,
    organizations,
    onOrganizationChange,
    isAdmin,
    organizationNationalId,
  } = props
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const { control } = useContext(ControlContext)

  if (!control) {
    throw new Error('FormsHeader must be used within ControlContext')
  }

  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM, {
    onCompleted: (newFormData) => {
      if (newFormData?.createFormSystemForm?.form) {
        setFormsState((prevForms) => [
          ...prevForms,
          newFormData.createFormSystemForm.form,
        ])
      }
    },
  })

  if (!control.organizationNationalId) {
    control.organizationNationalId = organizationNationalId
  }

  return (
    <Box marginBottom={4} marginLeft={2}>
      <Row>
        <Box marginRight={4}>
          <Button
            variant="ghost"
            size="default"
            onClick={async () => {
              const { data } = await formSystemCreateFormMutation({
                variables: {
                  input: {
                    organizationNationalId: control.organizationNationalId,
                  },
                },
              })
              navigate(
                FormSystemPaths.Form.replace(
                  ':formId',
                  String(data?.createFormSystemForm?.form?.id),
                ),
              )
            }}
          >
            {formatMessage(m.newForm)}
          </Button>
        </Box>
        <Box marginRight={4}>
          <Button
            variant="ghost"
            size="default"
            onClick={async () => {
              navigate(FormSystemPaths.Applications)
            }}
          >
            {formatMessage(m.applications)}
          </Button>
        </Box>
        {isAdmin && (
          <>
            <Box marginRight={4}>
              <Button
                variant="ghost"
                size="default"
                onClick={async () => {
                  navigate(FormSystemPaths.Admin)
                }}
              >
                {formatMessage(m.administration)}
              </Button>
            </Box>
            <Box>
              <Select
                name="organizations"
                label={formatMessage(m.organization)}
                options={organizations}
                size="sm"
                defaultValue={organizations.find((org) => org.isSelected)}
                value={organizations.find(
                  (org) => org.value === control.organizationNationalId,
                )}
                onChange={async (selected) => {
                  if (selected) {
                    control.organizationNationalId = selected.value
                    onOrganizationChange({ value: selected.value })
                  }
                }}
              ></Select>
            </Box>
          </>
        )}
      </Row>
    </Box>
  )
}
