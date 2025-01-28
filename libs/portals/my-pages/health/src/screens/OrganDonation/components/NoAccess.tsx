import { AlertMessage, GridColumn, GridRow } from '@island.is/island-ui/core'

export const NoAccess = ({ text }: { text: string }) => {
  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '12/12', '10/12']} paddingTop={2}>
        <AlertMessage type="info" title={text} />
      </GridColumn>
    </GridRow>
  )
}

export default NoAccess
