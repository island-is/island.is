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
    section: {
      id: 'ip.application:section',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income Plan',
    },
    instructionsTitle: {
      id: 'ip.application:instructions.title',
      defaultMessage: 'Leiðbeiningar um skráningu tekjuáætlunar',
      description: 'Instructions on filling out your income plan',
    },
    instructionsShortTitle: {
      id: 'ip.application:instructions.short.title',
      defaultMessage: 'Leiðbeiningar',
      description: 'Instructions',
    },
    instructionsDescription: {
      id: 'ip.application:instructions.description#markdown',
      defaultMessage:
        '\n* Á næstu síðu er að finna tillögu að tekjuáætlun. Þar getur þú breytt upphæðum og bætt við tekjum.\n* Skrá skal heildartekjur fyrir skatt í tekjuáætlun.\n* Fjármagnstekjur eru sameignlegar hjá hjónum og skal skrá heildar fjármagnstekjur hjóna í tekjuáætlun.\n* Ef maki er á lífeyri verða greiðslur hans einnig endurreiknaðar ef fjármagnstekjum er breytt.\n* Heimilt er að skrá atvinnutekjur á þá mánuði sem þeirra er aflað. Reiknast þá þær atvinnutekjur eingöngu í þeim mánuði. Vakin er athygli á að það þarf að haka sérstaklega við þann kost að óska mánaðarskiptingu atvinnutekna í tekjuáætlun.\n* Laun / lífeyrisgreiðslur skal skrá í þeim gjaldmiðli sem þau eru greidd.\n* Það er á ábyrgð lífeyrisþega að tekjuáætlun sé rétt og að nauðsynlegar upplýsingar til að hægt sé að ákvarða réttar greiðslur séu fyrirliggjandi.',
      description:
        '\n* On the next page you will find your proposed income plan. There you can edit amounts and add income categories.\n* You must submit your total pre-tax income in your income plan.\n* For couples, their total income must be recorded in the income plan, as their income is considered shared.\n* If a spouse is receiving disability, his or her benefits will also be recalculated if there is a change in income.\n* Income may be recorded in the month in which it is earned. The income is then calculated only for that month. Attention, it is necessary to select the option of requesting a monthly distribution of income in the income plan.\n* Salary / pension payments must be recorded in the currency in which they are paid.\n* It is the responsibility of the pensioner that the income plan is correct and that the necessary information for determining the correct payments is available.',
    },
    temporaryCalculationTitle: {
      id: 'ip.application:temorary.calculation.title',
      defaultMessage: 'Bráðabirgðaútreikningur',
      description: 'Temporary calculation',
    },
    tableHeaderOne: {
      id: 'ip.application:table.header.one',
      defaultMessage: 'Greiðslutegundir',
      description: 'Payment types',
    },
    tableHeaderTwo: {
      id: 'ip.application:table.header.two',
      defaultMessage: 'Samtals á mánuði',
      description: 'Montly total',
    },
    tableHeaderThree: {
      id: 'ip.application:table.header.three',
      defaultMessage: 'Samtals á ári',
      description: 'Annual total',
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
    description: {
      id: 'ip.application:income.plan.description',
      defaultMessage:
        'Hér er tillaga að tekjuáætlun fyrir árið {incomePlanYear}. Upplýsingar um launatekjur eru fengnar úr staðgreiðsluskrá og fjármagnstekjur eru sóttar í nýjasta skattframtal. Þú getur breytt upphæðum, fjarlægt tekjur og/eða bætt við tekjum sem ekki er búið að setja inn. Tekjur á ári eru sýndar í þeim gjaldmiðli sem þær voru greiddar í.',
      description: 'english translation',
    },
    currentIncomePlanDescription: {
      id: 'ip.application:income.plan.current.income.plandescription',
      defaultMessage:
        'Hér fyrir neðan er sú tekjuáætlun sem nú er í gildi fyrir árið {incomePlanYear}. Hér getur þú breytt upphæðum, fjarlægt tekjur og/eða bætt við tekjum sem ekki er búið að setja inn.',
      description: 'english translation',
    },
    registerIncome: {
      id: 'ip.application:register.income',
      defaultMessage: 'Skráning tekna',
      description: 'Registration of income',
    },
    addIncome: {
      id: 'ip.application:add.income',
      defaultMessage: 'Bæta við tekjum',
      description: 'Add income',
    },
    saveIncome: {
      id: 'ip.application:save.income',
      defaultMessage: 'Vista nýjar tekjur',
      description: 'Save new income',
    },
    removeIncome: {
      id: 'ip.application:remove.income',
      defaultMessage: 'Eyða tekjum',
      description: 'Remove income',
    },
    editIncome: {
      id: 'ip.application:edit.income',
      defaultMessage: 'Breyta tekjum',
      description: 'Edit income',
    },
    incomeCategory: {
      id: 'ip.application:income.category',
      defaultMessage: 'Tekjuflokkur',
      description: 'Income category',
    },
    selectIncomeCategory: {
      id: 'ip.application:select.income.category',
      defaultMessage: 'Veldu tekjuflokk',
      description: 'Select income category',
    },
    incomeType: {
      id: 'ip.application:income.type',
      defaultMessage: 'Tekjutegund',
      description: 'Income type',
    },
    selectIncomeType: {
      id: 'ip.application:select.income.type',
      defaultMessage: 'Veldu tekjutegund',
      description: 'Select income type',
    },
    annualIncome: {
      id: 'ip.application:annual.income',
      defaultMessage: 'Árstekjur',
      description: 'Annual income',
    },
    monthlyIncome: {
      id: 'ip.application:yearly.income',
      defaultMessage: 'Mánaðartekjur',
      description: 'Monthly income',
    },
    incomePerYear: {
      id: 'ip.application:income.per.year',
      defaultMessage: 'Tekjur á ári',
      description: 'Income per year',
    },
    foreignIncomePerYear: {
      id: 'ip.application:foreign.income.per.year',
      defaultMessage: 'Erlendar tekjur á ári',
      description: 'Foreign income per year',
    },
    equalIncomePerMonth: {
      id: 'ip.application:equal.income.per.month',
      defaultMessage: 'Jafnar tekjur á mánuði',
      description: 'Equal income per month',
    },
    equalForeignIncomePerMonth: {
      id: 'ip.application:equal.foreign.income.per.month',
      defaultMessage: 'Erlendar tekjur á mánuði',
      description: 'Foreign income per month',
    },
    monthlyDistributionOfIncome: {
      id: 'ip.application:monthly.distribution.of.income',
      defaultMessage: 'Óska eftir mánaðarskiptingu atvinnutekna',
      description: 'Request a monthly distribution of employment income',
    },
    monthlyDistributionOfIncomeTooltip: {
      id: 'ip.application:monthly.distribution.of.income.tooltip',
      defaultMessage:
        'Atvinnutekjur hafa einungis áhrif á lífeyrisgreiðslur þess mánaðar sem atvinnutekna er aflað.',
      description:
        'Income only affects the pension payments for the month in which income is earned.',
    },
    currency: {
      id: 'ip.application:currency',
      defaultMessage: 'Gjaldmiðill',
      description: 'Currency',
    },
    selectCurrency: {
      id: 'ip.application:select.currency',
      defaultMessage: 'Veldu gjaldmiðil',
      description: 'Select a currency',
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
    buttonEdit: {
      id: 'ip.application:button.edit',
      defaultMessage: 'Breyta tekjuáætlun',
      description: 'Edit application',
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
    defaultMessage:
      'Tekjuáætlunin þín er í bið eftir yfirferð. Hægt er að breyta tekjuáætlun þar til hún er komin í yfirferð.',
    description:
      'Your income plan is awaiting review. It is possible to edit the income plan until it is under review.',
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

export const errorMessages = defineMessages({
  monthsRequired: {
    id: 'ip.application:error.months.required',
    defaultMessage: 'Nauðsynlegt er að bæta við tekjum fyrir a.m.k einn mánuð',
    description: 'You must add income for at least one month',
  },
  incomePlanRequired: {
    id: 'ip.application:error.income.plan.required',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einni tekjutegund',
    description: 'You must add at least one income type',
  },
})
