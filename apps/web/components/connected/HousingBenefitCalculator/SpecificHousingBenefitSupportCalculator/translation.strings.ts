import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  sixOrMore: {
    id: 'web.SpecificHousingBenefitSupportCalculator:sixOrMore',
    defaultMessage: '6 eða fleiri',
    description: 'Label fyrir 6 eða fleiri',
  },
  numberOfHouseholdMembers: {
    id: 'web.SpecificHousingBenefitSupportCalculator:numberOfHouseholdMembers',
    defaultMessage: 'Fjöldi heimilismanna í húsnæði?',
    description: 'Fjöldi heimilismanna í húsnæði',
  },
  housingCostsPerMonth: {
    id: 'web.SpecificHousingBenefitSupportCalculator:housingCostsPerMonth',
    defaultMessage: 'Húsnæðiskostnaður á mánuði?',
    description: 'Húsnæðiskostnaður á mánuði',
  },
  housingCostLabel: {
    id: 'web.SpecificHousingBenefitSupportCalculator:housingCostLabel',
    defaultMessage: 'Húsnæðiskostnaður',
    description: 'Label fyrir húsnæðiskostnaður input reit',
  },
  housingCostPlaceholder: {
    id: 'web.SpecificHousingBenefitSupportCalculator:housingCostPlaceholder',
    defaultMessage: 'kr.',
    description: 'Placeholder fyrir húsnæðiskostnaður input reit',
  },
  calculatorDisclaimer: {
    id: 'web.SpecificHousingBenefitSupportCalculator:calculatorDisclaimer',
    defaultMessage:
      'Útreikningur húsnæðisbóta samkvæmt reiknivélinni byggir á þeim forsendum sem þú gafst upp og telst ekki bindandi ákvörðun um húsnæðisbætur. Útreikningur miðast við greiðslur húsnæðisbóta fyrir heilt almanaksár.',
    description: 'Reiknivéla fyrirvari',
  },
  calculate: {
    id: 'web.SpecificHousingBenefitSupportCalculator:calculate',
    defaultMessage: 'Reikna',
    description: 'Texti á takka til að reikna',
  },
  results: {
    id: 'web.SpecificHousingBenefitSupportCalculator:results',
    defaultMessage: 'Niðurstöður',
    description: 'Titill á niðurstöðum',
  },
  maximumHousingBenefits: {
    id: 'web.SpecificHousingBenefitSupportCalculator:maximumHousingBenefits',
    defaultMessage: 'Hámarksbætur miðað við fjölda heimilismanna eru',
    description: 'Hámarksbætur miðað við fjölda heimilismanna eru',
  },
  perMonth: {
    id: 'web.SpecificHousingBenefitSupportCalculator:perMonth',
    defaultMessage: 'á mánuði.',
    description: 'á mánuði',
  },
  reductionsDueToHousingCosts: {
    id: 'web.SpecificHousingBenefitSupportCalculator:reductionsDueToHousingCosts',
    defaultMessage: 'Skerðing vegna húsnæðiskostnaðar eru',
    description: 'Skerðing vegna húsnæðiskostnaðar eru',
  },
  estimatedHousingBenefits: {
    id: 'web.SpecificHousingBenefitSupportCalculator:estimatedHousingBenefits',
    defaultMessage: 'Áætlaðar húsnæðisbætur eru',
    description: 'Áætlaðar húsnæðisbætur eru',
  },
  errorOccurredTitle: {
    id: 'web.SpecificHousingBenefitSupportCalculator:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill þegar villa kemur upp',
  },
  errorOccurredMessage: {
    id: 'web.SpecificHousingBenefitSupportCalculator:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að sækja niðurstöður',
    description: 'Skilaboð þegar villa kemur upp',
  },
})
