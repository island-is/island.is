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
interface Props {
  organizations: Option<string>[]
  onOrganizationChange: (selected: { value: string }) => void
  isAdmin: boolean
}

export const ApplicationsHeader = (props: Props) => {
  const { organizations, onOrganizationChange, isAdmin } = props
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

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
                label="stofnun"
                options={organizations}
                size="sm"
                defaultValue={organizations.find((org) => org.isSelected)}
                onChange={async (selected) => {
                  if (selected) {
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
