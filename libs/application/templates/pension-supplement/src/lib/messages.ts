import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const pensionSupplementFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'ul.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'ul.application:applicationTitle',
      defaultMessage: 'Umsókn um uppbót á lífeyri',
      description: 'Application for pension supplement',
    },
    formTitle: {
      id: 'ul.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'ul.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'ul.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'ul.application:external.data.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'ul.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileInformationTitle: {
      id: 'ul.application:userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
      description: 'Information from your account on Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'ul.application:userprofile.subtitle',
      defaultMessage:
        'Sækir upplýsingar um netfang, símanúmer og bankareikning frá mínum síðum Ísland.is.',
      description:
        'Information about email adress, phone number and bank account will be retrieved from your account at Ísland.is.',
    },
    skraInformationTitle: {
      id: 'ul.application:skra.info.title',
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    skraInformationSubTitle: {
      id: 'ul.application:skra.info.subtitle',
      defaultMessage: 'Sækir upplýsingar um þig, maka og börn frá Þjóðskrá.',
      description:
        'Information about you, spouse and children will be retrieved from Registers Iceland.',
    },
    startApplication: {
      id: 'ul.application:start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'ul.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'ul.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    subSectionDescription: {
      id: 'ul.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt á mínar síður á Ísland.is. Ef upplýsingarnar eru ekki réttar eða vantar setur þú þær inn hér.',
      description: 'translation',
    },
    applicantEmail: {
      id: 'ul.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'ul.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    paymentTitle: {
      id: 'ul.application:info.payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    paymentAlertTitle: {
      id: 'ul.application:info.payment.alert.title',
      defaultMessage: 'Til athugunar!',
      description: 'For consideration',
    },
    paymentAlertMessage: {
      id: 'ul.application:info.payment.alert.message',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reiking.',
      description:
        'All your payments from TR are paid into the bank account below. If you change your bank details, all your payments from the TR will be paid into that account.',
    },
    paymentBank: {
      id: 'ul.application:info.payment.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    applicationReasonTitle: {
      id: 'ul.application:info.application.reason.title',
      defaultMessage: 'Ástæða umsóknar',
      description: 'Reason for application',
    },
    applicationReasonDescription: {
      id: 'ul.application:info.application.reason.description',
      defaultMessage:
        'Hægt er að merkja við marga möguleika en skylda að merkja við einhvern.',
      description: 'You can check many options, but you must check someone.',
    },
    applicationReasonMedicineCost: {
      id: 'ul.application:info.application.reason.medicine.cost',
      defaultMessage: 'Lyfja- eða sjúkrahjálp',
      description: 'Medicine cost',
    },
    applicationReasonAssistedCareAtHome: {
      id: 'ul.application:info.application.reason.assisted.care.at.home',
      defaultMessage: 'Umönnun í heimahúsi',
      description: 'Assisted care at home',
    },
    applicationReasonHouseRent: {
      id: 'ul.application:info.application.reason.house.rent',
      defaultMessage:
        'Húsaleiga sem fellur utan húsaleigubóta frá sveitarfélagi',
      description:
        'House rent that falls outside the rent allowance from the municipality',
    },
    applicationReasonAssistedLiving: {
      id: 'ul.application:info.application.reason.assisted.living',
      defaultMessage: 'Dvöl á sambýli eða áfangaheimili',
      description: 'Assisted living',
    },
    applicationReasonPurchaseOfHearingAids: {
      id: 'ul.application:info.application.reason.purchase.of.hearing.aids',
      defaultMessage: 'Kaup á heyrnartækjum',
      description: 'Purchase of hearing aids',
    },
    applicationReasonOxygenFilterCost: {
      id: 'ul.application:info.application.reason.oxygen.filter.cost',
      defaultMessage: 'Rafmagn á súrefnissíu',
      description: 'Oxygen filter voltage/cost',
    },
    applicationReasonHalfwayHouse: {
      id: 'ul.application:info.application.reason.halfway.house',
      defaultMessage: 'Dvöl á áfangaheimili',
      description: 'Halfway house',
    },
    periodTitle: {
      id: 'ul.application:info.period.title',
      defaultMessage: 'Tímabil',
      description: `Period`,
    },
    periodDescription: {
      id: 'ul.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greidda heimilisuppbót. Hægt er að sækja fyrir árið í ár og 2 ár aftur í tímann.',
      description: `english translation`,
    },
    periodYear: {
      id: 'ul.application:info.period.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    periodYearDefaultText: {
      id: 'ul.application:info.period.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    periodMonth: {
      id: 'ul.application:info.period.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    periodMonthDefaultText: {
      id: 'ul.application:info.period.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
  }),

  fileUpload: defineMessages({
    attachmentButton: {
      id: 'ul.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'ul.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'ul.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Accepted documents with the following extensions: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'ul.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'ul.application:fileUpload.additionalFile.title',
      defaultMessage: 'Fylgiskjöl viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'ul.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangar upplýsingar. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
    assistedCareAtHomeTitle: {
      id: 'ul.application:fileUppload.assisted.care.at.home.title',
      defaultMessage: 'Fylgiskjöl umönnun í heimahúsi',
      description: 'Pension supplement assisted care at home attachment',
    },
    assistedCareAtHome: {
      id: 'ul.application:fileUppload.assisted.care.at.home',
      defaultMessage:
        'Hér getur þú skilað staðfestingu á kostnaði sem opinberir aðilar greiða ekki. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can upload a confirmation of costs that public entities do not pay. Note that the document must be in .pdf format.',
    },
    houseRentSectionTitle: {
      id: 'ul.application:fileUppload.house.rent.section.title',
      defaultMessage: 'Fylgiskjöl húsaleiga',
      description:
        'Attachments for rent that is not covered by rent allowance from the municipality',
    },
    houseRentTitle: {
      id: 'ul.application:fileUppload.house.rent.title',
      defaultMessage:
        'Fylgiskjöl húsaleiga sem fellur utan húsaleigubóta frá sveitarfélagi',
      description:
        'Attachments for house rent that falls outside the rent allowance from the municipality',
    },
    houseRentAgreement: {
      id: 'ul.application:fileUppload.house.rent.agreement',
      defaultMessage:
        'Hér getur þú skilað húsaleigusamning undirrituðum af leigusala/umboðsmanni og leigutaka. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can return the tenancy agreement signed by the landlord/agent and the tenant. Note that the document must be in .pdf format.',
    },
    houseRentAllowance: {
      id: 'ul.application:fileUppload.house.rent.allowance',
      defaultMessage:
        'Hér getur þú skilað staðfestingu á að ekki sé réttur á húsaleigubótum. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit a confirmation that you are not entitled to rent allowance. Note that the document must be in .pdf format.',
    },
    assistedLivingTitle: {
      id: 'ul.application:fileUppload.assisted.living.title',
      defaultMessage: 'Fylgiskjöl dvöl á sambýli eða áfangaheimili',
      description: 'Attachments assisted living',
    },
    assistedLiving: {
      id: 'ul.application:fileUppload.assisted.living',
      defaultMessage:
        'Hér getur þú skilað undirritaðri staðfestingu á dvöl frá umsjónaraðila/forstöðumanni. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can return a signed confirmation of your stay from the supervisor/director. Note that the document must be in .pdf format.',
    },
    purchaseOfHearingAidsTitle: {
      id: 'ul.application:fileUppload.purchase.of.hearing.aids.title',
      defaultMessage: 'Fylgiskjöl kaup á heyrnartækjum',
      description: 'Attachments purchase of hearing aids',
    },
    purchaseOfHearingAids: {
      id: 'ul.application:fileUppload.purchase.of.hearing.aids',
      defaultMessage:
        'Hér getur þú skilað reikning vegna kaupa á heyrnatækjum innan 4 ára. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can return an invoice for the purchase of hearing aids within 4 years. Note that the document must be in .pdf format.',
    },
    halfwayHouseTitle: {
      id: 'ul.application:fileUppload.halfway.house.title',
      defaultMessage: 'Fylgiskjöl dvöl á áfangaheimili',
      description: 'Attachments halfway house',
    },
    halfwayHouse: {
      id: 'ul.application:fileUppload.halfway.house',
      defaultMessage:
        'Hér getur þú skilað staðfestingu á kostnaði sem opinberir aðilar greiða ekki. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can upload a confirmation of costs that public entities do not pay. Note that the document must be in .pdf format.',
    },
    additionalDocumentRequired: {
      id: 'ul.application:fileUpload.additionalDocumentRequired',
      defaultMessage:
        'Viðbótargögn krafist, vinsamlegast hlaðið viðbótargögnum á næstu síðu',
      description:
        'Additional document(s) required, on the next page you will be able to upload the additional document(s), to begin please press continue.',
    },
    additionalDocumentsEditSubmit: {
      id: 'ul.application:fileUpload.additionalDocumentsEditSubmit',
      defaultMessage: 'Senda inn',
      description: 'Submit',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'ul.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
    commentSection: {
      id: 'ul.application:additional.info.comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    commentDescription: {
      id: 'ul.application:additional.info.comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'If you have any comments, leave them here.',
    },
    commentPlaceholder: {
      id: 'ul.application:additional.info.comment.placeholder',
      defaultMessage: 'Skrifaðu hér athugasemd',
      description: 'Your comment',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'ul.application:confirm.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirm',
    },
    title: {
      id: 'ul.application:confirm.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    description: {
      id: 'ul.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    overviewTitle: {
      id: 'ul.application:confirm.overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    buttonsEdit: {
      id: 'ul.application:confirm.buttons.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    name: {
      id: 'ul.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'ul.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    email: {
      id: 'ul.application:confirm.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'ul.application:confirm.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
  }),

  conclusionScreen: defineMessages({
    title: {
      id: 'ul.application:conclusionScreen.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Application received',
    },
    alertTitle: {
      id: 'ul.application:conclusionScreen.alertTitle',
      defaultMessage:
        'Umsókn um uppbót á lífeyri hefur verið send til Tryggingastofnunar',
      description:
        'An application for pension supplements has been sent to Tryggingastofnunar',
    },
    bulletList: {
      id: `ul.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til uppbóta á lífeyri.`,
      description: 'BulletList',
    },
    nextStepsLabel: {
      id: 'ul.application:conclusionScreen.nextStepsLabel',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next?',
    },
    nextStepsText: {
      id: 'ul.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Hjá Tryggingastofnun verður farið yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til uppbóta á lífeyri.',
      description:
        'The application will be reviewed at the Insurance Agency. If needed, additional information/data is requested. Once all the necessary data have been received, a position is taken on the pension supplement.',
    },
    buttonsViewApplication: {
      id: 'ul.application:conclusionScreen.buttonsViewApplication',
      defaultMessage: 'Skoða umsókn',
      description: 'View application',
    },
  }),

  months: defineMessages({
    january: {
      id: 'ul.application:month.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'ul.application:month.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'ul.application:month.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'ul.application:month.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'ul.application:month.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'ul.application:month.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'ul.application:month.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'ul.application:month.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'ul.application:month.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'ul.application:month.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'ul.application:month.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'ul.application:month.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),
}

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'ul.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  bank: {
    id: 'ul.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  applicationReason: {
    id: 'ul.application:error.application.reason',
    defaultMessage: 'Skylda að velja einhverja ástæðu',
    description: 'Required to choose some reason',
  },
  period: {
    id: 'ul.application:error.period',
    defaultMessage: 'Tímabil þarf að vera gilt.',
    description: 'The period must be valid.',
  },
})

export const validatorErrorMessages = defineMessages({
  requireAttachment: {
    id: 'ul.application:fileUpload.required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'Error message when the attachment file is not provided.',
  },
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'ul.application:inReview.form.title',
    defaultMessage: 'Umsókn um uppbót á lífeyri',
    description: 'Pension supplement',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'ul.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'Description of the state - draft',
  },
  applicationSent: {
    id: 'ul.application:applicationSent',
    defaultMessage: 'Umsókn send',
    description: 'History application sent',
  },
  tryggingastofnunSubmittedTitle: {
    id: 'ul.application:tryggingastofnunSubmittedTitle',
    defaultMessage: 'Umsókn hefur verið send til Tryggingastofnunnar',
    description: 'The application has been sent to Tryggingastofnunnar',
  },
  tryggingastofnunSubmittedContent: {
    id: 'ul.application:tryggingastofnunSubmittedContent',
    defaultMessage:
      'Umsóknin þín er í bið eftir yfirferð. Hægt er að breyta umsókn þar til umsókn er komin í yfirferð.',
    description: 'Application waiting for review',
  },
  tryggingastofnunInReviewTitle: {
    id: 'ul.application:tryggingastofnunInReviewTitle',
    defaultMessage: 'Verið er að fara yfir umsóknina',
    description: 'The application is being reviewed',
  },
  tryggingastofnunInReviewContent: {
    id: 'ul.application:tryggingastofnunInReviewContent',
    defaultMessage:
      'Tryggingastofnun fer núna yfir umsóknina og því getur þetta tekið nokkra daga',
    description:
      'Tryggingastofnun is currently reviewing the application, so this may take a few days',
  },
  applicationEdited: {
    id: 'ul.application:applicationEdited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
  applicationRejected: {
    id: 'ul.application:applicationRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application rejected',
  },
  applicationApproved: {
    id: 'ul.application:applicationApproved',
    defaultMessage: 'Tryggingastofnun hefur samþykkt umsóknina',
    description: 'Tryggingastofnun has accepted the application',
  },
  applicationApprovedDescription: {
    id: 'ul.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn vegna ellilífeyris hefur verið samþykkt',
    description: 'The application for old-age pension has been approved',
  },
  additionalDocumentRequired: {
    id: 'ul.application:additionalDocumentRequired',
    defaultMessage: 'Viðbótargögn vantar',
    description: 'Additional documents required',
  },
  additionalDocumentsAdded: {
    id: 'ul.application:additionalDocumentsAdded',
    defaultMessage: 'Viðbótargögnum bætt við',
    description: 'Additional documents added',
  },
  additionalDocumentRequiredDescription: {
    id: 'ul.application:additionalDocumentRequired.description',
    defaultMessage: 'Tryggingastofnun vantar frekari gögn vegna umsóknarinnar.',
    description: 'Description of the state - additionalDocumentRequired',
  },
  pendingTag: {
    id: 'ul.application:pending.tag',
    defaultMessage: 'Í bið',
    description: 'Pending',
  },
})
