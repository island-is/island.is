import { defineMessages } from 'react-intl'

export const m = defineMessages({
  /* Intro section */
  introTitle: {
    id: 'pa.application:intro.title',
    defaultMessage: 'Inngangur',
    description: 'Some description',
  },

  /* Data collection section */
  dataCollectionTitle: {
    id: 'pa.application:dataCollection.dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  dataCollectionSubtitle: {
    id: 'pa.application:dataCollection.dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'Some description',
  },
  dataCollectionCheckboxLabel: {
    id: 'pa.application:dataCollection.dataCollectionCheckboxLabel',
    defaultMessage: 'Ég skil að ofangreind gögn verði sótt rafrænt',
    description: 'Some description',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'pa.application:dataCollection.dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'Some description',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'pa.application:dataCollection.dataCollectionNationalRegistrySubtitle',
    defaultMessage:
      'Upplýsingar frá Þjóðskrá um nafn, kennitölu og lögheimili.',
    description: 'Some description',
  },
  dataCollectionIdentityDocumentTitle: {
    id: 'cr.application:dataCollection.dataCollectionIdentityDocumentTitle',
    defaultMessage: 'Skilríkjaskrá',
    description: 'Identity document provider title',
  },
  dataCollectionIdentityDocumentSubtitle: {
    id: 'pa.application:dataCollection.dataCollectionIdentityDocumentSubtitle',
    defaultMessage:
      'Til þess að auðvelda þér umsóknarferlið sækjum við núverandi skráningu þína í skílríkjaskrá Þjóðskrár, ásamt börnum sem þú hefur forsjá yfir.',
    description: 'Identity document provider subtitle',
  },

  /* Select passport section */
  selectPassportSectionTitle: {
    id: 'pa.application:selectPassport.title',
    defaultMessage: 'Vegabréfin þín',
    description: 'Some description',
  },
  selectPassportSectionDescription: {
    id: 'pa.application:selectPassport.description',
    defaultMessage:
      'Þú getur sótt um nýtt vegabréf fyrir þig og eftirfarandi einstaklinga í þinni umsjón. Veldu þann einstakling sem þú vilt hefja umsókn fyrir og haltu síðan áfram í næsta skref.',
    description: 'Some description',
  },
  passportNumber: {
    id: 'pa.application:selectPassport.passportNumber',
    defaultMessage: 'Vegabréfsnúmer:',
    description: 'Some description',
  },
  validTag: {
    id: 'pa.application:selectPassport.validTag',
    defaultMessage: 'Í gildi til ',
    description: 'Some description',
  },
  noPassport: {
    id: 'pa.application:selectPassport.noPassport',
    defaultMessage: 'Vegabréf ekki til',
    description: 'Some description',
  },
  expiredTag: {
    id: 'pa.application:selectPassport.expiredTag',
    defaultMessage: 'Útrunnið',
    description: 'Some description',
  },
  orderedTag: {
    id: 'pa.application:selectPassport.orderedTag',
    defaultMessage: 'Í pöntun',
    description: 'Some description',
  },
  children: {
    id: 'pa.application:selectPassport.childrenHeader',
    defaultMessage: 'Börn',
    description: 'Some description',
  },

  /* Information Section */
  formName: {
    id: 'pa.application:form.name',
    defaultMessage: 'Umsókn um vegabréf',
    description: 'Some description',
  },
  infoTitle: {
    id: 'pa.application:personalInfo.infoTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  personalInfoSubtitle: {
    id: 'pa.application:personalInfo.personalInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir þínar upplýsingar og gakktu úr skugga um að þær séu réttar.',
    description: 'Some description',
  },
  name: {
    id: 'pa.application:personalInfo.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  infoText: {
    id: 'pa.application:personalInfo.infoText',
    defaultMessage: 'Glatað vegabréf',
    description: 'Some description',
  },
  infoTextDescription: {
    id: 'pa.application:personalInfo.infoTextDescription',
    defaultMessage:
      'Vegabréf sem tilkynnt eru glötuð eru skráð inn í Schengen og Interpol upplýsingakerfin og eru þar með ónothæf. Tilkynna skal lögreglu, Þjóðskrá Íslands eða sendimönnum Íslands erlendis þegar í stað ef vegabréf glatast, og gera sérstaka grein fyrir afdrifum þess.\n\n Einungis er hægt að tilkynna um sitt eigið vegabréf og þeirra barna sem tilkynnandi hefur forsjá yfir.',
    description: 'Some description',
  },
  statusTitle: {
    id: 'pa.application:personalInfo.statusTitle',
    defaultMessage: 'Hvað gerðist við vegabréfið',
    description: 'Some description',
  },
  statusLost: {
    id: 'pa.application:personalInfo.statusLost',
    defaultMessage: 'Týnt',
    description: 'Some description',
  },
  statusStolen: {
    id: 'pa.application:personalInfo.statusStolen',
    defaultMessage: 'Stolið',
    description: 'Some description',
  },
  commentTitle: {
    id: 'pa.application:personalInfo.commentTitle',
    defaultMessage: 'Hvað og hvenær glataðist vegabréfið?',
    description: 'Some description',
  },
  commentPlaceholder: {
    id: 'pa.application:personalInfo.commentPlaceholder',
    defaultMessage: 'Lýstu hvar og hvernig vegabréfið glataðist',
    description: 'Some description',
  },

  /* Overview Section */
  overview: {
    id: 'pa.application:overview.title',
    defaultMessage: 'Yfirlit',
    description: 'Some description',
  },
  overviewSectionTitle: {
    id: 'pa.application:overviewSection.title',
    defaultMessage: 'Yfirlit yfir umsókn',
    description: 'Some description',
  },
  overviewDescription: {
    id: 'pa.application:overview.description',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að réttar upplýsingar hafi verið gefnar.',
    description: 'Some description',
  },
  currentPassportStatus: {
    id: 'pa.application:overview.currentPassport',
    defaultMessage: 'Staða núverandi vegabréfs',
    description: 'Some description',
  },
  currentPassportExpiration: {
    id: 'pa.application:overview.currentPassport.expiration',
    defaultMessage: 'Í gildi til',
    description: 'Some description',
  },
  authenticationType: {
    id: 'pa.application:overview.authenticationType',
    defaultMessage: 'Tegund skilríkja',
    description: 'Some description',
  },
  willBringPassport: {
    id: 'pa.application:overview.willBringPassport',
    defaultMessage: 'Ég mun mæta með núverandi vegabréf í myndatökuna.',
    description: 'Some description',
  },
  proceedToPayment: {
    id: 'pa.application:payment.proceedToPayment',
    defaultMessage: 'Greiða',
    description: 'Some description',
  },

  /* Done Section */
  actionCardDoneTag: {
    id: 'pa.application:actionCard.done',
    defaultMessage: 'Móttekin',
    description: 'Some description',
  },
  applicationCompleteTitle: {
    id: 'pa.application:complete.title',
    defaultMessage: 'Til greiðslu',
    description: 'Some description',
  },
  applicationCompletePassport: {
    id: 'pa.application:complete.passport',
    defaultMessage: 'Vegabréf',
    description: 'Some description',
  },
  applicationCompleteTotal: {
    id: 'pa.application:complete.total',
    defaultMessage: 'Samtals',
    description: 'Some description',
  },
  applicationComplete: {
    id: 'pa.application:complete',
    defaultMessage: 'Umsókn staðfest',
    description: 'Some description',
  },
  applicationCompleteDescriptionText: {
    id: 'pa.application:complete.descriptionText',
    defaultMessage:
      'Umsókn þín um vegabréf fyrir **{name}** hefur verið móttekin.',
    description: 'Some description',
  },
  applicationCompleteNumber: {
    id: 'pa.application:complete.number',
    defaultMessage: 'Númer umsóknar',
    description: 'Some description',
  },
  applicationCompleteNextSteps: {
    id: 'pa.application:complete.nextSteps',
    defaultMessage: 'Næstu skref',
    description: 'Some description',
  },
  applicationCompleteNextStepsDescription: {
    id: 'pa.application:complete.nextSteps.description#markdown',
    defaultMessage: `* Fara í myndatöku á næsta afgreiðslustað sýslumanns.\\n\\n * Þú færð senda tilkynningu á Mínar síður þegar vegabréfið er tilbúið og hægt er að sækja það á þann afhendingarstað sem þú valdir.`,
    description: 'Some description',
  },
  applicationCompleteNextStepsDescriptionParentA: {
    id: 'pa.application:complete.nextSteps.descriptionParentA#markdown',
    defaultMessage: `* Þegar forsjáraðili hefur samþykkt umsóknina mun berast staðfesting í pósthólf ykkar á Ísland.is.\\n\\n * Forsjáraðili skal mæta með einstaklingi í myndatöku á næsta afgreiðslustað sýslumanns og hafa meðferðis núgildandi vegabréf eða löggild skilríki með mynd sé vegabréfið glatað.\\n\\n * Tilkynning mun berast á Mínar síður á Ísland.is þegar vegabréfið er tilbúið auk upplýsinga um hvenær hægt verður að sækja það á þann afhendingarstað sem tilgreindur var í umsóknarferlinu.`,
    description: 'Some description',
  },
  applicationCompleteNextStepsDescriptionPersonalApplication: {
    id:
      'pa.application:complete.nextSteps.descriptionPersonalApplication#markdown',
    defaultMessage: `* Fara í myndatöku á næsta afgreiðslustað sýslumanns.\\n\\n * Þú færð senda tilkynningu á Mínar síður þegar vegabréfið er tilbúið og hægt er að sækja það á þann afhendingarstað sem þú valdir.`,
    description: 'Some description',
  },
})
