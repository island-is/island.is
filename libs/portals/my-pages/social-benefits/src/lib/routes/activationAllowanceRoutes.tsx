import { PortalRoute } from '@island.is/portals/core'
import { BffUser } from '@island.is/shared/types'
import { m, sharedMessages } from '../messages'
import { ActivationAllowancePaths } from '../paths'
import MyData from '../../screens/unemployment-benefits/MyData/MyData'

export const activationAllowanceRoutes = (userInfo: BffUser): PortalRoute[] => [
  {
    name: m.maintenance,
    key: 'ActivationAllowance',
    path: ActivationAllowancePaths.Root,
    enabled: true,
    element: null,
  },
  {
    name: sharedMessages.myStatus,
    key: 'ActivationAllowance',
    path: ActivationAllowancePaths.Status,
    enabled: true,
    dynamic: true,
    element: null,
  },
  {
    name: sharedMessages.myData,
    key: 'ActivationAllowance',
    path: ActivationAllowancePaths.MyData,
    enabled: true,
    dynamic: true,
    element: <MyData />,
  },
]
