import { defineMessages } from 'react-intl'

export const descriptionMessages = defineMessages({
  title: {
    id: 'fca.application:description.title',
    defaultMessage: 'Lýsing á fasteign',
    description: 'Description section title',
  },
  description: {
    id: 'fca.application:description.description#markdown',
    defaultMessage:
      'Ástæður til endurmats brunabótamats geta verið vegna þess að einhverju hefur verið bætt við eignina, hún stækkuð eða t.d. bætt við sólpalli, skjólgirðingu o.s.frv.\n\nJafnframt getur verið ástæða til endurmats brunabótamats ef farið hefur verið í stærri framkvæmdir og hlutum eignarinnar verið skipt út t.d. skipt um lagnir, nýjar innréttingar, skipt um einangrun eða klæðningu eða allt sem er meira en eðlilegt viðhald.\n\nÞegar gerð er beiðni um endurmat brunabótamats er mikilvægt að telja fram allar þær framkvæmdir sem farið hefur verið í og hvaða ár einstaka framkvæmdir voru gerðar.\n\nEf eigandi treystir sér ekki til þess að lýsa framkvæmdum er hægt að senda póst á brunabotamat@hms.is og óska eftir að sérfræðingur hafi samband.',
    description: 'Description section description',
  },
  textAreaLabel: {
    id: 'fca.application:description.textAreaLabel',
    defaultMessage: 'Breytingar sem hafa verið gerðar á fasteign',
    description: 'Text area label',
  },
  textAreaPlaceholder: {
    id: 'fca.application:description.textAreaPlaceholder',
    defaultMessage:
      'Vinsamlegast listaðu upp þær framkvæmdir sem ráðist hefur verið í og skráðu hvaða ár þær voru gerðar.',
    description: 'Text area placeholder',
  },
})
