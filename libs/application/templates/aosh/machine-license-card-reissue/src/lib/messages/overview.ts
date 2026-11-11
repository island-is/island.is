import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlcr.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    pageTitle: {
      id: 'aosh.mlcr.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Overview page title',
    },
    description: {
      id: 'aosh.mlcr.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Overview page description',
    },
    print: {
      id: 'aosh.mlcr.application:overview.general.print',
      defaultMessage: 'Prenta yfirlit',
      description: 'Print button aria label',
    },
    submit: {
      id: 'aosh.mlcr.application:overview.general.submit',
      defaultMessage: 'Áfram',
      description: 'Submit button label',
    },
  }),
  applicant: defineMessages({
    title: {
      id: 'aosh.mlcr.application:overview.applicant.title',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant overview title',
    },
    name: {
      id: 'aosh.mlcr.application:overview.applicant.name',
      defaultMessage: 'Nafn: {value}',
      description: 'Applicant name in overview',
    },
    nationalId: {
      id: 'aosh.mlcr.application:overview.applicant.nationalId',
      defaultMessage: 'Kennitala: {value}',
      description: 'Applicant national id in overview',
    },
    address: {
      id: 'aosh.mlcr.application:overview.applicant.address',
      defaultMessage: 'Lögheimili: {value}',
      description: 'Applicant address in overview',
    },
    email: {
      id: 'aosh.mlcr.application:overview.applicant.email',
      defaultMessage: 'Netfang: {value}',
      description: 'Applicant email in overview',
    },
    phone: {
      id: 'aosh.mlcr.application:overview.applicant.phone',
      defaultMessage: 'Símanúmer: {value}',
      description: 'Applicant phone number in overview',
    },
  }),
  cardDelivery: defineMessages({
    title: {
      id: 'aosh.mlcr.application:overview.cardDelivery.title',
      defaultMessage: 'Afhendingarmáti',
      description: 'Card delivery overview title',
    },
    currentAddress: {
      id: 'aosh.mlcr.application:overview.cardDelivery.currentAddress',
      defaultMessage: 'Sent á lögheimili ({address})',
      description: 'Send to legal domicile in overview',
    },
    otherAddress: {
      id: 'aosh.mlcr.application:overview.cardDelivery.otherAddress',
      defaultMessage: 'Sent á {address}',
      description: 'Send to other address in overview',
    },
    recipient: {
      id: 'aosh.mlcr.application:overview.cardDelivery.recipient',
      defaultMessage: 'Viðtakandi: {value}',
      description: 'Recipient in overview',
    },
  }),
  labels: defineMessages({
    agreementCheckbox: {
      id: 'aosh.mlcr.application:overview.labels.agreementCheckbox#markdown',
      defaultMessage:
        'Ég hef kynnt mér [greiðslu- og viðskiptaskilmála](https://island.is/s/vinnueftirlitid/gjaldskra#greidslu-og-vidskiptaskilmalar) Vinnueftirlitsins',
      description: 'Agreement checkbox label on overview screen',
    },
  }),
}
