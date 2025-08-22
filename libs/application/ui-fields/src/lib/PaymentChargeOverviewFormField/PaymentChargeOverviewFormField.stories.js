import { dedent } from 'ts-dedent'

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
          chargeItemName: 'lorem',
          chargeItemCode: 'ipsum',
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

  name: 'Default',
}
