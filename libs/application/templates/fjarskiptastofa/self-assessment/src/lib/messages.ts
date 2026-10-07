import { defineMessages } from 'react-intl'

export const m = {
  application: defineMessages({
    name: {
      id: 'fjs.sa.application:name',
      defaultMessage: 'Sjálfsmat á net- og upplýsingaöryggi',
      description: 'Application name',
    },
    institution: {
      id: 'fjs.sa.application:institution',
      defaultMessage: 'Fjarskiptastofa',
      description: 'Application institution',
    },
  }),
  prerequisites: defineMessages({
    tabTitle: {
      id: 'fjs.sa.application:prerequisites.tab.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Prerequisites tab title',
    },
    title: {
      id: 'fjs.sa.application:prerequisites.title',
      defaultMessage: 'Inngangur',
      description: 'Prerequisites section title',
    },
    intro: {
      id: 'fjs.sa.application:prerequisites.intro#markdown',
      defaultMessage:
        'Rekstraraðilar nauðsynlegrar þjónustu á Íslandi þurfa að fylla út sjálfsmat á þroskastigi netöryggis og senda Fjarskiptastofu. Rafræn innsending sjálfsmats á Ísland.is er fjármögnuð m.a. af Evrópusambandinu og spurningalistinn byggir á leiðbeiningum frá Netöryggisstofnun Evrópu (ENISA).',
      description: 'Prerequisites intro',
    },
    identityTitle: {
      id: 'fjs.sa.application:prerequisites.identity.title',
      defaultMessage: 'Upplýsingar um fyrirtæki',
      description: 'Identity provider title',
    },
    identitySubTitle: {
      id: 'fjs.sa.application:prerequisites.identity.subtitle',
      defaultMessage:
        'Nafn og kennitala fyrirtækis eru sótt til að auðkenna umsækjanda.',
      description: 'Identity provider subtitle',
    },
    userProfileTitle: {
      id: 'fjs.sa.application:prerequisites.userProfile.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'User profile provider title',
    },
    userProfileSubTitle: {
      id: 'fjs.sa.application:prerequisites.userProfile.subtitle',
      defaultMessage:
        'Samskiptaupplýsingar eru sóttar af Mínum síðum svo hægt sé að hafa samband vegna matsins.',
      description: 'User profile provider subtitle',
    },
    checkboxLabel: {
      id: 'fjs.sa.application:prerequisites.checkbox',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað.',
      description: 'Consent checkbox label',
    },
    submit: {
      id: 'fjs.sa.application:prerequisites.submit',
      defaultMessage: 'Hefja sjálfsmat',
      description: 'Prerequisites submit button',
    },
  }),
  notAllowed: defineMessages({
    title: {
      id: 'fjs.sa.application:notAllowed.title',
      defaultMessage: 'Sjálfsmat er einungis fyrir fyrirtæki',
      description: 'Not allowed title',
    },
    description: {
      id: 'fjs.sa.application:notAllowed.description',
      defaultMessage:
        'Þetta sjálfsmat er einungis aðgengilegt fyrirtækjum. Til að halda áfram þarftu að skrá þig inn fyrir hönd fyrirtækis með prókúru.',
      description: 'Not allowed description',
    },
  }),
  shared: defineMessages({
    answerYes: {
      id: 'fjs.sa.application:shared.answer.yes',
      defaultMessage: 'Já',
      description: 'Assessment answer: yes',
    },
    answerInAdoption: {
      id: 'fjs.sa.application:shared.answer.inAdoption',
      defaultMessage: 'Í innleiðingu',
      description: 'Assessment answer: in adoption',
    },
    answerInProgress: {
      id: 'fjs.sa.application:shared.answer.inProgress',
      defaultMessage: 'Í vinnslu',
      description: 'Assessment answer: in progress',
    },
    answerNo: {
      id: 'fjs.sa.application:shared.answer.no',
      defaultMessage: 'Nei',
      description: 'Assessment answer: no',
    },
  }),
  companyInfo: defineMessages({
    sectionTitle: {
      id: 'fjs.sa.application:companyInfo.section.title',
      defaultMessage: 'Upplýsingar um fyrirtæki',
      description: 'Company info section title',
    },
    description: {
      id: 'fjs.sa.application:companyInfo.description',
      defaultMessage: 'Yfirfarðu og staðfestu samskiptaupplýsingar fyrirtækis.',
      description: 'Company info description',
    },
    companyName: {
      id: 'fjs.sa.application:companyInfo.companyName',
      defaultMessage: 'Nafn fyrirtækis',
      description: 'Company name label',
    },
    nationalId: {
      id: 'fjs.sa.application:companyInfo.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National id label',
    },
    contactName: {
      id: 'fjs.sa.application:companyInfo.contactName',
      defaultMessage: 'Nafn tengiliðs',
      description: 'Contact name label',
    },
    email: {
      id: 'fjs.sa.application:companyInfo.email',
      defaultMessage: 'Netfang',
      description: 'Email label',
    },
    phone: {
      id: 'fjs.sa.application:companyInfo.phone',
      defaultMessage: 'Símanúmer',
      description: 'Phone label',
    },
  }),
  assessment: defineMessages({
    sectionTitle: {
      id: 'fjs.sa.application:assessment.section.title',
      defaultMessage: 'Sjálfsmat',
      description: 'Assessment section title',
    },
    title: {
      id: 'fjs.sa.application:assessment.title',
      defaultMessage: 'Sjálfsmat á net- og upplýsingaöryggi',
      description: 'Assessment screen title',
    },
    description: {
      id: 'fjs.sa.application:assessment.description',
      defaultMessage:
        'Svaraðu spurningunum í hverjum flokki. Þú getur skipt á milli flokka efst á síðunni.',
      description: 'Assessment screen description',
    },
    loading: {
      id: 'fjs.sa.application:assessment.loading',
      defaultMessage: 'Sæki spurningar...',
      description: 'Assessment loading text',
    },
    loadError: {
      id: 'fjs.sa.application:assessment.loadError',
      defaultMessage:
        'Ekki tókst að sækja spurningar frá Fjarskiptastofu. Reyndu aftur síðar.',
      description: 'Assessment load error text',
    },
    requiredError: {
      id: 'fjs.sa.application:assessment.requiredError',
      defaultMessage: 'Svaraðu öllum spurningum áður en þú heldur áfram.',
      description: 'Assessment required error text',
    },
    remarkLabel: {
      id: 'fjs.sa.application:assessment.remark.label',
      defaultMessage: 'Skýring',
      description: 'Assessment remark label',
    },
    remarkPlaceholder: {
      id: 'fjs.sa.application:assessment.remark.placeholder',
      defaultMessage:
        'Athugasemdir, nánari upplýsingar, slóð eða vísun í skjal',
      description: 'Assessment remark placeholder',
    },
    progressLabel: {
      id: 'fjs.sa.application:assessment.progress.label',
      defaultMessage: '{answered} af {total} spurningum svarað',
      description: 'Assessment per-category progress label',
    },
    categoryLabel: {
      id: 'fjs.sa.application:assessment.category.label',
      defaultMessage: 'Flokkur',
      description: 'Assessment category selector label',
    },
    statusUnanswered: {
      id: 'fjs.sa.application:assessment.status.unanswered',
      defaultMessage: 'Ósvarað',
      description: 'Assessment question status pill: not yet answered',
    },
    nextQuestion: {
      id: 'fjs.sa.application:assessment.nextQuestion',
      defaultMessage: 'Næsta spurning',
      description: 'Button that closes the current question and opens the next',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'fjs.sa.application:overview.section.title',
      defaultMessage: 'Samantekt',
      description: 'Overview section title',
    },
    title: {
      id: 'fjs.sa.application:overview.title',
      defaultMessage: 'Samantekt',
      description: 'Overview title',
    },
    description: {
      id: 'fjs.sa.application:overview.description',
      defaultMessage:
        'Vinsamlegast farðu yfir svörin hér að neðan og staðfestu að réttar upplýsingar hafi verið gefnar upp áður en þú sendir gögnin inn.',
      description: 'Overview description',
    },
    submit: {
      id: 'fjs.sa.application:overview.submit',
      defaultMessage: 'Senda sjálfsmat',
      description: 'Overview submit button',
    },
    confirmation: {
      id: 'fjs.sa.application:overview.confirmation',
      defaultMessage:
        'Ég staðfesti að öll svör og skýringar eru samkvæmt bestu vitund',
      description: 'Overview: confirmation checkbox before submitting',
    },
    errorTitle: {
      id: 'fjs.sa.application:overview.errorTitle',
      defaultMessage: 'Ekki er hægt að senda sjálfsmatið',
      description: 'Overview: title of the error shown on a blocked submit',
    },
    incompleteHint: {
      id: 'fjs.sa.application:overview.incompleteHint',
      defaultMessage:
        'Eftirfarandi flokkar eiga ósvaraðar spurningar eða skýringar sem vantar:',
      description:
        'Overview: intro above the list of categories still missing answers',
    },
    goToCategory: {
      id: 'fjs.sa.application:overview.goToCategory',
      defaultMessage: 'Skoða',
      description:
        'Overview: button next to an incomplete category to jump back to it',
    },
    confirmationRequired: {
      id: 'fjs.sa.application:overview.confirmationRequired',
      defaultMessage:
        'Staðfesta þarf að öll svör og skýringar séu samkvæmt bestu vitund áður en hægt er að senda sjálfsmatið.',
      description:
        'Overview: shown when the confirmation checkbox is not ticked on submit',
    },
    statusDone: {
      id: 'fjs.sa.application:overview.status.done',
      defaultMessage: 'Lokið',
      description: 'Overview category status pill: all questions answered',
    },
    statusInProgress: {
      id: 'fjs.sa.application:overview.status.inProgress',
      defaultMessage: 'Í vinnslu',
      description: 'Overview category status pill: some questions answered',
    },
    statusNotStarted: {
      id: 'fjs.sa.application:overview.status.notStarted',
      defaultMessage: 'Ekki hafið',
      description: 'Overview category status pill: no questions answered',
    },
    columnQuestion: {
      id: 'fjs.sa.application:overview.column.question',
      defaultMessage: 'Spurning',
      description: 'Overview table column: question',
    },
    columnRemark: {
      id: 'fjs.sa.application:overview.column.remark',
      defaultMessage: 'Skýring',
      description: 'Overview table column: remark/explanation',
    },
    columnAnswer: {
      id: 'fjs.sa.application:overview.column.answer',
      defaultMessage: 'Svar',
      description: 'Overview table column: answer',
    },
    editQuestion: {
      id: 'fjs.sa.application:overview.editQuestion',
      defaultMessage: 'Breyta svari',
      description: 'Overview table: edit-answer button label',
    },
    notAnswered: {
      id: 'fjs.sa.application:overview.notAnswered',
      defaultMessage: 'Ekki svarað',
      description: 'Overview table: shown in the answer column when unanswered',
    },
    missingDescription: {
      id: 'fjs.sa.application:overview.missingDescription',
      defaultMessage: 'Skýringu vantar',
      description:
        'Overview table: shown in the remark column when no explanation is provided',
    },
    openAll: {
      id: 'fjs.sa.application:overview.openAll',
      defaultMessage: 'Opna allt',
      description: 'Overview: expand all categories button',
    },
    closeAll: {
      id: 'fjs.sa.application:overview.closeAll',
      defaultMessage: 'Loka öllu',
      description: 'Overview: collapse all categories button',
    },
  }),
  results: defineMessages({
    sectionTitle: {
      id: 'fjs.sa.application:results.section.title',
      defaultMessage: 'Niðurstaða',
      description: 'Preliminary findings section title',
    },
    title: {
      id: 'fjs.sa.application:results.title',
      defaultMessage: 'Bráðabirgðaniðurstöður',
      description: 'Preliminary findings screen title',
    },
    completedTitle: {
      id: 'fjs.sa.application:results.completed.title',
      defaultMessage: 'Sjálfsmati lokið',
      description: 'Results screen header title',
    },
    interpetationTitle: {
      id: 'fjs.sa.application:results.interpetation.title',
      defaultMessage: 'Túlkun',
      description: 'Interpretation section title',
    },
    referenceNumber: {
      id: 'fjs.sa.application:results.referenceNumber',
      defaultMessage: 'Tilvísunarnúmer',
      description: 'Results screen reference number label',
    },
    description: {
      id: 'fjs.sa.application:results.description',
      defaultMessage:
        'Niðurstöðurnar hér fyrir neðan eru til bráðabirgða og settar fram með fyrirvara um endanlega yfirferð sérfræðinga Fjarskiptastofu.',
      description: 'Preliminary findings description',
    },

    successTitle: {
      id: 'fjs.sa.application:results.success.title',
      defaultMessage: 'Sjálfmat hefur verið sent til Fjarskiptastofu',
      description: 'Success alert title for preliminary findings',
    },
    successMessage: {
      id: 'fjs.sa.application:results.success.message',
      defaultMessage:
        'Svör við sjálfsmati frá {companyName} hafa verið send með öruggum hætti til Fjarskiptastofu. Við mælum með að hlaða niður afriti af niðurstöðunum og svörunum sem voru send hér fyrir neðan.',
      description: 'Success alert message for preliminary findings',
    },
    overallScoreLabel: {
      id: 'fjs.sa.application:results.overallScore.label',
      defaultMessage: 'Meðaltal',
      description: 'Preliminary findings overall score label',
    },
    categoryColumn: {
      id: 'fjs.sa.application:results.column.category',
      defaultMessage: 'Flokkur',
      description: 'Preliminary findings table column: category',
    },
    scoreColumn: {
      id: 'fjs.sa.application:results.column.score',
      defaultMessage: 'Stig',
      description: 'Preliminary findings table column: score',
    },
    unavailableTitle: {
      id: 'fjs.sa.application:results.unavailable.title',
      defaultMessage: 'Niðurstöður ekki tiltækar',
      description: 'Shown when the preliminary findings could not be loaded',
    },
    unavailableMessage: {
      id: 'fjs.sa.application:results.unavailable.message',
      defaultMessage:
        'Ekki tókst að sækja bráðabirgðaniðurstöður sjálfsmatsins. Fjarskiptastofa hefur engu að síður móttekið svörin.',
      description:
        'Message shown when the preliminary findings could not be loaded',
    },
    nextStepsTitle: {
      id: 'fjs.sa.application:results.nextSteps.title',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Results screen: what happens next heading',
    },
    nextStepsBullet1: {
      id: 'fjs.sa.application:results.nextSteps.bullet1',
      defaultMessage:
        'Fjarskiptastofa mun kalla eftir gögnum til að sýna fram á réttleika svaranna.',
      description: 'Results screen: what happens next, first bullet',
    },
    nextStepsBullet2: {
      id: 'fjs.sa.application:results.nextSteps.bullet2',
      defaultMessage:
        'Að yfirferð lokinni skilar Fjarskiptastofa formlegri niðurstöðu með mati á hverjum flokki og heildarniðurstöðu ásamt ábendingum um úrbætur.',
      description: 'Results screen: what happens next, second bullet',
    },
    pdfTitle: {
      id: 'fjs.sa.application:results.pdf.title',
      defaultMessage: 'Niðurstöður á PDF formi',
      description: 'Results screen: PDF download box title',
    },
    pdfDescription: {
      id: 'fjs.sa.application:results.pdf.description',
      defaultMessage:
        'Við hvetjum þig til að hlaða niður afriti af þessum gögnum.',
      description: 'Results screen: PDF download box description',
    },
    pdfDeletionWarning: {
      id: 'fjs.sa.application:results.pdf.deletionWarning',
      defaultMessage:
        'Svörunum verður <b>eytt eftir 4 klukkustundir</b> af öryggisástæðum.',
      description: 'Results screen: PDF download box deletion warning',
    },
    pdfDownloadButton: {
      id: 'fjs.sa.application:results.pdf.downloadButton',
      defaultMessage: 'Hlaða niður',
      description: 'Results screen: PDF download button label',
    },
  }),
  conclusion: defineMessages({
    sectionTitle: {
      id: 'fjs.sa.application:conclusion.section.title',
      defaultMessage: 'Staðfesting',
      description: 'Conclusion section title',
    },
    alertTitle: {
      id: 'fjs.sa.application:conclusion.alert.title',
      defaultMessage: 'Sjálfsmat hefur verið sent',
      description: 'Conclusion alert title',
    },
    alertMessage: {
      id: 'fjs.sa.application:conclusion.alert.message',
      defaultMessage:
        'Fjarskiptastofa hefur móttekið sjálfsmat fyrirtækisins. Þú getur nálgast afrit af svörunum á Mínum síðum.',
      description: 'Conclusion alert message',
    },
    expandableHeader: {
      id: 'fjs.sa.application:conclusion.expandable.header',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion expandable header',
    },
    expandableDescription: {
      id: 'fjs.sa.application:conclusion.expandable.description#markdown',
      defaultMessage:
        'Fjarskiptastofa fer yfir sjálfsmatið og hefur samband ef frekari upplýsinga er þörf.',
      description: 'Conclusion expandable description',
    },
  }),
}
