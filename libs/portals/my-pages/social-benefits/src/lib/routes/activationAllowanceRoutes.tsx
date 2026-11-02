import { PortalRoute } from '@island.is/portals/core'
import { BffUser } from '@island.is/shared/types'
import { m } from '@island.is/portals/my-pages/core'
import { ActivationAllowancePaths } from '../paths'
import MyData from '../../screens/unemployment-benefits/MyData/MyData'
import { ActivationAllowanceRoot } from '../../screens/activation-allowance/ActivationAllowanceRoot'
import Status from '../../screens/activation-allowance/Status/Status'

export const activationAllowanceRoutes = (
  _userInfo: BffUser,
): PortalRoute[] => [
  {
    name: m.socialInsuranceMaintenance,
    key: 'ActivationAllowance',
    path: ActivationAllowancePaths.Root,
    enabled: true,
    element: <ActivationAllowanceRoot />,
  },
  {
    name: m.myStatus,
    path: ActivationAllowancePaths.Status,
    key: 'ActivationAllowance',
    enabled: true,
    dynamic: true,
    element: <Status />,
  },
  {
    name: m.myData,
    key: 'ActivationAllowance',
    path: ActivationAllowancePaths.MyData,
    enabled: true,
    dynamic: true,
    element: <MyData />,
  },
]
