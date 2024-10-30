import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  sixOrMore: {
    id: 'web.HousingBenefitCalculator:sixOrMore',
    defaultMessage: '6 eða fleiri',
    description: 'Label fyrir 6 eða fleiri',
  },
  fourOrMore: {
    id: 'web.HousingBenefitCalculator:fourOrMore',
    defaultMessage: '4 eða fleiri',
    description: 'Label fyrir 4 eða fleiri',
  },
  numberOfHouseholdMembers: {
    id: 'web.HousingBenefitCalculator:numberOfHouseholdMembers',
    defaultMessage: 'Fjöldi heimilismanna í húsnæði?',
    description: 'Fjöldi heimilismanna í húsnæði',
  },
  monthlyIncomeOfHouseholdMembers18YearsAndOlder: {
    id: 'web.HousingBenefitCalculator:monthlyIncomeOfHouseholdMembers18YearsAndOlder',
    defaultMessage:
      'Samanlagðar mánaðarlegartekjur heimilismanna 18 ára og eldri (tekjur f. skatt)?',
    description:
      'Samanlagðar mánaðarlegartekjur heimilismanna 18 ára og eldri (tekjur f. skatt)',
  },
  incomeLabel: {
    id: 'web.HousingBenefitCalculator:incomeLabel',
    defaultMessage: 'Tekjur',
    description: 'Label fyrir tekjur input reit',
  },
  incomePlaceholder: {
    id: 'web.HousingBenefitCalculator:incomePlaceholder',
    defaultMessage: 'kr.',
    description: 'Placeholder fyrir tekjur input reit',
  },
  assetsOfHouseholdMembers18YearsAndOlder: {
    id: 'web.HousingBenefitCalculator:assetsOfHouseholdMembers18YearsAndOlder',
    defaultMessage: 'Eignir heimilismanna 18 ára og eldri?',
    description: 'Eignir heimilismanna 18 ára og eldri',
  },
  assetsLabel: {
    id: 'web.HousingBenefitCalculator:assetsLabel',
    defaultMessage: 'Eignir',
    description: 'Label fyrir eignir input reit',
  },
  assetsPlaceholder: {
    id: 'web.HousingBenefitCalculator:assetsPlaceholder',
    defaultMessage: 'kr.',
    description: 'Placeholder fyrir eignir input reit',
  },
  housingCostsPerMonth: {
    id: 'web.HousingBenefitCalculator:housingCostsPerMonth',
    defaultMessage: 'Húsnæðiskostnaður á mánuði?',
    description: 'Húsnæðiskostnaður á mánuði',
  },
  housingCostLabel: {
    id: 'web.HousingBenefitCalculator:housingCostLabel',
    defaultMessage: 'Húsnæðiskostnaður',
    description: 'Label fyrir húsnæðiskostnaður',
  },
  housingCostPlaceholder: {
    id: 'web.HousingBenefitCalculator:housingCostPlaceholder',
    defaultMessage: 'kr.',
    description: 'Placeholder fyrir húsnæðiskostnaðar input reit',
  },
  calculatorDisclaimer: {
    id: 'web.HousingBenefitCalculator:calculatorDisclaimer',
    defaultMessage:
      'Útreikningur húsnæðisbóta samkvæmt reiknivélinni byggir á þeim forsendum sem þú gafst upp og telst ekki bindandi ákvörðun um húsnæðisbætur. Útreikningur miðast við greiðslur húsnæðisbóta fyrir heilt almanaksár.',
    description: 'Reiknivéla fyrirvari',
  },
  calculate: {
    id: 'web.HousingBenefitCalculator:calculate',
    defaultMessage: 'Reikna',
    description: 'Texti á takka til að reikna',
  },
  results: {
    id: 'web.HousingBenefitCalculator:results',
    defaultMessage: 'Niðurstöður',
    description: 'Titill á niðurstöðum',
  },
  maximumHousingBenefits: {
    id: 'web.HousingBenefitCalculator:maximumHousingBenefits',
    defaultMessage: 'Hámarksbætur miðað við fjölda heimilismanna eru',
    description: 'Hámarksbætur miðað við fjölda heimilismanna eru',
  },
  perMonth: {
    id: 'web.HousingBenefitCalculator:perMonth',
    defaultMessage: 'á mánuði.',
    description: 'á mánuði',
  },
  reductionDueToIncome: {
    id: 'web.HousingBenefitCalculator:reductionDueToIncome',
    defaultMessage: 'Skerðing vegna tekna eru',
    description: 'Skerðing vegna tekna eru',
  },
  reductionDueToAssets: {
    id: 'web.HousingBenefitCalculator:reductionDueToAssets',
    defaultMessage: 'Skerðing vegna eigna eru',
    description: 'Skerðing vegna eigna eru',
  },
  reductionsDueToHousingCosts: {
    id: 'web.HousingBenefitCalculator:reductionsDueToHousingCosts',
    defaultMessage: 'Skerðing vegna húsnæðiskostnaðar eru',
    description: 'Skerðing vegna húsnæðiskostnaðar eru',
  },
  estimatedHousingBenefits: {
    id: 'web.HousingBenefitCalculator:estimatedHousingBenefits',
    defaultMessage: 'Áætlaðar húsnæðisbætur eru',
    description: 'Áætlaðar húsnæðisbætur eru',
  },
  errorOccurredTitle: {
    id: 'web.HousingBenefitCalculator:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill þegar villa kemur upp',
  },
  errorOccurredMessage: {
    id: 'web.HousingBenefitCalculator:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að sækja niðurstöður',
    description: 'Skilaboð þegar villa kemur upp',
  },
})
