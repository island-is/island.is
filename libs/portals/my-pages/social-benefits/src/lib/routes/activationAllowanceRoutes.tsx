import { PortalRoute } from '@island.is/portals/core'
import { BffUser } from '@island.is/shared/types'
import { m, sharedMessages } from '../messages'
import { ActivationAllowancePaths } from '../paths'
import MyData from '../../screens/unemployment-benefits/MyData/MyData'
import { ActivationAllowanceRoot } from '../../screens/activation-allowance/ActivationAllowanceRoot'
import Status from '../../screens/activation-allowance/Status/Status'

export const activationAllowanceRoutes = (
  _userInfo: BffUser,
): PortalRoute[] => [
  {
    name: m.maintenance,
    path: ActivationAllowancePaths.Root,
    enabled: true,
    element: <ActivationAllowanceRoot />,
  },
  {
    name: sharedMessages.myStatus,
    path: ActivationAllowancePaths.Status,
    enabled: true,
    dynamic: true,
    element: <Status />,
  },
  {
    name: sharedMessages.myData,
    path: ActivationAllowancePaths.MyData,
    enabled: true,
    dynamic: true,
    element: <MyData />,
  },
]
