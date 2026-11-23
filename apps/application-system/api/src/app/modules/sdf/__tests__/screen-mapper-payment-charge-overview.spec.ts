import type { MultiFieldScreen } from '@island.is/application/screen-compiler'
import {
  Application,
  FieldTypes,
  FormItemTypes,
} from '@island.is/application/types'

import { FormTextResolver } from '../i18n-resolver.service'
import { mapScreenToComponents } from '../screen-mapper'

const stubResolver = {
  resolve: (v: unknown) =>
    typeof v === 'string' ? v : v != null ? String(v) : '',
  currentLocale: 'is',
} as unknown as FormTextResolver

const buildScreen = (
  getSelectedChargeItems?: (application: unknown) => unknown[],
) =>
  ({
    type: FormItemTypes.MULTI_FIELD,
    id: 'page1',
    title: 'Payment',
    sectionIndex: 0,
    subSectionIndex: 0,
    isNavigable: true,
    children: [
      {
        id: 'charges',
        type: FieldTypes.PAYMENT_CHARGE_OVERVIEW,
        component: 'PaymentChargeOverviewFormField',
        title: 'charges',
        isNavigable: true,
        sectionIndex: 0,
        subSectionIndex: 0,
        forPaymentLabel: 'For payment',
        totalLabel: 'Total',
        getSelectedChargeItems,
      },
    ],
  } as unknown as MultiFieldScreen)

const application = {
  externalData: {
    payment: {
      data: [
        { chargeItemCode: 'A', chargeItemName: 'Fee A', priceAmount: 1500 },
        { chargeItemCode: 'B', chargeItemName: 'Fee B', priceAmount: 1234567 },
      ],
    },
  },
} as unknown as Application

describe('mapScreenToComponents — payment charge overview', () => {
  it('formats each line and the total as króna with a dot as the thousands separator', () => {
    const [component] = mapScreenToComponents(
      buildScreen(() => [
        { chargeItemCode: 'A', chargeItemQuantity: 2 },
        { chargeItemCode: 'B' },
      ]),
      stubResolver,
      application,
    )

    expect(component.paymentChargeHeading).toBe('For payment')
    expect(component.paymentChargeTotalLabel).toBe('Total')
    expect(component.paymentChargeLines).toEqual([
      { description: 'Fee A', quantity: '2', amount: '3.000 kr.' },
      { description: 'Fee B', quantity: '1', amount: '1.234.567 kr.' },
    ])
    expect(component.paymentChargeTotalAmount).toBe('1.237.567 kr.')
  })

  it('shows a zero total and no lines when the field selects no charge items', () => {
    const [component] = mapScreenToComponents(
      buildScreen(),
      stubResolver,
      application,
    )

    expect(component.paymentChargeLines).toEqual([])
    expect(component.paymentChargeTotalAmount).toBe('0 kr.')
  })
})
