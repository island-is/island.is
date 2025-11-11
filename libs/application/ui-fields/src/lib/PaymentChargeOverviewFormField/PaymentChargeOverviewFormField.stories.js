import { PaymentChargeOverviewFormField } from './PaymentChargeOverviewFormField'

const createMockApplication = (data = {}) => ({
  id: '123',
  assignees: [],
  state: data.state || 'draft',
  applicant: '111111-3000',
  typeId: data.typeId || 'ExampleForm',
  modified: new Date(),
  created: new Date(),
  attachments: {},
  answers: data.answers || {},
  externalData: {
    payment: {
      data: [
        {
          priceAmount: 100,
          chargeItemName: 'Payment code description',
          chargeItemCode: 'ipsum',
        },
        {
          priceAmount: 200,
          chargeItemName: 'Payment code description two',
          chargeItemCode: 'muspi',
        },
      ],
    },
  },
})

export default {
  title: 'Application System/PaymentChargeOverviewFormField',
  component: PaymentChargeOverviewFormField,
}

export const Default = {
  render: () => (
    <PaymentChargeOverviewFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        forPaymentLabel: 'label here',
        totalLabel: 'total label here',
        getSelectedChargeItems: (_) => [
          {
            chargeItemCode: 'ipsum',
          },
        ],
      }}
    />
  ),
}

export const Multiple = {
  render: () => (
    <PaymentChargeOverviewFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        forPaymentLabel: 'label here',
        totalLabel: 'total label here',
        quantityUnitLabel: 'stk.',
        getSelectedChargeItems: (_) => [
          {
            chargeItemCode: 'ipsum',
            extraLabel: 'ExtraLabel',
          },
          {
            chargeItemCode: 'muspi',
            chargeItemQuantity: 3,
          },
        ],
      }}
    />
  ),
}

export const WithCustomStrings = {
  render: () => (
    <PaymentChargeOverviewFormField
      application={createMockApplication()}
      field={{
        id: 'field.id',
        title: 'Field title',
        forPaymentLabel: 'label here',
        totalLabel: 'total label here',
        quantityUnitLabel: 'stk.',
        quantityLabel: 'custom quantity label',
        totalPerUnitLabel: 'custom total label',
        unitPriceLabel: 'custom unit price label',
        getSelectedChargeItems: (_) => [
          {
            chargeItemCode: 'ipsum',
            extraLabel: 'ExtraLabel',
          },
          {
            chargeItemCode: 'muspi',
            chargeItemQuantity: 3,
          },
        ],
      }}
    />
  ),
}
