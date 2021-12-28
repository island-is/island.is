import { GridColumns, ResponsiveProp } from '@island.is/island-ui/core/types'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { MenuState } from '../../store/actions'

type ColumnState = 'default' | 'wide' | 'defaultClosed' | 'wideClosed'
type responsiveGridColumns = Record<
  ColumnState,
  {
    span: ResponsiveProp<GridColumns>
    offset: ResponsiveProp<GridColumns>
  }
>

export const gridlayout: responsiveGridColumns = {
  default: {
    span: ['12/12', '12/12', '12/12', '8/12', '8/12'],
    offset: ['0', '0', '0', '3/12', '3/12'],
  },
  wide: {
    span: ['12/12', '12/12', '12/12', '8/12', '9/12'],
    offset: ['0', '0', '0', '3/12', '2/12'],
  },
  defaultClosed: {
    span: ['12/12', '12/12', '12/12', '9/12', '9/12'],
    offset: ['0', '0', '0', '2/12', '2/12'],
  },
  wideClosed: {
    span: ['12/12', '12/12', '12/12', '10/12', '10/12'],
    offset: ['0', '0', '0', '1/12', '1/12'],
  },
}

export const wideScreens = [
  ServicePortalPath.FinanceRoot,
  ServicePortalPath.FinanceStatus,
  ServicePortalPath.FinanceTransactions,
  ServicePortalPath.FinanceVehicles,
  ServicePortalPath.FinanceBills,
  ServicePortalPath.FinanceEmployeeClaims,
  ServicePortalPath.FinanceExternal,
  ServicePortalPath.FinanceLocalTax,
  ServicePortalPath.FinancePayments,
]

export type GridLayout = {
  span: ResponsiveProp<GridColumns>
  offset: ResponsiveProp<GridColumns>
}

export const getLayout = (
  pathname: string,
  sidebarState: MenuState,
): GridLayout => {
  const hasWideLayout = wideScreens.includes(pathname as ServicePortalPath)
  const sidebarCollapsed = sidebarState === 'closed'

  type LayoutType = keyof typeof gridlayout
  const layoutType: LayoutType =
    sidebarCollapsed && hasWideLayout
      ? 'wideClosed'
      : sidebarCollapsed && !hasWideLayout
      ? 'defaultClosed'
      : !sidebarCollapsed && hasWideLayout
      ? 'wide'
      : 'default'

  return gridlayout[layoutType]
}
