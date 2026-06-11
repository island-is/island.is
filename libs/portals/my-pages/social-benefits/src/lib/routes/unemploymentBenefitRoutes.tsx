import { PortalRoute } from '@island.is/portals/core'
import { BffUser } from '@island.is/shared/types'
import { m, sharedMessages } from '../messages'
import { UnemploymentBenefitsPaths } from '../paths'
import Status from '../../screens/unemployment-benefits/Status/Status'
import MyData from '../../screens/unemployment-benefits/MyData/MyData'
import { UnemploymentBenefitsRoot } from '../../screens/unemployment-benefits/UnemploymentBenefitsRoot'

export const unemploymentBenefitsRoutes = (
  userInfo: BffUser,
): PortalRoute[] => [
  {
    name: m.maintenance,
    key: 'UnemploymentBenefits',
    path: UnemploymentBenefitsPaths.Root,
    enabled: true,
    element: <UnemploymentBenefitsRoot />,
  },
  {
    name: sharedMessages.myStatus,
    key: 'UnemploymentBenefits',
    path: UnemploymentBenefitsPaths.Status,
    enabled: true,
    dynamic: true,
    element: <Status />,
  },
  {
    name: sharedMessages.myData,
    key: 'UnemploymentBenefits',
    path: UnemploymentBenefitsPaths.MyData,
    enabled: true,
    dynamic: true,
    element: <MyData />,
  },
]
