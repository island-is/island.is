import { GridColumn } from '@island.is/island-ui/core'
import { ModuleAlertBannerSection } from '../AlertMessage/ModuleAlertMessageSection'
import {
  IntroHeader as IntroHeaderBase,
  IntroHeaderProps,
} from '@island.is/portals/core'

export const IntroHeader = (props: Omit<IntroHeaderProps, 'children'>) => {
  const { marginBottom } = props

  return (
    <IntroHeaderBase
      {...props}
      marginBottom={marginBottom ? marginBottom : [0, 0, 2]}
    >
      <GridColumn span={['12/12', '12/12', '6/8']} order={3} paddingTop={4}>
        <ModuleAlertBannerSection />
      </GridColumn>
    </IntroHeaderBase>
  )
}

export default IntroHeader
