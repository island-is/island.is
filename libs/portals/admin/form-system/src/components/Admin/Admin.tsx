import { Box, GridColumn, GridRow } from "@island.is/island-ui/core"
import { Permission } from "./components/Permission"
import { AdminHeader } from "./components/AdminHeader/AdminHeader"

export const Admin = () => {

  return (
    <Box marginTop={4}>
      <AdminHeader />
      <GridColumn span='12/12'>
        <GridRow>
          <GridColumn span='4/12'>
            <Box>
              <Permission type='certificate' />
            </Box>
          </GridColumn>
          <GridColumn span='4/12'>
            <Box>
              <Permission type="list" />
            </Box>
          </GridColumn>
          <GridColumn span='4/12'>
            <Box>
              <Permission type="field" />
            </Box>
          </GridColumn>
        </GridRow>
      </GridColumn>
    </Box>

  )
}