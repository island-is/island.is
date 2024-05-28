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
    equalIncomePerYear: {
      id: 'pp.application:equal.income.per.year',
      defaultMessage: 'Jafnar tekjur á ári',
      description: 'Equal income per year',
    },
    unevenIncomePerYear: {
      id: 'pp.application:uneven.income.per.year',
      defaultMessage: 'Ójafnar tekjur á ári',
      description: 'Uneven income per year',
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
      defaultMessage:
        'Tekjuáætlun móttekin',
      description:
        'Income plan received',
    },
    alertTitle: {
      id: 'ip.application:conclusionScreen.alertTitle',
      defaultMessage:
        'Tekjuáætlun hefur verið send til Tryggingastofnunar',
      description:
        'An income plan has been sent to the Social Insurance Administration',
    },
    bulletList: {
      id: `ip.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir tekjuáætlun og hefur eftirlit með að tekjur séu í samræmi við rauntekjur og getur verið að tekjuáætlun þinni verði breytt á þeim grundvelli. (Lög um almannatryggingar nr. 100/2007)(https://www.althingi.is/altext/lendu/2007100.html) \n* Hægt er að leiðrétta tekjuáætlun hvenær sem er á árinu en þó aðeins hægt að skila inn breyttri tekjuáætlun á 10 daga fresti. Með vandaðri tekjuáætlun er hægt að koma í veg fyrir of- eða vangreiðslur sem þarf að leiðrétta síðar. \n* Athugið að greitt er 1. hvers mánaðar samkvæmt tekjuáætlun eins og hún er þann 15. mánaðarins á undan. \n* Greiðslur eru endurreiknaðar þegar framtal vegna greiðsluárs liggur fyrir sem tryggir að allir fá réttar greiðslur í samræmi við endanlegar tekjur.`,
      description: 'BulletList',
    },
  }),
}