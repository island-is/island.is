import {
  Box,
  GridRow,
  GridColumn,
  Text,
  Divider,
  Icon,
} from '@island.is/island-ui/core'
import { FormSystemOrganizationUrl } from '@island.is/api/schema'

interface TableRowProps {
  submitUrl: FormSystemOrganizationUrl
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

export const TableRow = ({ submitUrl, handleDelete }: TableRowProps) => {
  const { id, url } = submitUrl

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
