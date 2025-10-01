import { defineMessages } from 'react-intl'

export const incomePlan = defineMessages({
  instructionsTitle: {
    id: 'dp.application:incomePlan.instructionsTitle',
    defaultMessage: 'Tekjuáætlun',
    description: 'Income plan',
  },
  instructionsDescription: {
    id: 'dp.application:incomePlan.instructionsDescription',
    defaultMessage: 'Leiðbeiningar um skráningu tekjuáætlunar',
    description: 'Instructions for recording income plan',
  },
  instructionsBullets: {
    id: 'dp.application:incomePlan.instructionsBullets#markdown',
    defaultMessage:
      '- Á næstu síðu er að finna tillögu að tekjuáætlun. Þar getur þú breytt upphæðum og bætt við tekjum. \n- Skrá skal heildartekjur fyrir skatt í tekjuáætlun. \n- Fjármagnstekjur eru sameignlegar hjá hjónum/sambúðarfólki og skal skrá heildar fjármagnstekjur hjóna/sambúðarfólks í tekjuáætlun. \n- Ef maki er á lífeyri verða greiðslur hans einnig endurreiknaðar ef fjármagnstekjum er breytt. \n- Heimilt er að skrá atvinnutekjur á þá mánuði sem þeirra er aflað. Reiknast þá þær atvinnutekjur eingöngu í þeim mánuði. Vakin er athygli á að það þarf að haka sérstaklega við þann kost að óska eftir mánaðarskiptingu atvinnutekna í tekjuáætlun.\n- Laun / lífeyrisgreiðslur skal skrá í þeim gjaldmiðli sem þau eru greidd.\n- Það er á ábyrgð umsækjanda að tekjuáætlun sé rétt og að nauðsynlegar upplýsingar liggi fyrir til að hægt sé að ákvarða réttar greiðslur.',
    description: 'Instructions for recording income plan',
  },
  instructionsLink: {
    id: 'dp.application:incomePlan.instructionsLink#markdown',
    defaultMessage:
      '[Tekjuáætlun - Upplýsingar um tekjur lífeyrisþega | Ísland.is](https://island.is/tekjuaaetlun-tr-upplysingar-um-tekjur-lifeyristhega/vinna-med-lifeyri)',
    description: 'Instructions for recording income plan',
  },
  incomeType: {
    id: 'dp.application:incomePlan.incomeType',
    defaultMessage: 'Tekjutegund',
    description: 'Income type',
  },
  yearlyIncome: {
    id: 'dp.application:incomePlan.yearlyIncome',
    defaultMessage: 'Tekjur á ári',
    description: 'Yearly income',
  },
  currency: {
    id: 'dp.application:incomePlan.currency',
    defaultMessage: 'Gjaldmiðill',
    description: 'Currency',
  },
})
