import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const householdSupplementFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'hs.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Social Insurance Administration',
    },
    applicationTitle: {
      id: 'hs.application:application.title',
      defaultMessage: 'Umsókn um heimilisuppbót',
      description: 'Application for household supplement',
    },
    formTitle: {
      id: 'hs.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'hs.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'hs.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    householdSupplement: {
      id: 'hs.application:household.supplement',
      defaultMessage: 'Heimilisuppbót',
      description: 'Household supplement',
    },
    alertTitle: {
      id: 'hs.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'hs.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSection: {
      id: 'hs.application:external.data.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'hs.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    checkboxProvider: {
      id: 'hs.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
    skraInformationTitle: {
      id: 'hs.application:skra.info.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    skraInformationSubTitle: {
      id: 'hs.application:skra.info.subtitle',
      defaultMessage: 'Upplýsingar um þig og lögheimilistengsl.',
      description: 'Information about you and ...',
    },
    socialInsuranceAdministrationInformationTitle: {
      id: 'hs.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar af mínum síðum hjá Tryggingastofnun',
      description: 'english translation',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'hs.application:prerequisites.socialInsuranceAdministration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar á mínar síður hjá Tryggingastofnun. \n\nTryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðslu mála. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. \n\nFrekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar [hér](https://www.tr.is/tryggingastofnun/personuvernd).',
      description:
        'Information about email address, phone number and bank account will be retrieved from My Pages at the Social Insurance Administration. \n\nThe Social Insurance Administration only collects the necessary information for processing applications and determining cases. If applicable, the Social Insurance Administration is authorised to obtain information from other organisations. \n\nMore information on data collection authority and processing of personal information can be found in the privacy policy of the Insurance Administration [here](https://www.tr.is/tryggingastofnun/personuvernd).',
    },
    startApplication: {
      id: 'hs.application:start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
    isNotEligibleLabel: {
      id: 'hs.application:is.not.eligible.label',
      defaultMessage: 'Því miður hefur þú ekki rétt á heimilisuppbót',
      description:
        'Unfortunately, you are not entitled to household supplement',
    },
    isNotEligibleDescription: {
      id: 'hs.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi.\n* Þú ert ekki lífeyrisþegi.\n* Maki þinn delur ekki á stofnun fyrir aldraða.\n\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reasons for this could be the following.\n* You are not a pensioner.\n* Your spouse does not belong to an institution for the elderly.\n\nIf you do not think these points apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
  }),

  info: defineMessages({
    section: {
      id: 'hs.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'hs.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    subSectionDescription: {
      id: 'hs.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt frá Tryggingastofnun. Ef símanúmerið er ekki rétt eða vantar getur þú skráð það hérna fyrir neðan.',
      description: 'translation',
    },
    applicantEmail: {
      id: 'hs.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'hs.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    householdSupplementDescription: {
      id: 'hs.application:info.household.supplement.description#markdown',
      defaultMessage:
        'Til að eiga rétt á heimilisuppbót verður umsækjandi að vera einhleypur og búa einn. Einnig er heimilt að greiða heimilisuppbót til lífeyrisþega ef maki dvelur á stofnun fyrir aldraða. Tvær undantekningar eru á þessu: býr með barni/börnum yngri en 18 ára eða 18-25 ára ungmenni/um  sem er í námi eða ef ungmenni yngra en 25 ára er með tímabundið aðsetur fjarri lögheimili vegna náms.',
      description: 'english translation',
    },
    householdSupplementHousing: {
      id: 'hs.application:info.household.supplement.housing',
      defaultMessage: 'Hvar býrð þú?',
      description: 'Where do you live?',
    },
    householdSupplementHousingOwner: {
      id: 'hs.application:info.household.supplement.housing.owner',
      defaultMessage: 'í eigin húsnæði',
      description: 'english translation',
    },
    householdSupplementHousingRenter: {
      id: 'hs.application:info.household.supplement.housing.renter',
      defaultMessage: 'í leiguhúsnæði',
      description: 'in a rented place',
    },
    householdSupplementChildrenBetween18And25: {
      id: 'hs.application:info.household.supplement.children.betweem18And25',
      defaultMessage:
        'Býr ungmenni á aldrinum 18-25 ára á heimilinu sem er í námi?',
      description: 'english translation',
    },
    householdSupplementAlertTitle: {
      id: 'hs.application:info.household.supplement.alert.title',
      defaultMessage: 'Athuga',
      description: 'Attention',
    },
    householdSupplementAlertDescription: {
      id: 'hs.application:info.household.supplement.alert.description',
      defaultMessage:
        'Samkvæmt uppflettingu í Þjóðskrá býr einstaklingur eldri en 25 ára á sama lögheimili og þú. Ef þú telur þetta vera vitlaust skaltu hafa samband við Þjóðskrá til að laga þetta. Þegar þú ert búinn að gera viðeigandi breytingar hjá Þjóðskrá getur þú haldið áfram með umsóknina og skila inn skjali því til staðfestingar hér aftar í ferlinu.',
      description: 'english translation',
    },
    periodTitle: {
      id: 'hs.application:info.period.title',
      defaultMessage: 'Tímabil',
      description: `Period`,
    },
    periodDescription: {
      id: 'hs.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greidda heimilisuppbót. Hægt er að sækja fyrir árið í ár og 2 ár aftur í tímann.',
      description: `english translation`,
    },
    periodYear: {
      id: 'hs.application:info.period.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    periodYearDefaultText: {
      id: 'hs.application:info.period.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    periodMonth: {
      id: 'hs.application:info.period.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    periodMonthDefaultText: {
      id: 'hs.application:info.period.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
  }),

  payment: defineMessages({
    title: {
      id: 'hs.application:payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    alertMessage: {
      id: 'hs.application:payment.alert.message',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reikning.',
      description:
        'All your payments from TR are paid into the bank account below. If you change your bank details, all your payments from the TR will be paid into that account.',
    },
    alertMessageForeign: {
      id: 'hs.application:payment.alert.message.foreign#markdown',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inn á bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inn á þann reikning. \n\nMikilvægt er að bankaupplýsingarnar séu réttar. Gott er að hafa samband við viðskiptabanka sinn til að ganga úr skugga um að upplýsingarnar séu réttar ásamt því að fá upplýsingar um IBAN-númer og SWIFT-númer. \n\nVinsamlegast athugið að greiðslur inn á erlenda reikninga geta tekið 3-4 daga. Banki sem sér um millifærslu leggur á þjónustugjald fyrir millifærslunni.',
      description: 'english description',
    },
    bank: {
      id: 'hs.application:payment.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    icelandicBankAccount: {
      id: 'hs.application:payment.icelandic.bank.account',
      defaultMessage: 'Íslenskur reikningur',
      description: 'Icelandic account',
    },
    foreignBankAccount: {
      id: 'hs.application:payment.foreign.bank.account',
      defaultMessage: 'Erlendur reikningur',
      description: 'Foreign account',
    },
    iban: {
      id: 'hs.application:payment.iban',
      defaultMessage: 'IBAN',
      description: 'IBAN',
    },
    swift: {
      id: 'hs.application:payment.swift',
      defaultMessage: 'SWIFT',
      description: 'SWIFT',
    },
    bankName: {
      id: 'hs.application:payment.bank.name',
      defaultMessage: 'Heiti banka',
      description: 'Bank name',
    },
    bankAddress: {
      id: 'hs.application:payment.bank.address',
      defaultMessage: 'Heimili banka',
      description: 'Bank address',
    },
    currency: {
      id: 'hs.application:payment.currency',
      defaultMessage: 'Mynt',
      description: 'Currency',
    },
    selectCurrency: {
      id: 'hs.application:payment.select.currency',
      defaultMessage: 'Veldu mynt',
      description: 'Select currency',
    },
  }),

  fileUpload: defineMessages({
    attachmentButton: {
      id: 'hs.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'hs.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'hs.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Accepted documents with the following extensions: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'hs.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'hs.application:fileUpload.additionalFile.title',
      defaultMessage: 'Fylgiskjöl viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'hs.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangar upplýsingar. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
    leaseAgreementTitle: {
      id: 'hs.application:fileUppload.lease.agreement.title',
      defaultMessage: 'Fylgiskjöl leigusamningur',
      description: 'Household supplement rental agreement',
    },
    schoolConfirmationTitle: {
      id: 'hs.application:fileUppload.school.confirmation.title',
      defaultMessage: 'Fylgiskjöl skólavottorð',
      description: "Household supplement young person's school attendance",
    },
    leaseAgreement: {
      id: 'hs.application:fileUppload.lease.agreement',
      defaultMessage:
        'Hér þarft þú að skila undirritaðum leigusamningi. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you must upload the signed rental agreement. Note that the document must be in .pdf format.',
    },
    schoolConfirmation: {
      id: 'hs.application:fileUppload.school.confirmation',
      defaultMessage:
        'Hér þarft þú að skila vottorði um skólavist ungmennis. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        "Here you must upload a certificate of a young person's school attendance. Note that the document must be in .pdf format.",
    },
    additionalDocumentRequired: {
      id: 'hs.application:fileUpload.additional.document.required',
      defaultMessage:
        'Viðbótargagna krafist, vinsamlegast hlaðið viðbótargögnum upp á næstu síðu',
      description:
        'Additional document(s) required, on the next page you will be able to upload the additional document(s), to begin please press continue.',
    },
    additionalDocumentsEditSubmit: {
      id: 'hs.application:fileUpload.additional.documents.edit.submit',
      defaultMessage: 'Senda inn',
      description: 'Submit',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'hs.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  comment: defineMessages({
    commentSection: {
      id: 'hs.application:comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    description: {
      id: 'hs.application:comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'If you have any comments, leave them here.',
    },
    placeholder: {
      id: 'hs.application:comment.placeholder',
      defaultMessage: 'Skrifaðu hér athugasemd',
      description: 'Your comment',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'hs.application:confirm.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirm',
    },
    title: {
      id: 'hs.application:confirm.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    description: {
      id: 'hs.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    leaseAgreementAttachment: {
      id: 'hs.application:confirm.lease.agreement.attachment',
      defaultMessage: 'Undirritaður leigusamningur',
      description: 'Signed lease agreement',
    },
    schoolConfirmationAttachment: {
      id: 'hs.application:confirm.school.confirmation.attachment',
      defaultMessage: 'Vottorð um skólavist ungmennis',
      description: 'Certificate of school attendance of a young person',
    },
    additionalDocumentsAttachment: {
      id: 'hs.application:confirm.additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description: 'Additional documents to Tryggingastofnunar',
    },
    overviewTitle: {
      id: 'hs.application:confirm.overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    buttonsEdit: {
      id: 'hs.application:confirm.buttons.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    name: {
      id: 'hs.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'hs.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    email: {
      id: 'hs.application:confirm.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'hs.application:confirm.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
  }),

  conclusionScreen: defineMessages({
    title: {
      id: 'hs.application:conclusionScreen.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Application received',
    },
    alertTitle: {
      id: 'hs.application:conclusionScreen.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Your application has been received',
    },
    alertMessage: {
      id: 'hs.application:conclusionScreen.alertMessage',
      defaultMessage:
        'Umsókn um heimilisuppbót hefur verið send til Tryggingastofnunar',
      description:
        'An application for household supplements has been sent to Tryggingastofnunar',
    },
    bulletList: {
      id: `hs.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til heimilisuppbótar.`,
      description: 'BulletList',
    },
    nextStepsLabel: {
      id: 'hs.application:conclusionScreen.nextStepsLabel',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next?',
    },
    nextStepsText: {
      id: 'hs.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Hjá Tryggingastofnun verður farið yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til ellilífeyris.',
      description:
        'The application will be reviewed at the Insurance Agency. If needed, additional information/data is requested. Once all the necessary data have been received, a position is taken on the retirement pension.',
    },
    buttonsViewApplication: {
      id: 'hs.application:conclusionScreen.buttonsViewApplication',
      defaultMessage: 'Skoða umsókn',
      description: 'View application',
    },
  }),

  months: defineMessages({
    january: {
      id: 'hs.application:month.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'hs.application:month.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'hs.application:month.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'hs.application:month.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'hs.application:month.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'hs.application:month.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'hs.application:month.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'hs.application:month.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'hs.application:month.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'hs.application:month.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'hs.application:month.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'hs.application:month.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),
}

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'hs.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  bank: {
    id: 'hs.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  period: {
    id: 'hs.application:error.period',
    defaultMessage: 'Tímabil þarf að vera gilt.',
    description: 'The period must be valid.',
  },
  noEmailFound: {
    id: 'hs.application:error.no.email.found.title',
    defaultMessage: 'Ekkert netfang skráð',
    description: 'english translation',
  },
  noEmailFoundDescription: {
    id: 'hs.application:error.no.email.found.description',
    defaultMessage:
      'Þú ert ekki með skráð netfang hjá Tryggingastofnun. Vinsamlegast skráðu það inná mínum síðum á tr.is og komdu svo aftur til að sækja um ellilífeyri.',
    description: 'english translation',
  },
  iban: {
    id: 'hs.application:error.iban',
    defaultMessage: 'Ógilt IBAN',
    description: 'Invalid IBAN',
  },
  swift: {
    id: 'hs.application:error.swift',
    defaultMessage: 'Ógilt SWIFT',
    description: 'Invalid SWIFT',
  },
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'hs.application:inReview.form.title',
    defaultMessage: 'Umsókn um heimilisuppbót',
    description: 'Household supplement',
  },
})

export const validatorErrorMessages = defineMessages({
  requireAttachment: {
    id: 'hs.application:fileUpload.required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'Error message when the attachment file is not provided.',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'hs.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'Description of the state - draft',
  },
  applicationSent: {
    id: 'hs.application:applicationSent',
    defaultMessage: 'Umsókn send',
    description: 'History application sent',
  },
  tryggingastofnunSubmittedTitle: {
    id: 'hs.application:tryggingastofnunSubmittedTitle',
    defaultMessage: 'Umsókn hefur verið send til Tryggingastofnunnar',
    description: 'The application has been sent to Tryggingastofnunnar',
  },
  tryggingastofnunSubmittedContent: {
    id: 'hs.application:tryggingastofnunSubmittedContent',
    defaultMessage:
      'Umsóknin þín er í bið eftir yfirferð. Hægt er að breyta umsókn þar til umsókn er komin í yfirferð.',
    description: 'Application waiting for review',
  },

  tryggingastofnunInReviewTitle: {
    id: 'hs.application:tryggingastofnunInReviewTitle',
    defaultMessage: 'Verið er að fara yfir umsóknina',
    description: 'The application is being reviewed',
  },
  tryggingastofnunInReviewContent: {
    id: 'hs.application:tryggingastofnunInReviewContent',
    defaultMessage:
      'Tryggingastofnun fer núna yfir umsóknina og því getur þetta tekið nokkra daga',
    description:
      'Tryggingastofnun is currently reviewing the application, so this may take a few days',
  },

  applicationEdited: {
    id: 'hs.application:applicationEdited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
  applicationRejected: {
    id: 'hs.application:applicationRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application rejected',
  },
  applicationApproved: {
    id: 'hs.application:applicationApproved',
    defaultMessage: 'Tryggingastofnun hefur samþykkt umsóknina',
    description: 'Tryggingastofnun has accepted the application',
  },
  applicationApprovedDescription: {
    id: 'hs.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn um heimilisuppbót hefur verið samþykkt',
    description: 'The application for household supplement has been approved',
  },

  additionalDocumentRequired: {
    id: 'hs.application:additionalDocumentRequired',
    defaultMessage: 'Viðbótargögn vantar',
    description: 'Additional documents required',
  },
  additionalDocumentsAdded: {
    id: 'hs.application:additionalDocumentsAdded',
    defaultMessage: 'Viðbótargögnum bætt við',
    description: 'Additional documents added',
  },
  additionalDocumentRequiredDescription: {
    id: 'hs.application:additionalDocumentRequired.description',
    defaultMessage: 'Tryggingastofnun vantar frekari gögn vegna umsóknarinnar.',
    description: 'Description of the state - additionalDocumentRequired',
  },
  pendingTag: {
    id: 'hs.application:pending.tag',
    defaultMessage: 'Í bið',
    description: 'Pending',
  },
})
