import { defineMessages } from 'react-intl'

export const basicInfo = defineMessages({
  title: {
    id: 'dp.application:basicInfo.title',
    defaultMessage: 'Almennar upplýsingar',
    description: 'Basic information',
  },
  personalInfo: {
    id: 'dp.application:basicInfo.personalInfo',
    defaultMessage: 'Upplýsingar um þig',
    description: 'Personal information',
  },
  personalInfoInstructions: {
    id: 'dp.application:basicInfo.personalInfoInstructions#markdown',
    defaultMessage:
      'Vinsamlegast farið yfir netfang og símanúmer til að tryggja að þær upplýsingar séu réttar. Netfangi er breytt [hér](https://island.is/minarsidur/min-gogn/stillingar/). Athugið að ef að aðrar upplýsingar eru ekki réttar þarft þú að hafa samband við Þjóðskrá og fara fram á breytingu.',
    description: 'Instructions for personal information',
  },
  paymentInfo: {
    id: 'dp.application:basicInfo.paymentInfo',
    defaultMessage: 'Greiðsluupplýsingar',
    description: 'Payment information',
  },
  incomePlanInstructionsTitle: {
    id: 'dp.application:basicInfo.incomePlanInstructionsTitle',
    defaultMessage: 'Tekjuáætlun - Leiðbeiningar',
    description: 'Instructions for income plan',
  },
  employmentParticipationTitle: {
    id: 'dp.application:basicInfo.employmentParticipationTitle',
    defaultMessage: 'Atvinnuþátttaka',
    description: 'Employment participation',
  },
})
