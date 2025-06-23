import { defineMessages } from 'react-intl'

export const paymentArrangement = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.pe.application:paymentArrangement.general.sectionTitle',
      defaultMessage: 'Greiðslutilhögun',
      description: 'Section title of payment arrangement screen',
    },
    title: {
      id: 'aosh.pe.application:paymentArrangement.general.title',
      defaultMessage: 'Greiðslutilhögun',
      description: 'Title of conclusion screen',
    },
  }),
  labels: defineMessages({
    registerForWhich: {
      id: 'aosh.pe.application:paymentArrangement.labels.registerForWhichDescription',
      defaultMessage:
        'Vinsamlegast tilgreindu hvort þú sért að skrá fyrir hönd fyrirtækis eða sem einstaklingur',
      description: 'Register for which label on payment arrangement screen',
    },
    individual: {
      id: 'aosh.pe.application:paymentArrangement.labels.individual',
      defaultMessage: 'Einstaklingur',
      description: 'Individual label on conclusion screen',
    },
    company: {
      id: 'aosh.pe.application:paymentArrangement.labels.company',
      defaultMessage: 'Fyrirtæki',
      description: 'Company label on conclusion screen',
    },
    aggreementCheckbox: {
      id: 'aosh.pe.application:paymentArrangement.labels.aggreementCheckbox#markdown',
      defaultMessage:
        'Ég hef kynnt mér [greiðslu- og viðskiptaskilmála](https://island.is/s/vinnueftirlitid/gjaldskra#greidslu-og-vidskiptaskilmalar) Vinnueftirlitsins',
      description: 'Aggreement checkbox label on paymentArrangement screen',
    },
    email: {
      id: 'aosh.pe.application:paymentArrangement.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email label on conclusion screen',
    },
    phonenumber: {
      id: 'aosh.pe.application:paymentArrangement.labels.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phonenumber label on conclusion screen',
    },
    changeInfo: {
      id: 'aosh.pe.application:paymentArrangement.labels.changeInfo',
      defaultMessage: 'Breyta upplýsingum á mínum síðum',
      description: 'Change information label on conclusion screen',
    },
    paymentOptions: {
      id: 'aosh.pe.application:paymentArrangement.labels.paymentOptions',
      defaultMessage: 'Vinsamlegast veldu þann möguleika sem á við',
      description: 'Payment options label on conclusion screen',
    },
    cashOnDelivery: {
      id: 'aosh.pe.application:paymentArrangement.labels.cashOnDelivery',
      defaultMessage: 'Staðgreiðsla',
      description: 'Cash on delivery label on conclusion screen',
    },
    putIntoAccount: {
      id: 'aosh.pe.application:paymentArrangement.labels.putIntoAccount',
      defaultMessage: 'Setja í reikning',
      description: 'Put into account label on conclusion screen',
    },
    companyInfo: {
      id: 'aosh.pe.application:paymentArrangement.labels.companyInfo',
      defaultMessage: 'Upplýsingar um fyrirtæki',
      description: 'Company info label on conclusion screen',
    },
    companyTitle: {
      id: 'aosh.pe.application:paymentArrangement.labels.companyTitle',
      defaultMessage: 'Fyrirtæki',
      description: 'Company title label on conclusion screen',
    },
    companySSN: {
      id: 'aosh.pe.application:paymentArrangement.labels.companySSN',
      defaultMessage: 'Kennitala fyrirtækis',
      description: 'Company SSN label on conclusion screen',
    },
    companyName: {
      id: 'aosh.pe.application:paymentArrangement.labels.companyName',
      defaultMessage: 'Fyrirtæki',
      description: 'Company name label on conclusion screen',
    },
    contactEmail: {
      id: 'aosh.pe.application:paymentArrangement.labels.contactEmail',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Contact email label on conclusion screen',
    },
    contactPhone: {
      id: 'aosh.pe.application:paymentArrangement.labels.contactPhone',
      defaultMessage: 'Símanúmer tengiliðs',
      description: 'Contact phonenumber label on conclusion screen',
    },
    contactOrganizationAlert: {
      id: 'aosh.pe.application:paymentArrangement.labels.contactOrganizationAlert',
      defaultMessage:
        'Ekki er hægt að skrá námskeið í reikning. Vinsamlegast hafðu samband við Vinnueftirlitið.',
      description: 'Contact organization alert label on conclusion screen',
    },
    explanationWithPayment: {
      id: 'aosh.pe.application:paymentArrangement.labels.explanationWithPayment',
      defaultMessage: 'Skýring með greiðslu',
      description: 'Explanation with payment label on conclusion screen',
    },
    explanation: {
      id: 'aosh.pe.application:paymentArrangement.labels.explanation',
      defaultMessage: 'Skýring',
      description: 'Explanation label on conclusion screen',
    },
    webServiceFailure: {
      id: 'aosh.sem.application:paymentArrangement.labels.webServiceFailure',
      defaultMessage:
        'Vefþjónustan skilaði villu. Reyndu aftur síðar. Ef vandamálið varir, vinsamlegast hafðu samband við Vinnueftirlitið.',
      description: 'Web service failed to respond',
    },
  }),
}
