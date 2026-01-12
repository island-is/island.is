import { defineMessages } from 'react-intl'

export const changesMessages = defineMessages({
  title: {
    id: 'fca.application:title',
    defaultMessage: 'Breytingar á fasteign',
    description: 'Appraisal method title',
  },
  description: {
    id: 'fca.application:description#markdown',
    defaultMessage:
      'Ástæður til endurmats brunabótamats geta verið vegna þess að einhverju hefur verið bætt við eignina, hún stækkuð eða t.d. bætt við sólpalli, skjólgirðingu o.s.frv.\n\nJafnframt getur verið ástæða til endurmats brunabótamats ef farið hefur verið í stærri framkvæmdir og hlutum eignarinnar verið skipt út t.d. skipt um lagnir, nýjar innréttingar, skipt um einangrun eða klæðningu eða allt sem er meira en eðlilegt viðhald.\n\nÞegar gerð er beiðni um endurmat brunabótamats er mikilvægt að telja fram allar þær framkvæmdir sem farið hefur verið í og hvaða ár einstaka framkvæmdir voru gerðar.\n\nEf eigandi treystir sér ekki til þess að lýsa framkvæmdum er hægt að senda póst á [brunabotamat@hms.is](mailto:brunabotamat@hms.is) og óska eftir að sérfræðingur hafi samband.',
    description: 'Description section description',
  },
  appraisalMethod: {
    id: 'fca.application:appraisalMethod',
    defaultMessage: 'Matsaðferð',
    description: 'Appraisal method',
  },
  descriptionOfChanges: {
    id: 'fca.application:descriptionOfChanges',
    defaultMessage: 'Lýsing á breytingum',
    description: 'Description of changes',
  },
  becauseOfRenovations: {
    id: 'fca.application:becauseOfRenovations',
    defaultMessage: 'Endurmat vegna endurbóta',
    description: 'Because of renovations',
  },
  becauseOfAdditions: {
    id: 'fca.application:becauseOfAdditions',
    defaultMessage: 'Endurmat vegna viðbóta',
    description: 'Because of additions',
  },
  textAreaPlaceholder: {
    id: 'fca.application:textAreaPlaceholder',
    defaultMessage:
      'Vinsamlegast listaðu upp þær framkvæmdir sem ráðist hefur verið í og skráðu hvaða ár þær voru gerðar.',
    description: 'Text area placeholder',
  },
})
