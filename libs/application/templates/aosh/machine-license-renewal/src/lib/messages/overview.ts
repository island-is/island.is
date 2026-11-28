import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlr.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    title: {
      id: 'aosh.mlr.application:overview.general.title',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview screen',
    },
    description: {
      id: 'aosh.mlr.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Description of overview screen',
    },
  }),
  labels: defineMessages({
    applicant: {
      id: 'aosh.mlr.application:overview.labels.applicant',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant overview title',
    },
    name: {
      id: 'aosh.mlr.application:overview.labels.name',
      defaultMessage: 'Nafn: {value}',
      description: 'Name in overview',
    },
    nationalId: {
      id: 'aosh.mlr.application:overview.labels.nationalId',
      defaultMessage: 'Kennitala: {value}',
      description: 'National id in overview',
    },
    legalDomicile: {
      id: 'aosh.mlr.application:overview.labels.legalDomicile',
      defaultMessage: 'Lögheimili: {value}',
      description: 'Legal domicile in overview',
    },
    email: {
      id: 'aosh.mlr.application:overview.labels.email',
      defaultMessage: 'Netfang: {value}',
      description: 'Email in overview',
    },
    phoneNumber: {
      id: 'aosh.mlr.application:overview.labels.phoneNumber',
      defaultMessage: 'Símanúmer: {value}',
      description: 'Phone number in overview',
    },
    rights: {
      id: 'aosh.mlr.application:overview.labels.rights',
      defaultMessage: 'Vinnuvélaréttindi sem verið er að endurnýja',
      description: 'Rights overview title',
    },
    licenseNumber: {
      id: 'aosh.mlr.application:overview.labels.licenseNumber',
      defaultMessage: 'Skírteinisnúmer: {value}',
      description: 'License number in overview',
    },
    medicalCertificate: {
      id: 'aosh.mlr.application:overview.labels.medicalCertificate',
      defaultMessage: 'Læknisvottorð',
      description: 'Medical certificate overview title',
    },
    plasticCard: {
      id: 'aosh.mlr.application:overview.labels.plasticCard',
      defaultMessage: 'Á að senda þér skírteinið sem plastkort?',
      description: 'Plastic card overview title',
    },
    deliveryMethod: {
      id: 'aosh.mlr.application:overview.labels.deliveryMethod',
      defaultMessage: 'Afhendingarmáti',
      description: 'Delivery method overview title',
    },
    recipient: {
      id: 'aosh.mlr.application:overview.labels.recipient',
      defaultMessage: 'Viðtakandi: {value}',
      description: 'Recipient in overview',
    },
    agreement: {
      id: 'aosh.mlr.application:overview.labels.agreement#markdown',
      defaultMessage:
        'Ég hef kynnt mér [greiðslu- og viðskiptaskilmála](https://island.is/s/vinnueftirlitid/gjaldskra#greidslu-og-vidskiptaskilmalar) Vinnueftirlitsins',
      description: 'Agreement checkbox label',
    },
  }),
}
