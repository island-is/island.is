import { defineMessages } from 'react-intl'

export const paymentArrangement = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.sem.application:paymentArrangement.general.sectionTitle',
      defaultMessage: 'Greiðslutilhögun',
      description: 'Section title of payment arrangement screen',
    },
    title: {
      id: 'aosh.sem.application:paymentArrangement.general.title',
      defaultMessage: 'Greiðslutilhögun',
      description: 'Title of conclusion screen',
    },
  }),
  labels: defineMessages({
    registerForWhich: {
      id: 'aosh.sem.application:paymentArrangement.labels.registerForWhichDescription',
      defaultMessage:
        'Vinsamlegast tilgreindu hvort þú sért að skrá fyrir hönd fyrirtækis eða sem einstaklingur',
      description: 'Register for which label on payment arrangement screen',
    },
    individual: {
      id: 'aosh.sem.application:paymentArrangement.labels.individual',
      defaultMessage: 'Einstaklingur',
      description: 'Individual label on conclusion screen',
    },
    company: {
      id: 'aosh.sem.application:paymentArrangement.labels.company',
      defaultMessage: 'Fyrirtæki',
      description: 'Company label on conclusion screen',
    },
    agreementCheckbox: {
      id: 'aosh.sem.application:paymentArrangement.labels.agreementCheckbox#markdown',
      defaultMessage:
        'Ég hef kynnt mér [greiðslu- og viðskiptaskilmála](https://island.is/s/vinnueftirlitid/gjaldskra#greidslu-og-vidskiptaskilmalar) Vinnueftirlitsins',
      description: 'Agreement checkbox label on conclusion screen',
    },
    email: {
      id: 'aosh.sem.application:paymentArrangement.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email label on conclusion screen',
    },
    phonenumber: {
      id: 'aosh.sem.application:paymentArrangement.labels.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phonenumber label on conclusion screen',
    },
    paymentOptions: {
      id: 'aosh.sem.application:paymentArrangement.labels.paymentOptions',
      defaultMessage: 'Vinsamlegast veldu þann möguleika sem á við',
      description: 'Payment options label on conclusion screen',
    },
    cashOnDelivery: {
      id: 'aosh.sem.application:paymentArrangement.labels.cashOnDelivery',
      defaultMessage: 'Staðgreiðsla',
      description: 'Cash on delivery label on conclusion screen',
    },
    putIntoAccount: {
      id: 'aosh.sem.application:paymentArrangement.labels.putIntoAccount',
      defaultMessage: 'Setja í reikning',
      description: 'Put into account label on conclusion screen',
    },
    companyInfo: {
      id: 'aosh.sem.application:paymentArrangement.labels.companyInfo',
      defaultMessage: 'Upplýsingar um fyrirtæki',
      description: 'Company info label on conclusion screen',
    },
    companyTitle: {
      id: 'aosh.sem.application:paymentArrangement.labels.companyTitle',
      defaultMessage: 'Fyrirtæki',
      description: 'Company title label on conclusion screen',
    },
    companySSN: {
      id: 'aosh.sem.application:paymentArrangement.labels.companySSN',
      defaultMessage: 'Kennitala fyrirtækis',
      description: 'Company SSN label on conclusion screen',
    },
    companyName: {
      id: 'aosh.sem.application:paymentArrangement.labels.companyName',
      defaultMessage: 'Fyrirtæki',
      description: 'Company name label on conclusion screen',
    },
    contactEmail: {
      id: 'aosh.sem.application:paymentArrangement.labels.contactEmail',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Contact email label on conclusion screen',
    },
    contactPhone: {
      id: 'aosh.sem.application:paymentArrangement.labels.contactPhone',
      defaultMessage: 'Símanúmer tengiliðs',
      description: 'Contact phonenumber label on conclusion screen',
    },
    contactOrganizationAlert: {
      id: 'aosh.sem.application:paymentArrangement.labels.contactOrganizationAlert',
      defaultMessage:
        'Ekki er hægt að skrá námskeið í reikning. Vinsamlegast hafðu samband við Vinnueftirlitið.',
      description: 'Contact organization alert label on conclusion screen',
    },
    webServiceFailure: {
      id: 'aosh.sem.application:paymentArrangement.labels.webServiceFailure',
      defaultMessage:
        'Vefþjónustan skilaði villu. Reyndu aftur síðar. Ef vandamálið varir, vinsamlegast hafðu samband við Vinnueftirlitið.',
      description: 'Web service failed to respond',
    },
    explanation: {
      id: 'aosh.sem.application:paymentArrangement.labels.explanation',
      defaultMessage: 'Skýring',
      description: 'Explanation label on conclusion screen',
    },
    explanationPlaceholder: {
      id: 'aosh.sem.application:paymentArrangement.labels.explanationPlaceholder',
      defaultMessage: 'Upplýsingar sem eiga að koma fram á reikningi',
      description: 'Explanation placeholder on conclusion screen',
    },
  }),
}
