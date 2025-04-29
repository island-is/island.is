import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const incomePlanFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'ip.application:applicationTitle',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income Plan',
    },
  }),

  pre: defineMessages({
    formTitle: {
      id: 'ip.application:form.title',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income Plan',
    },
    isNotEligibleTitle: {
      id: 'ip.application:is.not.eligible.title',
      defaultMessage: 'Ekki er opið fyrir skráningu á tekjuáætlun',
      description: 'Registration for income plan is not open',
    },
    isNotEligibleDescription: {
      id: 'ip.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæðan fyrir því er eftirfarandi:\n* Það eru innan við 10 dagar síðan síðasta tekjuáætlun þín var tekin í vinnslu hjá Tryggingastofnun.\n\nEf þú telur það ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        '* It has been less than 10 days since your last income plan was processed by the Social Insurance Administration.\n\nIf you do not think that apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
    isNotEligibleNoActiveApplicationDescription: {
      id: 'ip.application:is.not.eligible.no.active.application.description#markdown',
      defaultMessage:
        'Ástæðan fyrir því er eftirfarandi:\n* Þú ert ekki með virka umsókn hjá Tryggingastofnun.\n\nEf þú telur það ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reason for this is the following:\n* You do not have any active applications at the Social Insurance Administration.\n\nIf you do not think that apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
    isNotEligibleClosedDescription: {
      id: 'ip.application:is.not.eligible.closed.description#markdown',
      defaultMessage:
        '* Tryggingastofnun tekur ekki við nýjum tekjuáætlum eins og er.\n\nEf þú telur það ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        '* The Social Insurance Administration is currently not accepting any new income plans.\n\nIf you do not think that apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
    contactInfoDescription: {
      id: 'ip.application:prerequisites.contact.info.description',
      defaultMessage:
        'Upplýsingar um símanúmer og netfang til að auðvelda ferlið.',
      description:
        'Information about your telephone number and email address to facilitate the process.',
    },
    incomePlanDataDescription: {
      id: 'ip.application:prerequisites.socialInsuranceAdministration.data.description',
      defaultMessage:
        'Tryggingastofnun sækir nauðsynlegar upplýsingar til úrvinnslu tekjuáætlunar, varðandi tekjur og aðrar ástæður.',
      description:
        'The Social Insurance Administration collects necessary information, regarding income and other circumstances, to process the income plan.',
    },
    checkboxProvider: {
      id: 'ip.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í ferlinu',
      description:
        'I understand that the above information will be collected during the process',
    },
    startIncomePlan: {
      id: 'ip.application:prerequisites.start.income.plan',
      defaultMessage: 'Hefja tekjuáætlun',
      description: 'Start income plan',
    },
  }),

  info: defineMessages({
    instructionsShortTitle: {
      id: 'ip.application:instructions.short.title',
      defaultMessage: 'Leiðbeiningar',
      description: 'Instructions',
    },
    temporaryCalculationTitle: {
      id: 'ip.application:temorary.calculation.title',
      defaultMessage: 'Bráðabirgðaútreikningur',
      description: 'Temporary calculation',
    },
    tableHeaderPaymentTypes: {
      id: 'ip.application:table.header.payment.type',
      defaultMessage: 'Greiðslutegundir',
      description: 'Payment types',
    },
    tableHeaderTotal: {
      id: 'ip.application:table.header.total',
      defaultMessage: 'Samtals {year}',
      description: 'Total {year}',
    },
    tableDescription: {
      id: 'ip.application:table.description',
      defaultMessage:
        'Bráðabirgðareikningi er ætlað að hjálpa umsækjendum að átta sig á mögulegum greiðslum ef breytingar verða á tekjum þeirra. Of- eða vangreiðslur eru ekki sýndar í þessum bráðabirgðaútreikningi en ef um inneign er að ræða verður hún greidd út á meðan ofgreiddar bætur bíða uppgjörs.',
      description:
        'Temporary calculation is intended to help the applicant understand possible payments if their income changes. Overpayments or underpayments are not shown in this temporary calculation, but if there is credit, it will be paid out while the overpayment is pending settlement.',
    },
    paidTableHeader: {
      id: 'ip.application:paid.table.header',
      defaultMessage: 'Útborgað',
      description: 'Paid',
    },
    assumptions: {
      id: 'ip.application:assumptions.title#markdown',
      defaultMessage:
        'Útreikningur staðgreiðslu miðast við eftirfarandi forsendur: \n* Almenna reglan er sú að greiðslur frá Tryggingastofnun eru settar í lægsta mögulega skattþrep miðað við tekjuáætlun. Hægt er að óska eftir breytingu skattþreps inni á mínum síðum TR. \n* Persónuafsláttur miðast við 100% nýtingu skattkorts',
      description:
        'Calculations of tax payments are based on the following assumptions: \n*Transl',
    },
    noPayments: {
      id: 'ip.application:no.payments',
      defaultMessage: 'Engar greiðslur samkvæmt bráðabirgðaútreikningi.',
      description: 'No payments according to temporary calculation.',
    },
    noAvailablePrerequisites: {
      id: 'ip.application:no.available.prerequisites',
      defaultMessage:
        'Engar forsendur eru til staðar til að birta bráðabirgðaútreikning fyrir {incomePlanYear}.',
      description:
        'There are no available prerequisites for displaying a temporary calculation for {incomePlanYear}.',
    },
  }),

  incomePlan: defineMessages({
    currentIncomePlanDescription: {
      id: 'ip.application:income.plan.current.income.plandescription',
      defaultMessage:
        'Hér fyrir neðan er sú tekjuáætlun sem nú er í gildi fyrir árið {incomePlanYear}. Hér getur þú breytt upphæðum, fjarlægt tekjur og/eða bætt við tekjum sem ekki er búið að setja inn.',
      description: 'english translation',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'ip.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    title: {
      id: 'ip.application:confirmation.title',
      defaultMessage: 'Senda inn tekjuáætlun',
      description: 'Review and submit',
    },
    description: {
      id: 'ip.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir tekjuáætlunina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
  }),

  conclusionScreen: defineMessages({
    receivedTitle: {
      id: 'ip.application:conclusionScreen.receivedTitle',
      defaultMessage: 'Tekjuáætlun móttekin',
      description: 'Income plan received',
    },
    alertTitle: {
      id: 'ip.application:conclusionScreen.alertTitle',
      defaultMessage: 'Tekjuáætlun hefur verið send til Tryggingastofnunar',
      description:
        'An income plan has been sent to the Social Insurance Administration',
    },
    bulletList: {
      id: `ip.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir tekjuáætlun og hefur eftirlit með að tekjur séu í samræmi við rauntekjur og getur verið að tekjuáætlun þinni verði breytt á þeim grundvelli. (Lög um almannatryggingar nr. 100/2007)(https://www.althingi.is/altext/lendu/2007100.html) \n* Hægt er að leiðrétta tekjuáætlun hvenær sem er á árinu en þó aðeins hægt að skila inn breyttri tekjuáætlun á 10 daga fresti. Með vandaðri tekjuáætlun er hægt að koma í veg fyrir of- eða vangreiðslur sem þarf að leiðrétta síðar. \n* Greitt er 1. hvers mánaðar samkvæmt gildandi tekjuáætlun. \n* Greiðslur eru endurreiknaðar þegar framtal vegna greiðsluárs liggur fyrir sem tryggir að allir fá réttar greiðslur í samræmi við endanlegar tekjur.`,
      description: 'BulletList',
    },
    bottomButtonMessage: {
      id: 'ip.application:conclusionScreen.bottom.button.message',
      defaultMessage:
        'Á Mínum síðum Ísland.is getur þú nálgast stöðu tekjuáætlunarinnar og þegar hún hefur verið samþykkt er hún aðgengileg undir framfærslu.',
      description:
        'Under My Pages at Ísland.is you can see the status of your income plan, and when it has been approved you can view it under subsistence.',
    },
  }),
}

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'ip.application:inReview.form.title',
    defaultMessage: 'Tekjuáætlun',
    description: 'Income plan',
  },
  description: {
    id: 'ip.application:inReview.description',
    defaultMessage: 'Tekjuáætlun þín hefur ekki verið tekin til vinnslu.',
    description: 'Your income plan has not been processed.',
  },
  reviewDescription: {
    id: 'ip.application:inReview.review.description',
    defaultMessage: 'Tekjuáætlun þín hefur verið tekin til vinnslu.',
    description: 'Your income plan has been processed.',
  },
})

export const statesMessages = defineMessages({
  externalDataSubmitButton: {
    id: 'ip.application:external.data.submit.button',
    defaultMessage: 'Stofna tekjuáætlun',
    description: 'Create an income plan',
  },
  tryggingastofnunSubmittedTitle: {
    id: 'ip.application:tryggingastofnunSubmittedTitle',
    defaultMessage: 'Tekjuáætlun hefur verið send til Tryggingastofnunnar',
    description:
      'Income plan has been sent to the Social Insurance Administration',
  },
  tryggingastofnunSubmittedContent: {
    id: 'ip.application:tryggingastofnunSubmittedContent',
    defaultMessage: 'Tekjuáætlunin þín er í bið eftir yfirferð.',
    description: 'Your income plan is awaiting review.',
  },
  incomePlanEdited: {
    id: 'ip.application:incomePlanEdited',
    defaultMessage: 'Tekjuáætlun breytt',
    description: 'Income plan edited',
  },
  pendingActionButton: {
    id: 'ip.application:pending.action.button',
    defaultMessage: 'Opna tekjuáætlun',
    description: 'Open income plan',
  },
  tryggingastofnunInReviewTitle: {
    id: 'ip.application:tryggingastofnun.in.review.title',
    defaultMessage: 'Verið er að fara yfir tekjuáætlunina',
    description: 'The income plan is being reviewed',
  },
  tryggingastofnunInReviewContent: {
    id: 'ip.application:tryggingastofnun.in.review.content',
    defaultMessage:
      'Tryggingastofnun fer nú yfir tekjuáætlunina og því getur þetta tekið nokkra daga',
    description:
      'The Social Insurance Administration is currently reviewing the income plan, this may take a few days',
  },
  incomePlanProcessed: {
    id: 'ip.application:income.plan.processed',
    defaultMessage: 'Tryggingastofnun hefur afgreitt tekjuáætlunina',
    description: 'Tryggingastofnun has processed the income plan',
  },
  incomePlanProcessedDescription: {
    id: 'ip.application:income.plan.processed.description',
    defaultMessage: 'Tekjuáætlun hefur verið afgreidd',
    description: 'The income plan has been processed',
  },
})

export const historyMessages = defineMessages({
  incomePlanSent: {
    id: 'ip.application:history.incomePlanSent',
    defaultMessage: 'Tekjuáætlun send',
    description: 'Income plan sent',
  },
  incomePlanStarted: {
    id: 'ip.application:history.incomePlanStarted',
    defaultMessage: 'Tekjuáætlun hafin',
    description: 'Income plan started',
  },
  newIncomePlanButtonLabel: {
    id: 'ip.application:newIncomePlan',
    defaultMessage: 'Ný tekjuáætlun',
    description: 'New income plan',
  },
  incomePlanPageTitle: {
    id: 'ip.application:yourIncomePlans',
    defaultMessage: 'Þínar tekjuáætlanir',
    description: 'Your income plans',
  },
})
