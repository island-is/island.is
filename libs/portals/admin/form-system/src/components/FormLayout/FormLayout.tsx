import { GridRow as Row, GridColumn as Column } from '@island.is/island-ui/core'
import { MainContentColumn } from './components/MainColumns'
import { NavbarColumn } from './components/NavbarColumn'

export const FormLayout = () => (
  <Row>
    <Column span="3/12">
      <NavbarColumn />
    </Column>
    <Column span="9/12">
      <MainContentColumn />
    </Column>
  </Row>
)
