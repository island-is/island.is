export const generatePayment = (title: string): string => {
  const payment = {
    id: 'SampleFormId',
    title: title,
    mode: 'draft',
    type: 'FORM',
    renderLastScreenBackButton: true,
    renderLastScreenButton: true,
    children: [
      {
        id: 'section',
        title: 'Greiðsla',
        type: 'SECTION',
        children: [
          {
            id: 'multifield_payment_approval',
            title: 'Greiðsla',
            type: 'MULTI_FIELD',
            children: [
              {
                id: 'paymentChargeOverviewField',
                component: 'PaymentChargeOverviewFormField',
                type: 'PAYMENT_CHARGE_OVERVIEW',
                chargeItemCode: 'AY101',
              },
              {
                id: 'submit2',
                title: 'Greiðslu upplýsingar',
                type: 'SUBMIT',
                placement: 'footer',
                children: null,
                doesNotRequireAnswer: false,
                refetchApplicationAfterSubmit: true,
                component: 'SubmitFormField',
                actions: [
                  {
                    event: 'SUBMIT',
                    name: 'Staðfesta',
                    type: 'primary',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
  return JSON.stringify(payment)
}
