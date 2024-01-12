import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const socialInsuranceAdministrationMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'sia.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Social Insurance Administration',
    },
    formTitle: {
      id: 'sia.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'sia.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'sia.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    alertTitle: {
      id: 'sia.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'sia.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'sia.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    checkboxProvider: {
      id: 'sia.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
    contactInfoTitle: {
      id: 'sia.application:prerequisites.contact.info.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    skraInformationTitle: {
      id: 'sia.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.description',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar á mínar síður hjá Tryggingastofnun.',
      description: 'english translation',
    },
    socialInsuranceAdministrationDataDescription: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.data.description',
      defaultMessage:
        'Tryggingastofnun sækir nauðsynlegar upplýsingar til úrvinnslu umsókna, varðandi tekjur og aðrar ástæður.',
      description: 'english translation',
    },
    socialInsuranceAdministrationPrivacyTitle: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.privacy.title',
      defaultMessage: 'Gagnaöflun og meðferð persónuupplýsinga',
      description: 'english translation',
    },
    socialInsuranceAdministrationPrivacyDescription: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.privacy.description#markdown',
      defaultMessage:
        'Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna hér (https://www.tr.is/tryggingastofnun/personuvernd). Ef tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.',
      description: 'english translation',
    },
    startApplication: {
      id: 'sia.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'sia.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'sia.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    subSectionDescription: {
      id: 'sia.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt frá Tryggingastofnun. Ef símanúmerið er ekki rétt eða vantar getur þú skráð það hérna fyrir neðan.',
      description:
        'Email address and phone number is retrieved from the Social Insurance Administration. If the phone number is incorrect or missing you can register the correct one below.',
    },
    applicantEmail: {
      id: 'sia.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'sia.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
  }),

  period: defineMessages({
    title: {
      id: 'sia.application:period.title',
      defaultMessage: 'Tímabil',
      description: 'Period',
    },
    year: {
      id: 'sia.application:period.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    yearDefaultText: {
      id: 'sia.application:period.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    month: {
      id: 'sia.application:period.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    monthDefaultText: {
      id: 'sia.application:period.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
  }),

  months: defineMessages({
    january: {
      id: 'sia.application:months.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'sia.application:months.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'sia.application:months.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'sia.application:months.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'sia.application:months.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'sia.application:months.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'sia.application:months.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'sia.application:months.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'sia.application:months.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'sia.application:months.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'sia.application:months.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'sia.application:months.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),

  payment: defineMessages({
    title: {
      id: 'sia.application:payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    alertMessage: {
      id: 'sia.application:payment.alert.message',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inn á bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inn á þann reikning.',
      description:
        'All payments from the Social Insurance Administration are paid into the below bank account. Should you change your account details all your payments from the Social Insurance Administration will be paid into that account.',
    },
    alertMessageForeign: {
      id: 'sia.application:payment.alert.message.foreign#markdown',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inn á bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inn á þann reikning. \n\nMikilvægt er að bankaupplýsingarnar séu réttar. Gott er að hafa samband við viðskiptabanka sinn til að ganga úr skugga um að upplýsingarnar séu réttar ásamt því að fá upplýsingar um IBAN-númer og SWIFT-númer. \n\nVinsamlegast athugið að greiðslur inn á erlenda reikninga geta tekið 3-4 daga. Banki sem sér um millifærslu leggur á þjónustugjald fyrir millifærslunni.',
      description:
        'All payments from the Social Insurance Administration are paid into the below bank account. Should you change your account details, all your payments from the Social Insurance Administration will be paid into that account. \n\nIt is important to ensure that that the bank details are correct. We advise that applicants contact their commercial bank to make sure all bank details are correct, as well as confirming details regarding IBAN and SWIFT numbers. \n\nPlease note that payments made into foreign accounts can take 3-4 days. The bank that handles the transaction will charge a service fee.',
    },
    bank: {
      id: 'sia.application:payment.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    icelandicBankAccount: {
      id: 'sia.application:payment.icelandic.bank.account',
      defaultMessage: 'Íslenskur reikningur',
      description: 'Icelandic account',
    },
    foreignBankAccount: {
      id: 'sia.application:payment.foreign.bank.account',
      defaultMessage: 'Erlendur reikningur',
      description: 'Foreign account',
    },
    iban: {
      id: 'sia.application:payment.iban',
      defaultMessage: 'IBAN',
      description: 'IBAN',
    },
    swift: {
      id: 'sia.application:payment.swift',
      defaultMessage: 'SWIFT',
      description: 'SWIFT',
    },
    bankName: {
      id: 'sia.application:payment.bank.name',
      defaultMessage: 'Heiti banka',
      description: 'Bank name',
    },
    bankAddress: {
      id: 'sia.application:payment.bank.address',
      defaultMessage: 'Heimili banka',
      description: 'Bank address',
    },
    currency: {
      id: 'sia.application:payment.currency',
      defaultMessage: 'Mynt',
      description: 'Currency',
    },
    selectCurrency: {
      id: 'sia.application:payment.select.currency',
      defaultMessage: 'Veldu mynt',
      description: 'Select currency',
    },
    personalAllowance: {
      id: 'sia.application:payment.personal.allowance',
      defaultMessage: 'Vilt þú nýta persónuafsláttinn þinn?',
      description: 'Would you like to use your personal tax-free allowance?',
    },
    personalAllowancePercentage: {
      id: 'sia.application:payment.personal.allowance.percentage',
      defaultMessage: 'Skráðu tölu á bilinu 1-100',
      description: 'Enter a number between 1 and 100',
    },
    alertSpouseAllowance: {
      id: 'sia.application:payment.alert.spouse.allowance',
      defaultMessage:
        'Ef þú vilt nýta persónuafslátt maka þíns þá verður makinn þinn að fara inná mínar síður hjá Tryggingastofnun og veita leyfi.',
      description:
        "If you wish to use your spouse's personal discount, your spouse must log into My Pages at the Social Insurance Administration and grant their permission.",
    },
    taxLevel: {
      id: 'sia.application:payment.tax.level',
      defaultMessage: 'Skattþrep',
      description: 'Tax bracket',
    },
    taxIncomeLevel: {
      id: 'sia.application:payment.tax.first.level',
      defaultMessage:
        'Ég vil að staðgreiðslan sé reiknuð út frá tekjuáætlun minni',
      description:
        'I wish for the withholding tax to be calculated based on my income estimate',
    },
    taxFirstLevel: {
      id: 'sia.application:payment.tax.second.level',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 1 í útreikningum staðgreiðslu (31,45% af tekjum: 0 - 409.986 kr.)',
      description:
        'I wish for tax bracket 1 to be considered in my withholding calculations (31.45% of income: 0 - 409,986 ISK)',
    },
    taxSecondLevel: {
      id: 'sia.application:payment.tax.third.level',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 2 í útreikningum staðgreiðslu (37,95% af tekjum: 409.986 - 1.151.012 kr.)',
      description:
        'I wish for tax bracket 2 to be considered in my withholding calculations (37.95% of income: ISK 409,986 - ISK 1,151,012)',
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'sia.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    attachmentButton: {
      id: 'sia.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'sia.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'sia.application:fileUpload.attachment.description',
      defaultMessage:
        'Tekið er við skjölum með endingu: .pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
      description:
        'The following document types are accepted: .pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
    },
    attachmentMaxSizeError: {
      id: 'sia.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'sia.application:fileUpload.additionalFile.title',
      defaultMessage: 'Fylgiskjöl viðbótargögn',
      description: 'Additional attachments',
    },
    additionalDocumentsEditSubmit: {
      id: 'sia.application:fileUpload.additionalDocumentsEditSubmit',
      defaultMessage: 'Senda inn',
      description: 'Submit',
    },
    additionalDocumentRequiredTitle: {
      id: 'sia.application:fileUpload.additionalDocumentRequired.title',
      defaultMessage: 'Viðbótargagna krafist',
      description: 'Additional documents required',
    },
    additionalDocumentRequiredDescription: {
      id: 'sia.application:fileUpload.additionalDocumentRequired.description#markdown',
      defaultMessage:
        'Vinsamlegast hlaðið upp viðbótargögnum til Tryggingastofnunar. Ef þú ert ekki viss hvaða viðbótagögn það eru geturu séð það í [stafræna pósthólfinu þínu](https://island.is/minarsidur/postholf). Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Please submit additional documents for the Social Insurance Administration. If you are not sure which additional documents you should submit, you can see it in [your inbox on My Pages](https://island.is/minarsidur/postholf). Note that the document must be in .pdf format.',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'sia.application:additionalInfo.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional Information',
    },
    commentSection: {
      id: 'sia.application:additionalInfo.comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    commentDescription: {
      id: 'sia.application:additionalInfo.comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'Please leave any additional comments below.',
    },
    commentPlaceholder: {
      id: 'sia.application:additionalInfo.comment.placeholder',
      defaultMessage: 'Skrifaðu athugasemd hér',
      description: 'Your comment',
    },
  }),

  confirm: defineMessages({
    overviewTitle: {
      id: 'sia.application:confirm.overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    overviewDescription: {
      id: 'sia.application:confirm.overview.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    additionalDocumentsAttachment: {
      id: 'sia.application:confirm.additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description:
        'Additional documents for the Social Insurance Administration',
    },
    name: {
      id: 'sia.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'sia.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Icelandic ID number',
    },
    submitButton: {
      id: 'sia.application:confirm.submit.button',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    editButton: {
      id: 'sia.application:confirm.edit.button',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    cancelButton: {
      id: 'sia.application:confirm.cancel.button',
      defaultMessage: 'Hætta við',
      description: 'Cancel',
    },
    personalAllowance: {
      id: 'sia.application:confirm.personal.allowance',
      defaultMessage: 'Persónuafsláttur',
      description: 'Personal tax-free allowance',
    },
    ratio: {
      id: 'sia.application:confirm.ratio',
      defaultMessage: 'Hlutall',
      description: 'Ratio',
    },
  }),

  conclusionScreen: defineMessages({
    section: {
      id: 'sia.application:conclusionScreen.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    receivedAwaitingIncomePlanTitle: {
      id: 'sia.application:conclusionScreen.received.awaiting.income.plan.title',
      defaultMessage: 'Umsókn móttekin og bíður tekjuáætlunar',
      description: 'Application received and awaiting income estimate',
    },
    receivedTitle: {
      id: 'sia.application:conclusionScreen.received.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Application received',
    },
    incomePlanAlertMessage: {
      id: 'sia.application:conclusionScreen.income.plan.alert.message',
      defaultMessage:
        'Athugið að ef þú hefur ekki skilað inn tekjuáætlun er mikilvægt að gera það svo hægt sé að afgreiða umsóknina. Þú getur skilað inn tekjuáætlun með því að ýta á takkann hér fyrir neðan.',
      description:
        'Attention, if you have not submitted an income estimate, you must do so for your application to be processed. You can submit an income estimate by pression the button below.',
    },
    alertTitle: {
      id: 'sia.application:conclusionScreen.alert.title',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Your application has been received',
    },
    incomePlanCardLabel: {
      id: 'sia.application:conclusionScreen.income.plan.card.label',
      defaultMessage: 'Skila inn tekjuáætlun',
      description: 'Submit income estimate',
    },
    incomePlanCardText: {
      id: 'sia.application:conclusionScreen.income.plan.card.text',
      defaultMessage:
        'Mikilvægt er að skila inn tekjuáætlun sem fyrst svo hægt sé að afgreiða umsóknina og búa til greiðsluáætlun.',
      description:
        'It is important to submit an income estimate as soon as possible so that the application can be processed and a payment plan can be created.',
    },
  }),
}

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'sia.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  bank: {
    id: 'sia.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  period: {
    id: 'sia.application:error.period',
    defaultMessage: 'Ógildur mánuður.',
    description: 'Invalid month.',
  },
  noEmailFound: {
    id: 'sia.application:error.no.email.found.title',
    defaultMessage: 'Ekkert netfang skráð',
    description: 'english translation',
  },
  noEmailFoundDescription: {
    id: 'sia.application:error.no.email.found.description#markdown',
    defaultMessage:
      'Þú ert ekki með skráð netfang hjá Tryggingastofnun. Vinsamlegast skráðu það [hér](https://minarsidur.tr.is/min-sida) og komdu svo aftur til að sækja um.',
    description: 'english translation',
  },
  iban: {
    id: 'sia.application:error.iban',
    defaultMessage: 'Ógilt IBAN',
    description: 'Invalid IBAN',
  },
  swift: {
    id: 'sia.application:error.swift',
    defaultMessage: 'Ógilt SWIFT',
    description: 'Invalid SWIFT',
  },
  requireAttachment: {
    id: 'sia.application:required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'You must upload an attachment to continue.',
  },
  personalAllowance: {
    id: 'sia.application:personal.allowance',
    defaultMessage: 'Persónuafsláttur verður að vera milli 1 og 100',
    description: 'Personal tax-free allowance must be between 1 and 100',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'sia.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'You have created a draft application.',
  },
  applicationSent: {
    id: 'sia.application:applicationSent',
    defaultMessage: 'Umsókn send',
    description: 'Application submitted',
  },
  tryggingastofnunSubmittedTitle: {
    id: 'sia.application:tryggingastofnunSubmittedTitle',
    defaultMessage: 'Umsókn hefur verið send til Tryggingastofnunnar',
    description:
      'Application has been sent to the Social Insurance Administration',
  },
  tryggingastofnunSubmittedContent: {
    id: 'sia.application:tryggingastofnunSubmittedContent',
    defaultMessage:
      'Umsóknin þín er í bið eftir yfirferð. Hægt er að breyta umsókn þar til umsókn er komin í yfirferð.',
    description:
      'Your application is awaiting review. It is possible to edit the application until it is under review.',
  },
  tryggingastofnunInReviewTitle: {
    id: 'sia.application:tryggingastofnunInReviewTitle',
    defaultMessage: 'Verið er að fara yfir umsóknina',
    description: 'The application is being reviewed',
  },
  tryggingastofnunInReviewContent: {
    id: 'sia.application:tryggingastofnunInReviewContent',
    defaultMessage:
      'Tryggingastofnun fer nú yfir umsóknina og því getur þetta tekið nokkra daga',
    description:
      'The Social Insurance Administration is currently reviewing the application, this may take a few days',
  },
  applicationEdited: {
    id: 'sia.application:applicationEdited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
  applicationRejected: {
    id: 'sia.application:applicationRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application rejected',
  },
  applicationApproved: {
    id: 'sia.application:applicationApproved',
    defaultMessage: 'Tryggingastofnun hefur samþykkt umsóknina',
    description: 'Tryggingastofnun has accepted the application',
  },
  additionalDocumentRequired: {
    id: 'sia.application:additionalDocumentRequired',
    defaultMessage: 'Viðbótargögn vantar',
    description: 'Additional documents required',
  },
  additionalDocumentsAdded: {
    id: 'sia.application:additionalDocumentsAdded',
    defaultMessage: 'Viðbótargögnum bætt við',
    description: 'Additional documents added',
  },
  additionalDocumentRequiredDescription: {
    id: 'sia.application:additionalDocumentRequired.description',
    defaultMessage: 'Tryggingastofnun vantar frekari gögn vegna umsóknarinnar.',
    description:
      'Social Insurance Administration needs additional documentation regarding your application.',
  },
  pendingTag: {
    id: 'sia.application:pending.tag',
    defaultMessage: 'Í bið',
    description: 'Pending',
  },
})
