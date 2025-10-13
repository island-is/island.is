import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { PortalModule } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { m } from './lib/messages'
import { PaymentsPaths } from './lib/paths'
import { paymentLoader } from './screens/Payment/Payment.loader'
import Payments from './screens/Payments/Payments'
import Payment from './screens/Payment/Payment'

const Root = lazy(() => import('./screens/Root/Root'))

export const paymentsModule: PortalModule = {
  name: m.payments,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.payments),
  routes: (props) => [
    {
      name: m.payments,
      path: PaymentsPaths.Root,
      element: <Root />,
      children: [
        {
          name: 'index',
          path: PaymentsPaths.Root,
          index: true,
          element: <Navigate to={PaymentsPaths.Payments} />,
        },
        {
          name: m.payments,
          path: PaymentsPaths.Payments,
          element: <Payments />,
        },
        {
          name: m.payment,
          path: PaymentsPaths.Payment,
          element: <Payment />,
          loader: paymentLoader(props),
          navHide: true,
        },
      ],
    },
  ],
}
