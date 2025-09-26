import { defineMessages } from 'react-intl'

export const capabilityImpairment = defineMessages({
  tabTitle: {
    id: 'dp.application:capabilityImpairment.tabTitle',
    defaultMessage: 'Skerðing á færni',
    description: 'Work capability impairment',
  },
  title: {
    id: 'dp.application:capabilityImpairment.title',
    defaultMessage: 'Færni í daglegu lífi',
    description: 'Work capability impairment',
  },

  description: {
    id: 'dp.application:capabilityImpairment.description#markdown',
    defaultMessage:
      'Þessi hluti inniheldur spurningar um hvernig þú upplifir eigin færni í daglegu lífi og starfi. Hér getur verið um að ræða líkamlega, andlega eða félagslega þætti sem geta haft áhrif á getu þína til að sinna daglegum athöfnum, starfi og frístundum. \n\n Hafðu í huga að um er að ræða umfangsmikinn lista yfir atriði sem eiga ekki endilega við þig. Því er mikilvægt að þú metir hvernig þú upplifir stöðuna eins og hún er núna, ekki hvernig hún var áður eða hvernig þú vilt að hún verði.',
    description:
      'Here you can describe in more detail the problem that affects your work capacity.',
  },
  questionnaire: {
    id: 'dp.application:capabilityImpairment.questionnaire',
    defaultMessage: 'Færni í daglegu lífi (Spurning {index} af {total})',
    description: 'Work capability impairment with index variables',
  },
  completeSelfAssessment: {
    id: 'dp.application:capabilityImpairment.complete.self.assessment',
    defaultMessage: 'Ljúka sjálfsmati',
    description: 'Complete self-assessment',
  },
})
