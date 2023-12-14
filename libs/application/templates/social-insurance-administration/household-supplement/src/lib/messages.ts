import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const householdSupplementFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'hs.application:application.title',
      defaultMessage: 'Umsókn um heimilisuppbót',
      description: 'Application for household supplement',
    },
    householdSupplement: {
      id: 'hs.application:household.supplement',
      defaultMessage: 'Heimilisuppbót',
      description: 'Household supplement',
    },
  }),

  pre: defineMessages({
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
    periodDescription: {
      id: 'hs.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greidda heimilisuppbót. Hægt er að sækja fyrir árið í ár og 2 ár aftur í tímann.',
      description: `english translation`,
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'hs.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
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
    additionalDocumentRequiredTitle: {
      id: 'hs.application:fileUpload.additionalDocumentRequired.title',
      defaultMessage: 'Viðbótargagna krafist',
      description: 'Additional documents required',
    },
    additionalDocumentRequiredDescription: {
      id: 'hs.application:fileUpload.additionalDocumentRequired.description#markdown',
      defaultMessage:
        'Vinsamlegast hlaðið upp viðbótargögnum til Tryggingastofnunar. Ef þú ert ekki viss hvaða viðbótagögn það eru geturu séð það í [stafræna pósthólfinu þínu](https://island.is/minarsidur/postholf). Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Please submit additional documents for the Social Insurance Administration. If you are not sure which additional documents you should submit, you can see it in [your inbox on My Pages](https://island.is/minarsidur/postholf). Note that the document must be in .pdf format.',
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
    cancelButton: {
      id: 'hs.application:cancel.button',
      defaultMessage: 'Hætta við',
      description: 'Cancel',
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
}

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
