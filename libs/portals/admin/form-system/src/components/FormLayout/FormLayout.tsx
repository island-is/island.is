import { GridRow as Row, GridColumn as Column } from '@island.is/island-ui/core'
import { MainContentColumn } from './components/MainColumns'
import { NavbarColumn } from './components/NavbarColumn'
import { FormHeader } from '../../screens/Form/FormHeader'

export const FormLayout = () => (
  <>
    <FormHeader />
    <Row>
      <Column span="3/12">
        <NavbarColumn />
      </Column>
      <Column span="9/12">
        <MainContentColumn />
      </Column>
    </Row>
  </>
)
