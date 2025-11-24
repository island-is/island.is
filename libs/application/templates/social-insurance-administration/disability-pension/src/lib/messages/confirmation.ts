import { defineMessages } from 'react-intl'

export const confirmation = defineMessages({
  tabTitle: {
    id: 'dp.application:confirmation.tabTitle',
    defaultMessage: 'Staðfesting',
    description: 'Confirmation tab title',
  },
  title: {
    id: 'dp.application:confirmation.title',
    defaultMessage: 'Umsókn um örorku hefur verið send og bíður tekjuáætlunar',
    description:
      'Application for disability benefits has been submitted and is awaiting income assessment.',
  },
  successTitle: {
    id: 'dp.application:confirmation.successTitle',
    defaultMessage: 'Umsókn þín hefur verið móttekin',
    description: 'Confirmation',
  },
  successDescription: {
    id: 'dp.application:confirmation.successDescription',
    defaultMessage: 'Umsókn um örorku hefur verið send til Tryggingastofnunar',
    description: 'Confirmation',
  },
  whatHappensNext: {
    id: 'dp.application:confirmation.whatHappensNext',
    defaultMessage: 'Hvað gerist næst?',
    description: 'What happens next?',
  },
  whatHappensNextOptions: {
    id: 'dp.application:confirmation.whatHappensNextOptions#markdown',
    defaultMessage:
      '* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.  \n\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. \n\n*         Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til örorkulífeyris. Vinnslutími umsókna um örorkulífeyris er allt að fjórar vikur.',
    description: 'What happens next options',
  },
  warningTitle: {
    id: 'dp.application:confirmation.warningTitle',
    defaultMessage: 'Tengdar umsóknir / Réttur til annarra greiðslna',
    description: 'Warning title',
  },
  warningDescription: {
    id: 'dp.application:confirmation.warningDescription#markdown',
    defaultMessage: `# **Þú gætir átt rétt á:**\n\n Tryggingastofnun vekur athygli þína á því að þú getur átt rétt á greiðslum úr öðrum bótaflokkum sem tengjast heimilisaðstæðum. \n\nSérstaklega er bent á eftirfarandi umsóknir: \n\n- Umsókn um barnalífeyrir \n- Umsókn um heimilisuppbót \n\nTryggingastofnun hvetur þig til að fara í gegnum þessar umsóknir. Þær er hægt að nálgast inni á [tr.is](https://tr.is) og velur þar "Mínar síður". Innskráning fer fram með rafrænum skilríkjum.`,
    description: 'Warning description',
  },
})
