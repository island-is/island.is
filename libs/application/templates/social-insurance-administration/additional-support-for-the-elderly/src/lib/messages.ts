import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const additionalSupportForTheElderyFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'asfte.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'asfte.application:applicationTitle',
      defaultMessage: 'Umsókn um félagslegan viðbótarstuðning',
      description: 'Application for additional support for the eldery',
    },
    formTitle: {
      id: 'asfte.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'asfte.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'asfte.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    alertTitle: {
      id: 'asfte.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'asfte.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSection: {
      id: 'asfte.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'asfte.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    checkboxProvider: {
      id: 'asfte.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
    skraInformationTitle: {
      id: 'asfte.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    skraInformationSubTitle: {
      id: 'asfte.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig og maka. Upplýsingar um búsetu.',
      description:
        'Information about you and spouse. Information about residence.',
    },
    socialInsuranceAdministrationInformationTitle: {
      id: 'asfte.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'Information regarding income and circumstances',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'asfte.application:prerequisites.socialInsuranceAdministration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikningur eru sóttar á mínar síður hjá Tryggingastofnun. \n\nTryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. \n\nFrekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar [hér](https://www.tr.is/tryggingastofnun/personuvernd). \n\nEf tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.',
      description:
        'Information about email address, phone number and bank account will be retrieved from My Pages at the Social Insurance Administration. \n\nThe Social Insurance Administration only collects the necessary information for processing applications and determining cases. That information can relate to both your income and other circumstances. If applicable, the Social Insurance Administration is authorised to obtain information from other organisations. \n\nMore information on data collection authority and processing of personal information can be found in the privacy policy of the Insurance Administration [here](https://www.tr.is/tryggingastofnun/personuvernd). \n\nIf your income or other circumstances change, you must notify the Social Insurance Administration as this may affect your payments.',
    },
    startApplication: {
      id: 'asfte.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
    isNotEligibleLabel: {
      id: 'asfte.application:is.not.eligible.label',
      defaultMessage: 'Því miður átt þú ekki rétt á félagslegum viðbótarstuðningi',
      description:
        'Unfortunately, you are not entitled to additional support for the elderly',
    },
    isNotEligibleDescription: {
      id: 'asfte.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi\n* Þú hefur ekki náð 67 ára\n* Þú ert ekki með skráð lögheimili á Íslandi\nÞú ert lífeyrisþeki með 90% réttindi eða meira í almannatryggingakerfinu\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reasons for this could be the following\n* You are not yet 67 years of age\n* You do not have a registered domicile in Iceland\nYou are a pensioner with 90% or more rights in the social security system\nIf you do not think this apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
  }),

  info: defineMessages({
    periodTitle: {
      id: 'asfte.application:info.period.title',
      defaultMessage: 'Tímabil',
      description: 'Period',
    },
    periodDescription: {
      id: 'asfte.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greiddan félagslegan viðbótastuðning. Hægt er að sækja um fyrir þrjá mánuði aftur í tímann.',
      description: `english translation`,
    },
    periodYear: {
      id: 'asfte.application:info.period.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    periodYearDefaultText: {
      id: 'asfte.application:info.period.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    periodMonth: {
      id: 'asfte.application:info.period.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    periodMonthDefaultText: {
      id: 'asfte.application:info.period.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
    section: {
      id: 'asfte.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'asfte.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    subSectionDescription: {
      id: 'asfte.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt frá Tryggingastofnun. Ef símanúmerið er ekki rétt eða vantar getur þú skráð það hérna fyrir neðan.',
      description:
        'Email address and phone number is retrieved from the Social Insurance Administration. If the phone number is incorrect or missing you can register the correct one below.',
    },
    applicantEmail: {
      id: 'asfte.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'asfte.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'asfte.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    title: {
      id: 'asfte.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    description: {
      id: 'asfte.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    buttonEdit: {
      id: 'asfte.application:button.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    additionalDocumentsAttachment: {
      id: 'asfte.application:additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description: 'Additional documents to Tryggingastofnunar',
    },
    overviewTitle: {
      id: 'asfte.application:confirm.overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    name: {
      id: 'asfte.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'asfte.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    email: {
      id: 'asfte.application:confirm.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'asfte.application:confirm.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
    cancelButton: {
      id: 'asfte.application:cancel.button',
      defaultMessage: 'Hætta við',
      description: 'Cancel',
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'asfte.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    attachmentButton: {
      id: 'asfte.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'asfte.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'asfte.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Documents with the following extensions are accepted: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'asfte.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'asfte.application:fileUpload.additionalFile.title',
      defaultMessage: 'Fylgiskjöl viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'asfte.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis dvalarleyfi frá útlendingastofnun (skila þarf inn báðum hliðum dvalarleyfis). Athugaðu að skjalið þarf að vera á .pdf formi.',
      description: 'english description',
    },
    additionalDocumentsEditSubmit: {
      id: 'asfte.application:fileUpload.additionalDocumentsEditSubmit',
      defaultMessage: 'Senda inn',
      description: 'Submit',
    },
    additionalDocumentRequiredTitle: {
      id: 'asfte.application:fileUpload.additionalDocumentRequired.title',
      defaultMessage: 'Viðbótargagna krafist',
      description: 'Additional documents required',
    },
    additionalDocumentRequiredDescription: {
      id: 'asfte.application:fileUpload.additionalDocumentRequired.description#markdown',
      defaultMessage:
        'Vinsamlegast hlaðið upp viðbótargögnum til Tryggingastofnunar. Ef þú ert ekki viss hvaða viðbótagögn það eru geturu séð það í [stafræna pósthólfinu þínu](https://island.is/minarsidur/postholf). Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Please submit additional documents for the Social Insurance Administration. If you are not sure which additional documents you should submit, you can see it in [your inbox on My Pages](https://island.is/minarsidur/postholf). Note that the document must be in .pdf format.',
    },
  }),

  comment: defineMessages({
    additionalInfoTitle: {
      id: 'asfte.application:comment.additional.info.title',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional Information',
    },
    commentSection: {
      id: 'asfte.application:comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    description: {
      id: 'asfte.application:comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'If you have any comments, leave them here.',
    },
    placeholder: {
      id: 'asfte.application:comment.placeholder',
      defaultMessage: 'Skrifaðu athugasemd hér',
      description: 'Your comment',
    },
  }),

  conclusionScreen: defineMessages({
    title: {
      id: 'asfte.application:conclusionScreen.title',
      defaultMessage: 'Umsókn móttekin og bíður tekjuáætlunar',
      description: 'Application received and awaiting income estimate',
    },
    alertTitle: {
      id: 'asfte.application:conclusionScreen.alertTitle',
      defaultMessage:
        'Athugið að ef þú hefur ekki skilað inn tekjuáætlun er mikilvægt að gera það svo hægt sé að afgreiða umsóknina. Þú getur skilað inn tekjuáætlun með því að ýta á takkann hér fyrir neðan.',
      description:
        'Attention, if you have not submitted an income estimate, you must do so for your application to be processed. You can submit an income estimate by pression the button below.',
    },
    bulletList: {
      id: `asfte.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Þú verður að skila inn tekjuáætlun, ef það hefur ekki verið gert nú þegar.\n* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til félagslegs viðbótarstuðnings við aldraða. Vinnslutími umsókna um félagslegan viðbótarstuðning er allt að fjórar vikur.\n* **Þú gætir átt rétt á:**\n\t* Heimilisuppbót`,
      description: `* You must submit an income estimate, if it has not been submitted already.\n* The Social Insurance Administration will review your application and confirm that all information provided is accurate.\n* If required, they will call for additional information/documents.\n* Once all necessary documents have been received, the Social Insurance Administration will review the application and determine whether an additional support for the elderly will be granted. The processing time for additional support for the elderly applications is up to four weeks.\n* **You may be entitled to:**\n\t* Household supplement`,
    },
    incomePlanCardLabel: {
      id: 'asfte.application:conclusionScreen.incomePlanCardLabel',
      defaultMessage: 'Skila inn tekjuáætlun',
      description: 'Submit income estimate',
    },
    incomePlanCardText: {
      id: 'asfte.application:conclusionScreen.incomePlanCardText',
      defaultMessage:
        'Mikilvægt er að skila inn tekjuáætlun sem fyrst svo hægt sé að afgreiða umsóknina og búa til greiðsluáætlun.',
      description:
        'It is important to submit an income estimate as soon as possible so that the application can be processed and a payment plan can be created.',
    },
    nextStepsText: {
      id: 'asfte.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Hjá Tryggingastofnun verður farið yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til félagslegs viðbótarstuðnings við aldraða.',
      description:
        'The application will be reviewed at the Insurance Agency. If needed, additional information/data is requested. Once all the necessary data have been received, a position is taken on the retirement pension.',
    },
  }),

  months: defineMessages({
    january: {
      id: 'asfte.application:month.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'asfte.application:month.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'asfte.application:month.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'asfte.application:month.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'asfte.application:month.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'asfte.application:month.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'asfte.application:month.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'asfte.application:month.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'asfte.application:month.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'asfte.application:month.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'asfte.application:month.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'asfte.application:month.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),
}

export const errorMessages = defineMessages({
  period: {
    id: 'asfte.application:error.period',
    defaultMessage: 'Ógildur mánuður.',
    description: 'Invalid month.',
  },
  phoneNumber: {
    id: 'asfte.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  requireAttachment: {
    id: 'asfte.application:fileUpload.required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'You must upload an attachment to continue.',
  },
  noEmailFound: {
    id: 'asfte.application:error.no.email.found.title',
    defaultMessage: 'Ekkert netfang skráð',
    description: 'No email address registered',
  },
  noEmailFoundDescription: {
    id: 'asfte.application:error.no.email.found.description#markdown',
    defaultMessage:
      'Þú ert ekki með skráð netfang hjá Tryggingastofnun. Vinsamlegast skráðu það [hér](https://minarsidur.tr.is/min-sida) og komdu svo aftur til að sækja um félagslegan viðbótarstuðning við aldraða.',
    description:
      'You do not have a registered email address with the Social Insurance Administration. Please register an email address [here](https://minarsidur.tr.is/min-sida) and subsequently return to this application to apply for additional support for the elderly.',
  },
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'asfte.application:inReview.form.title',
    defaultMessage: 'Umsókn um félagslegan viðbótarstuðning við aldraða',
    description: 'Application for additional support for the elderly',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'asfte.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'You have create a draft application.',
  },
  applicationSent: {
    id: 'asfte.application:applicationSent',
    defaultMessage: 'Umsókn send',
    description: 'Application submitted',
  },
  tryggingastofnunSubmittedTitle: {
    id: 'asfte.application:tryggingastofnunSubmittedTitle',
    defaultMessage: 'Umsókn hefur verið send til Tryggingastofnunnar',
    description:
      'Application has been sent to the Social Insurance Administration',
  },
  tryggingastofnunSubmittedContent: {
    id: 'asfte.application:tryggingastofnunSubmittedContent',
    defaultMessage:
      'Umsóknin þín er í bið eftir yfirferð. Hægt er að breyta umsókn þar til umsókn er komin í yfirferð.',
    description:
      'Your application is awaiting review. It is possible to edit the application until it is under review.',
  },
  tryggingastofnunInReviewTitle: {
    id: 'asfte.application:tryggingastofnunInReviewTitle',
    defaultMessage: 'Verið er að fara yfir umsóknina',
    description: 'The application is being reviewed',
  },
  tryggingastofnunInReviewContent: {
    id: 'asfte.application:tryggingastofnunInReviewContent',
    defaultMessage:
      'Tryggingastofnun fer nú yfir umsóknina og því getur þetta tekið nokkra daga',
    description:
      'The Social Insurance Administration is currently reviewing the application, this may take a few days',
  },
  applicationEdited: {
    id: 'asfte.application:applicationEdited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
  applicationRejected: {
    id: 'asfte.application:applicationRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application rejected',
  },
  applicationRejectedDescription: {
    id: 'asfte.application:applicationRejectedDescription',
    defaultMessage:
      'Umsókn vegna félagsleg viðbótarstuðnings við aldraða hefur verið hafnað',
    description:
      'The application for additional support for the elderly has been rejected',
  },
  applicationApproved: {
    id: 'asfte.application:applicationApproved',
    defaultMessage: 'Tryggingastofnun hefur samþykkt umsóknina',
    description: 'Tryggingastofnun has accepted the application',
  },
  applicationApprovedDescription: {
    id: 'asfte.application:applicationApprovedDescription',
    defaultMessage:
      'Umsókn vegna félagsleg viðbótarstuðnings við aldraða hefur verið samþykkt',
    description:
      'The application for additional support for the elderly has been approved',
  },
  additionalDocumentRequired: {
    id: 'asfte.application:additionalDocumentRequired',
    defaultMessage: 'Viðbótargögn vantar',
    description: 'Additional documents required',
  },
  additionalDocumentsAdded: {
    id: 'asfte.application:additionalDocumentsAdded',
    defaultMessage: 'Viðbótargögnum bætt við',
    description: 'Additional documents added',
  },
  additionalDocumentRequiredDescription: {
    id: 'asfte.application:additionalDocumentRequired.description',
    defaultMessage: 'Tryggingastofnun vantar frekari gögn vegna umsóknarinnar.',
    description:
      'Social Insurance Administration needs additional documentation regarding your application.',
  },
  pendingTag: {
    id: 'asfte.application:pending.tag',
    defaultMessage: 'Í bið',
    description: 'Pending',
  },
})
