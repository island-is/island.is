import {
  Box,
  Text,
  Button,
  ToggleSwitchCheckbox,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { FormSystemOrganizationUrl } from '@island.is/api/schema'

interface TableRowProps {
  url: FormSystemOrganizationUrl
}

export const TableRow = ({ url }: TableRowProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      paddingY={2}
      borderBottomWidth="standard"
      borderColor="blue200"
    >
      <Text>{url.url}</Text>
    </Box>
  )
}
