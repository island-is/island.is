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
    registryIcelandDescription: {
      id: 'ip.application:registry.iceland.description',
      defaultMessage: 'Upplýsingar um þig.',
      description: 'Information about you.',
    },
    formTitle: {
      id: 'ip.application:form.title',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income Plan',
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
  }),

  incomePlan: defineMessages({
    description: {
      id: 'ip.application:income.plan.description',
      defaultMessage:
        'Hér er tillaga að tekjuáætlun. Upplýsingar um launatekjur eru fengnar úr staðgreiðsluskrá og fjármagnstekjur eru sóttar í nýjasta skattframtal. Þú getur breytt upphæðum, fjarlægt tekjur og/eða bætt við tekjum sem ekki er búið að setja inn. Tekjur á ári eru sýndar í þeim gjaldmiðli sem þær voru greiddar í.',
      description: 'english translation',
    },
    registerIncome: {
      id: 'pp.application:register.income',
      defaultMessage: 'Skráning tekna',
      description: 'Registration of income',
    },
    addIncome: {
      id: 'pp.application:add.income',
      defaultMessage: 'Bæta við tekjum',
      description: 'Add income',
    },
    saveIncome: {
      id: 'pp.application:save.income',
      defaultMessage: 'Vista nýjar tekjur',
      description: 'Save new income',
    },
    removeIncome: {
      id: 'pp.application:remove.income',
      defaultMessage: 'Eyða tekjum',
      description: 'Remove income',
    },
    editIncome: {
      id: 'pp.application:edit.income',
      defaultMessage: 'Breyta tekjum',
      description: 'Edit income',
    },
    incomeCategory: {
      id: 'pp.application:income.category',
      defaultMessage: 'Tekjuflokkur',
      description: 'Income category',
    },
    selectIncomeCategory: {
      id: 'pp.application:select.income.category',
      defaultMessage: 'Veldu tekjuflokk',
      description: 'Select income category',
    },
    incomeType: {
      id: 'pp.application:income.type',
      defaultMessage: 'Tekjutegund',
      description: 'Income type',
    },
    selectIncomeType: {
      id: 'pp.application:select.income.type',
      defaultMessage: 'Veldu tekjutegund',
      description: 'Select income type',
    },
    annualIncome: {
      id: 'pp.application:annual.income',
      defaultMessage: 'Árstekjur',
      description: 'Annual income',
    },
    monthlyIncome: {
      id: 'pp.application:yearly.income',
      defaultMessage: 'Mánaðartekjur',
      description: 'Monthly income',
    },
    incomePerYear: {
      id: 'pp.application:income.per.year',
      defaultMessage: 'Tekjur á ári',
      description: 'Income per year',
    },
    foreignIncomePerYear: {
      id: 'pp.application:foreign.income.per.year',
      defaultMessage: 'Erlendar tekjur á ári',
      description: 'Foreign income per year',
    },
    equalIncomePerMonth: {
      id: 'pp.application:equal.income.per.month',
      defaultMessage: 'Jafnar tekjur á mánuði',
      description: 'Equal income per month',
    },
    equalForeignIncomePerMonth: {
      id: 'pp.application:equal.foreign.income.per.month',
      defaultMessage: 'Erlendar tekjur á mánuði',
      description: 'Foreign income per month',
    },
    monthlyDistributionOfIncome: {
      id: 'pp.application:monthly.distribution.of.income',
      defaultMessage: 'Óska eftir mánaðarskiptingu atvinnutekna',
      description: 'Request a monthly distribution of employment income',
    },
    monthlyDistributionOfIncomeTooltip: {
      id: 'pp.application:monthly.distribution.of.income.tooltip',
      defaultMessage:
        'Atvinnutekjur hafa einungis áhrif á lífeyrisgreiðslur þess mánaðar sem atvinnutekna er aflað.',
      description:
        'Income only affects the pension payments for the month in which income is earned.',
    },
    currency: {
      id: 'pp.application:currency',
      defaultMessage: 'Gjaldmiðill',
      description: 'Currency',
    },
    selectCurrency: {
      id: 'pp.application:select.currency',
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
})
