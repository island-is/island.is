import { defineMessages } from 'react-intl'

export const taxReturnRequiredMessages = defineMessages({
  title: {
    id: 'hb.application:taxReturnRequired.title',
    defaultMessage: 'Skattframtal vantar',
    description: 'Tax return required screen title',
  },
  multiFieldTitle: {
    id: 'hb.application:taxReturnRequired.multiFieldTitle',
    defaultMessage: 'Þú átt eftir að skila skattframtali',
    description: 'Tax return required screen multi field title',
  },
  description: {
    id: 'hb.application:taxReturnRequired.description#markdown',
    defaultMessage:
      'Til að geta sótt um húsnæðisbætur þarft þú að hafa skilað skattframtali fyrir síðasta ár. Samkvæmt upplýsingum frá Skattinum hefur skattframtali síðasta árs ekki verið skilað.',
    description: 'Tax return required screen description',
  },
  description2: {
    id: 'hb.application:taxReturnRequired.description2#markdown',
    defaultMessage:
      'Vinsamlegast skilaðu skattframtali fyrir síðasta ár og reyndu svo aftur að sækja um. Ef þú telur þetta vera villu getur þú haft samband við Húsnæðis- og mannvirkjastofnun.',
    description: 'Tax return required screen description 2',
  },
})
