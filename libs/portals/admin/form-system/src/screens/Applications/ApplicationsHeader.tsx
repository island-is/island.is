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
  isAdmin: boolean
}

export const ApplicationsHeader = (props: Props) => {
  const { organizations, onOrganizationChange, isAdmin } = props
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const { control } = useContext(ControlContext)

  if (!control) {
    throw new Error('ApplicationsHeader must be used within ControlContext')
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
