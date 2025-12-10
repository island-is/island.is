import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from './messages'
import { PaymentsPaths } from './paths'

export const paymentsNavigation: PortalNavigationItem = {
  name: m.payments,
  path: PaymentsPaths.Root,
  icon: {
    icon: 'settings',
  },
  description: m.paymentsDescription,
  navHide: true,
  children: [
    {
      name: m.payments,
      path: PaymentsPaths.Payments,
      activeIfExact: true,
      navHide: true,
      children: [
        {
          name: m.payment,
          path: PaymentsPaths.Payment,
          activeIfExact: true,
          navHide: true,
        },
      ],
    },
  ],
}
