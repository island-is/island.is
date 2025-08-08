import {
  Box,
  GridColumn,
  GridRow,
  Text,
  Checkbox,
  Input,
} from '@island.is/island-ui/core'

export const ZendeskSettings = () => {
  return (
    <Box marginTop={2}>
      <Text variant="h4">Zendesk stillingar</Text>
      <GridRow marginTop={2}>
        <GridColumn span="5/10">
          <Checkbox label="body"></Checkbox>
        </GridColumn>
        <GridColumn span="5/10">
          <Checkbox label="reitur"></Checkbox>
          <Box marginTop={2}>
            <Input name="name" placeholder="Sláðu inn Zendesk field id"></Input>
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
