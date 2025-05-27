import {
  Box,
  Button,
  GridRow as Row,
  Select,
  Option,
} from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'

interface Props {
  organizations: Option<string>[]
  onOrganizationChange: (selected: { value: string }) => void
}

export const AdminHeader = (props: Props) => {
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const { organizations, onOrganizationChange } = props
  const { control } = useContext(ControlContext)

  if (!control) {
    throw new Error('AdminHeader must be used within ControlContext')
  }

  return (
    <Box marginBottom={4} marginLeft={2}>
      <Row>
        <Box marginRight={4}>
          <Button
            variant="ghost"
            size="default"
            onClick={async () => {
              navigate(FormSystemPaths.FormSystemRoot)
            }}
          >
            {formatMessage(m.form)}
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
        <Box>
          <Select
            name="organizations"
            label={formatMessage(m.organization)}
            options={organizations}
            size="sm"
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
      </Row>
    </Box>
  )
}
