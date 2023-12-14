import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const additionalSupportForTheElderyFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'asfte.application:applicationTitle',
      defaultMessage: 'Umsókn um félagslegan viðbótarstuðning',
      description: 'Application for additional support for the eldery',
    },
  }),

  pre: defineMessages({
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
    isNotEligibleLabel: {
      id: 'asfte.application:is.not.eligible.label',
      defaultMessage:
        'Því miður átt þú ekki rétt á félagslegum viðbótarstuðningi',
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
    periodDescription: {
      id: 'asfte.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greiddan félagslegan viðbótastuðning. Hægt er að sækja um fyrir þrjá mánuði aftur í tímann.',
      description: `english translation`,
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
  bank: {
    id: 'asfte.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  iban: {
    id: 'asfte.application:error.iban',
    defaultMessage: 'Ógilt IBAN',
    description: 'Invalid IBAN',
  },
  swift: {
    id: 'asfte.application:error.swift',
    defaultMessage: 'Ógilt SWIFT',
    description: 'Invalid SWIFT',
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
