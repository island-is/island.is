import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const childPensionFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'cp.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'cp.application:applicationTitle',
      defaultMessage: 'Umsókn um barnalífeyri',
      description: 'Application for child pension',
    },
    formTitle: {
      id: 'cp.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'cp.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'cp.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'cp.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSection: {
      id: 'cp.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    externalDataDescription: {
      id: 'cp.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'english translation',
    },
    checkboxProvider: {
      id: 'cp.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileTitle: {
      id: 'cp.application:userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
      description: 'english translation',
    },
    userProfileSubTitle: {
      id: 'cp.application:userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar á mínar síður á Ísland.is.',
      description: 'english translation',
    },
    registryIcelandTitle: {
      id: 'cp.application:registry.iceland.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'english translation',
    },
    registryIcelandSubTitle: {
      id: 'cp.application:registry.iceland.subtitle',
      defaultMessage:
        'Upplýsingar um þig, maka og börn. Upplýsingar um búsetu.',
      description: 'english translation',
    },
    trTitle: {
      id: 'cp.application:tr.title',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'english translation',
    },
    trDescription: {
      id: 'cp.application:tr.description#markdown',
      defaultMessage:
        'TR sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar. Ef við á þá hefur TR heimild að ná í upplýsingar frá öðrum stofnunum. Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar [hér](https://www.tr.is/tryggingastofnun/personuvernd). Ef tekjur eða aðrar aðstæður þínar breytast verður þú að láta TR vita þar sem það getur haft áhrif á greiðslur þínar.',
      description: 'english translation',
    },
    startApplication: {
      id: 'cp.application:start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'cp.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'cp.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email address and phone number',
    },
    subSectionDescription: {
      id: 'cp.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt á mínar síður á Ísland.is. Ef upplýsingarnar eru ekki réttar eða vantar setur þú þær inn hér.',
      description: 'translation',
    },
    applicantEmail: {
      id: 'cp.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'cp.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    paymentTitle: {
      id: 'cp.application:info.payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    childrenTitle: {
      id: 'cp.application:info.children.title',
      defaultMessage: 'Barn/börn',
      description: 'Child/children',
    },
    chooseChildrenTitle: {
      id: 'cp.application:info.choose.children.title',
      defaultMessage: 'Veldu barn/börn',
      description: 'Choose child/children',
    },
    chooseChildrenDescription: {
      id: 'cp.application:info.choose.children.description',
      defaultMessage:
        'Samkvæmt uppflettingu í þjóðskrá hefur þú forsjá með eftirfarandi barni/börnum. Ef barn er ekki með sama lögheimili og þú verður þú að skila inn skjali sem staðfestir að þú sért með barn/börn á framfæri. Veldu barn/börn sem þú vilt sækja um barnalífeyri fyrir. Ef þú vilt bæta við barni getur þú gert það aftar í ferlinu.',
      description: 'english translation',
    },
    registerChildTitle: {
      id: 'cp.application:info.register.child.title',
      defaultMessage: 'Skráning barns á framfæri',
      description: 'english translation',
    },
    registerChildChildDoesNotHaveNationalId: {
      id: 'cp.application:info.register.child.child.does.not.have.national.id',
      defaultMessage: 'Barn ekki með íslenska kennitölu',
      description: 'Child does not have an Icelandic national ID',
    },
    registerChildNationalId: {
      id: 'cp.application:info.register.child.national.id',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    registerChildBirthDate: {
      id: 'cp.application:info.register.child.birth.date',
      defaultMessage: 'Fæðingardagur',
      description: 'Date of birth',
    },
    registerChildBirthDatePlaceholder: {
      id: 'cp.application:info.register.child.birth.date.placeholder',
      defaultMessage: 'Veldu fæðingardag',
      description: 'Choose date of birth',
    },
    registerChildFullName: {
      id: 'cp.application:info.register.child.full.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },

    registerChildRepeaterTitle: {
      id: 'cp.application:info.register.child.repeater.title',
      defaultMessage: 'Börn á framfærslu',
      description: 'english translation',
    },
    registerChildRepeaterDescription: {
      id: 'cp.application:info.register.child.repeater.description',
      defaultMessage: 'Barn/börn sem þú ert með á framfærslu.',
      description: 'english translation',
    },
    addChildButton: {
      id: 'cp.application:info.add.child.button',
      defaultMessage: 'Bæta við barni',
      description: 'Add child',
    },
    registerChildRepeaterTableHeaderName: {
      id: 'cp.application:info.register.child.repeater.table.header.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    registerChildRepeaterTableHeaderId: {
      id: 'cp.application:info.register.child.repeater.table.header.id',
      defaultMessage: 'Kennitala / fæðingardagur',
      description: 'National ID',
    },
    registerChildRepeaterTableHeaderReasonOne: {
      id: 'cp.application:info.register.child.repeater.table.header.reason.one',
      defaultMessage: 'Ástæða 1',
      description: 'Reason 1',
    },
    registerChildRepeaterTableHeaderReasonTwo: {
      id: 'cp.application:info.register.child.repeater.table.header.reason.two',
      defaultMessage: 'Ástæða 2',
      description: 'Reason 2',
    },

    childPensionReasonTitle: {
      id: 'cp.application:info.child.pension.reason.title',
      defaultMessage: 'Veldu ástæðu',
      description: 'english translation',
    },
    childPensionReasonDescription: {
      id: 'cp.application:info.child.pension.reason.description',
      defaultMessage: 'Vinsamlegast veldu ástæðu fyrir barnalífeyri.',
      description: 'english translation',
    },
    childPensionReasonParentHasPensionOrDisabilityAllowance: {
      id: 'cp.application:info.child.pension.reason.parentHasPensionOrDisabilityAllowance',
      defaultMessage: 'Innskráð foreldri er lífeyrisþegi eða með örorkustyrk',
      description: 'english translation',
    },
    childPensionReasonParentIsDead: {
      id: 'cp.application:info.child.pension.reason.parentIsDead',
      defaultMessage: 'Foreldri er látið',
      description: 'english translation',
    },
    childPensionReasonChildIsFatherless: {
      id: 'cp.application:info.child.pension.reason.childIsFatherless',
      defaultMessage: 'Barn er ófeðrað',
      description: 'english translation',
    },
    childPensionReasonParentsPenitentiary: {
      id: 'cp.application:info.child.pension.reason.parentsPenitentiary',
      defaultMessage: 'Refsivist foreldris',
      description: 'english translation',
    },

    childPensionReasonParentIsDeadTitle: {
      id: 'cp.application:info.child.pension.reason.parentIsDead.title',
      defaultMessage: 'Foreldri',
      description: 'english translation',
    },
    childPensionReasonOtherParentIsDeadTitle: {
      id: 'cp.application:info.child.pension.reason.other.parentIsDead.title',
      defaultMessage: 'Hitt foreldri',
      description: 'english translation',
    },
    childPensionParentDoesNotHaveNationalId: {
      id: 'cp.application:info.child.pension.parent.does.not.have.national.id',
      defaultMessage: 'Foreldri ekki með íslenska kennitölu',
      description: 'Parent does not have an Icelandic national ID',
    },
    childPensionParentIsDeadNationalId: {
      id: 'cp.application:info.child.pension.parentIsDead.national.id',
      defaultMessage: 'Kennitala látins foreldris',
      description: 'english translation',
    },
    childPensionParentBirthDate: {
      id: 'cp.application:info.child.pension.parent.birth.date',
      defaultMessage: 'Fæðingardagur látins foreldris',
      description: 'english translation',
    },
    childPensionNameAlertTitle: {
      id: 'cp.application:info.child.pension.name.alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
    childPensionNameAlertMessage: {
      id: 'cp.application:info.child.pension.name.alert.message',
      defaultMessage: 'Ekki tókst að sækja nafn útfrá kennitölu.',
      // defaultMessage: 'Villa kom upp við að sækja nafn útfrá kennitölu. Vinsamlegast prófaðu aftur síðar',
      description: 'No name found for national id in national registry',
    },

    childPensionAddChildQuestion: {
      id: 'cp.application:info.child.pension.add.child.question',
      defaultMessage: 'Viltu bæta við barni á framfæri?',
      description: 'english translation',
    },

    childPensionReasonParentIsDeadAddParent: {
      id: 'cp.application:info.child.pension.reason.parentIsDead.addParent',
      defaultMessage: 'Bæta við foreldri',
      description: 'Add parent',
    },
    childPensionReasonParentIsDeadRemoveParent: {
      id: 'cp.application:info.child.pension.reason.parentIsDead.removeParent',
      defaultMessage: 'Eyða',
      description: 'Remove',
    },
    childPensionParentsPenitentiaryNationalId: {
      id: 'cp.application:info.child.pension.parentsPenitentiary.national.id',
      defaultMessage: 'Kennitala foreldris í refsivist',
      description: 'english translation',
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'cp.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    attachmentButton: {
      id: 'cp.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'cp.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'cp.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'The following document types are accepted: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'cp.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    maintenanceTitle: {
      id: 'cp.application:fileUpload.maintenance.title',
      defaultMessage: 'Staðfesting á framfærslu',
      description: 'english translation',
    },
    maintenanceDescription: {
      id: 'cp.application:fileUpload.maintenance.description',
      defaultMessage:
        'Hér fyrir neðan getur þú skilað staðfestingu á að þú sért með barn á framfærslu. Vinsamlegast gerðu grein fyrir barninu og ykkar tenglsum í skjalinu. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Below you can submit confirmation that you have a dependent child. Please state your relationship to the child in the document. Note that the document must be in .pdf format.',
    },
    notLivesWithApplicantTitle: {
      id: 'cp.application:fileUpload.not.lives.with.applicant.title',
      defaultMessage: 'Samningur um meðlag',
      description: 'english translation',
    },
    notLivesWithApplicantDescription: {
      id: 'cp.application:fileUpload.not.lives.with.applicant.description',
      // TODO: Texti úr ellilífeyris umsókn (ætti frekar að nota texta úr Figma?)
      defaultMessage:
        'Hér getur þú skilað meðlagsúrskurði eða samningi frá sýslumanni vegna barns/barna sem er ekki með lögheimili hjá þér. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Below you can submit a child support order or agreement from the District Commissioner for a child/children who do not have legal residence with you. Note that the document must be in .pdf format.',
    },
    additionalDocumentRequiredTitle: {
      id: 'cp.application:fileUpload.additionalDocumentRequired.title',
      defaultMessage: 'Viðbótargögn krafist',
      description: 'Additional attachments required',
    },
    additionalDocumentRequiredDescription: {
      id: 'cp.application:fileUpload.additionalDocumentRequired.description',
      defaultMessage:
        'Vinsamlegast hlaðið upp viðbótargögnum til Tryggingastofnunar. Ef þú ert ekki viss hvaða viðbótagögn það eru geturu séð það í pósthólfinu þínu. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description: 'english translation',
    },
    additionalDocumentRequiredSubmit: {
      id: 'cp.application:fileUpload.additionalDocumentRequired.submit',
      defaultMessage: 'Senda inn',
      description: 'Submit',
    },
    additionalFileTitle: {
      id: 'cp.application:fileUpload.additionalFile.title',
      defaultMessage: 'Viðbótargögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'cp.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangra upplýsinga. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
  }),

  payment: defineMessages({
    title: {
      id: 'cp.application:payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    alertTitle: {
      id: 'cp.application:payment.alert.title',
      defaultMessage: 'Til athugunar!',
      description: 'For consideration',
    },
    alertMessage: {
      id: 'cp.application:payment.alert.message',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reikning.',
      description:
        'All your payments from TR are paid into the bank account below. If you change your bank details, all your payments from the TR will be paid into that account.',
    },
    bank: {
      id: 'cp.application:payment.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
  }),

  period: defineMessages({
    periodTitle: {
      id: 'cp.application:period.title',
      defaultMessage: 'Tímabil',
      description: 'Period',
    },
    periodDescription: {
      id: 'cp.application:period.description',
      defaultMessage: 'Frá hvaða tíma er sótt um?',
      description: 'english translation',
    },
    periodInputMonth: {
      id: 'cp.application:period.input.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    periodInputMonthDefaultText: {
      id: 'cp.application:period.input.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
    periodInputYear: {
      id: 'cp.application:period.input.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    periodInputYearDefaultText: {
      id: 'cp.application:period.input.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    january: {
      id: 'cp.application:period.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'cp.application:period.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'cp.application:period.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'cp.application:period.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'cp.application:period.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'cp.application:period.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'cp.application:period.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'cp.application:period.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'cp.application:period.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'cp.application:period.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'cp.application:period.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'cp.application:period.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),

  residence: defineMessages({
    residenceHistoryTitle: {
      id: 'cp.application:residence.history.title',
      defaultMessage: 'Réttindi erlendis frá',
      description: 'english translation',
    },
    residenceHistoryDescription: {
      id: 'cp.application:residence.history.description',
      defaultMessage:
        'Samkvæmt Þjóðskrá hefur þú búið erlendis á síðast liðnum þremur árum. Greiðsla barnalífeyris getur skerst vegna búsetu erlendis utan EES. ATH ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim í Þjóðskrá.',
      description: 'english translation',
    },
    residenceHistoryCountryTableHeader: {
      id: 'cp.application:residence.history.country.table.header',
      defaultMessage: 'Land',
      description: 'Country',
    },
    residenceHistoryPeriodFromTableHeader: {
      id: 'cp.application:residence.history.period.from.table.header',
      defaultMessage: 'Tímabil frá',
      description: 'Period from',
    },
    residenceHistoryPeriodToTableHeader: {
      id: 'cp.application:residence.history.period.to.table.header',
      defaultMessage: 'Tímabil til',
      description: 'Period to',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'cp.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  confirm: defineMessages({
    title: {
      id: 'cp.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    section: {
      id: 'cp.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    description: {
      id: 'cp.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    overviewTitle: {
      id: 'cp.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    buttonEdit: {
      id: 'cp.application:button.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    name: {
      id: 'cp.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'cp.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    email: {
      id: 'cp.application:confirm.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'cp.application:confirm.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
    children: {
      id: 'cp.application:confirm.children',
      defaultMessage: 'Börn sem þú sækir um barnalífeyri fyrir',
      description: 'english translation',
    },
    bank: {
      id: 'cp.application:conformation.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
  }),

  comment: defineMessages({
    additionalInfoTitle: {
      id: 'cp.application:comment.additional.info.title',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional Information',
    },
    commentSection: {
      id: 'cp.application:comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    description: {
      id: 'cp.application:comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'If you have any comments, leave them here.',
    },
    placeholder: {
      id: 'cp.application:comment.placeholder',
      defaultMessage: 'Skrifaðu hér athugasemd',
      description: 'Your comment',
    },
  }),

  conclusionScreen: defineMessages({
    title: {
      id: 'cp.application:conclusion.screen.title',
      defaultMessage: 'Umsókn móttekin og bíður tekjuáætlunar',
      description: 'Congratulations, below are the next steps',
    },
    alertTitle: {
      id: 'cp.application:conclusionScreen.alertTitle',
      defaultMessage:
        'Umsókn um barnalífeyri hefur verið send til Tryggingastofnunar',
      description: 'english translation',
    },
    bulletList: {
      id: `cp.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til barnalífeyris.`,
      description: 'english translation',
    },
    nextStepsLabel: {
      id: 'cp.application:conclusionScreen.nextStepsLabel',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next?',
    },
    nextStepsText: {
      id: 'cp.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Hjá Tryggingastofnun verður farið yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til barnalífeyris.',
      description: 'english translation',
    },
    buttonsViewApplication: {
      id: 'cp.application:conclusionScreen.buttonsViewApplication',
      defaultMessage: 'Skoða umsókn',
      description: 'View application',
    },
  }),

  errors: defineMessages({
    phoneNumber: {
      id: 'cp.application:error.phonenumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'The phone number must be valid.',
    },
    period: {
      id: 'cp.application:error.period',
      defaultMessage: 'Tímabil þarf að vera gilt.',
      description: 'The period must be valid.',
    },
    bank: {
      id: 'cp.application:error.bank',
      defaultMessage:
        'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
      description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
    },
  }),
}

export const validatorErrorMessages = defineMessages({
  requireAnswer: {
    id: 'cp.application:require.answer',
    defaultMessage: 'Ógilt gildi',
    description: 'Invalid value',
  },
  nationalIdRequired: {
    id: 'cp.application:nationalId.required',
    defaultMessage: 'Vantar kennitölu',
    description: 'The national id is required',
  },
  nationalIdDuplicate: {
    id: 'cp.application:nationalId.duplicate',
    defaultMessage: 'Kennitala er þegar skráð.',
    description: 'National id is already registered.',
  },
  nationalIdMustBeValid: {
    id: 'cp.application:nationalId.must.be.valid',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'The national id must be valid.',
  },
  birthDateRequired: {
    id: 'cp.application:birthDate.required',
    defaultMessage: 'Vinsamlegast veldu fæðingardag.',
    description: 'Please select a date of birth.',
  },
  nameRequired: {
    id: 'cp.application:name.required',
    defaultMessage: 'Fullt nafn vantar',
    description: 'Full name missing',
  },
  registerChildNotAList: {
    id: 'cp.application:register.child.not.a.list',
    defaultMessage: 'Svar þarf að vera listi af börnum',
    description: 'Answer must be a list of children',
  },
  registerChildChildMustBeUnder18: {
    id: 'cp.application:register.child.child.must.be.under.18',
    defaultMessage: 'Barnið verður að vera yngra en 18 ára.',
    description: 'The child must be under 18 years of age.',
  },
  childPensionReason: {
    id: 'cp.application:child.pension.reason',
    defaultMessage: 'Skylda að velja einhverja ástæðu',
    description: 'Required to choose some reason',
  },
  childPensionMaxTwoReasons: {
    id: 'cp.application:child.pension.max.two.reasons',
    defaultMessage: 'Aðeins leyfilegt að velja að hámarki tvær ástæður',
    description: 'english translation',
  },
  childPensionReasonsDoNotMatch: {
    id: 'cp.application:child.pension.reasons.do.not.match',
    defaultMessage:
      'Ástæður passa ekki saman. Vinsamlegast veldu aðrar ástæður.',
    description: 'english translation',
  },
  requireAttachment: {
    id: 'cp.application:fileUpload.required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'You must upload an attachment to continue.',
  },
  childPensionNoRightsForPeriod: {
    id: 'cp.application:child.pension.no.rights.for.period',
    defaultMessage: 'Þú átt ekki rétt á barnalífeyri fyrir valið tímabil.',
    description: 'You are not entitled to child pension for the selected period.',
  },
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'cp.application:inReview.form.title',
    defaultMessage: 'Umsókn vegna barnalífeyris',
    description: 'Child pension',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'cp.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'Description of the state - draft',
  },
  applicationSent: {
    id: 'cp.application:applicationSent',
    defaultMessage: 'Umsókn send',
    description: 'History application sent',
  },
  tryggingastofnunSubmittedTitle: {
    id: 'cp.application:tryggingastofnunSubmittedTitle',
    defaultMessage: 'Umsókn hefur verið send til Tryggingastofnunnar',
    description: 'The application has been sent to Tryggingastofnunnar',
  },
  tryggingastofnunSubmittedContent: {
    id: 'cp.application:tryggingastofnunSubmittedContent',
    defaultMessage:
      'Umsóknin þín er í bið eftir yfirferð. Hægt er að breyta umsókn þar til umsókn er komin í yfirferð.',
    description: 'Application waiting for review',
  },

  tryggingastofnunInReviewTitle: {
    id: 'cp.application:tryggingastofnunInReviewTitle',
    defaultMessage: 'Verið er að fara yfir umsóknina',
    description: 'The application is being reviewed',
  },
  tryggingastofnunInReviewContent: {
    id: 'cp.application:tryggingastofnunInReviewContent',
    defaultMessage:
      'Tryggingastofnun fer núna yfir umsóknina og því getur þetta tekið nokkra daga',
    description:
      'Tryggingastofnun is currently reviewing the application, so this may take a few days',
  },

  applicationEdited: {
    id: 'cp.application:applicationEdited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
  applicationRejected: {
    id: 'cp.application:applicationRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application rejected',
  },
  applicationApproved: {
    id: 'cp.application:applicationApproved',
    defaultMessage: 'Tryggingastofnun hefur samþykkt umsóknina',
    description: 'Tryggingastofnun has accepted the application',
  },
  applicationApprovedDescription: {
    id: 'cp.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn vegna barnalífeyris hefur verið samþykkt',
    description: 'The application for child pension has been approved',
  },

  additionalDocumentRequired: {
    id: 'cp.application:additionalDocumentRequired',
    defaultMessage: 'Viðbótargögn vantar',
    description: 'Additional documents required',
  },
  additionalDocumentsAdded: {
    id: 'cp.application:additionalDocumentsAdded',
    defaultMessage: 'Viðbótargögnum bætt við',
    description: 'Additional documents added',
  },
  additionalDocumentRequiredDescription: {
    id: 'cp.application:additionalDocumentRequired.description',
    defaultMessage: 'Tryggingastofnun vantar frekari gögn vegna umsóknarinnar.',
    description: 'Description of the state - additionalDocumentRequired',
  },
  pendingTag: {
    id: 'cp.application:pending.tag',
    defaultMessage: 'Í bið',
    description: 'Pending',
  },

  applicationPending: {
    id: 'cp.application:applicationPending',
    defaultMessage: 'Umsókn í bið hjá Tryggingastofnun',
    description: 'Application pending at Tryggingastofnun',
  },
  applicationPendingDescription: {
    id: 'cp.application:applicationPendingDescription',
    defaultMessage: 'Umsókn vegna barnalífeyris hefur verið sett í bið.',
    description: 'The application for child pension has been put on hold.',
  },
})
