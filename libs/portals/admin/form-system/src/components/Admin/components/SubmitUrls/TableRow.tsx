import {
  Box,
  GridRow,
  GridColumn,
  Text,
  Divider,
  Button,
  Icon,
  ToggleSwitchCheckbox,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { FormSystemOrganizationUrl } from '@island.is/api/schema'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from '@apollo/client'
import { DELETE_ORGANIZATION_URL } from '@island.is/form-system/graphql'

interface TableRowProps {
  submitUrl: FormSystemOrganizationUrl
  setSubmitUrlsState: Dispatch<SetStateAction<FormSystemOrganizationUrl[]>>
  handleDelete: (id: string) => void
}

interface ColumnTextProps {
  text: string
}

const ColumnText = ({ text }: ColumnTextProps) => (
  <Box width="full" textAlign="left" paddingLeft={1}>
    <Text variant="medium">{text}</Text>
  </Box>
)

export const TableRow = ({
  submitUrl,
  setSubmitUrlsState,
  handleDelete,
}: TableRowProps) => {
  const { id, url, method, isXroad } = submitUrl

  return (
    <Box paddingTop={2} paddingBottom={1} style={{ cursor: '' }}>
      <GridRow key={id}>
        <GridColumn span="11/12">
          <ColumnText text={url ?? ''} />
        </GridColumn>
        <GridColumn span="1/12">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box
              marginRight={1}
              cursor="pointer"
              onClick={() => {
                if (id) {
                  handleDelete(id)
                }
              }}
            >
              <Icon icon="trash" color="red400" type="filled" />
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Divider />
    </Box>
  )
}
