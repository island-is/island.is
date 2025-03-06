import {
  Box,
  Button,
  GridRow as Row,
  Select,
  Option,
} from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { CREATE_FORM, GET_FORMS } from '@island.is/form-system/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Dispatch, SetStateAction } from 'react'
import { FormSystemForm } from '@island.is/api/schema'

interface Props {
  organizations: Option<string>[]
  onOrganizationChange: (selected: { value: string }) => void
}

export const AdminHeader = (props: Props) => {
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const { organizations, onOrganizationChange } = props

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
        {organizations.length > 1 && (
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
        )}
      </Row>
    </Box>
  )
}
