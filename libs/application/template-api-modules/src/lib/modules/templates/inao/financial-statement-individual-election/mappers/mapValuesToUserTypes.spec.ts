import { mapValuesToIndividualtype } from './mapValuesToUserTypes'

describe('mapValuesToIndividualtype', () => {
  it('should map correctly', () => {
    const answers = getAnswers()

    const expectedResult = getValidExpectedAnswerObj()

    const result = mapValuesToIndividualtype(answers)

    expect(result).toEqual(expectedResult)
  })

  it('should return NaN when something was not found or parsable', () => {
    const answers = {
      'individualIncome.contributionsByLegalEntities': 'this is not a number',
      'individualIncome.doesntExist': 100,
    }

    const expectedResult = getAllNaNExpectedAnswerObj()

    const result = mapValuesToIndividualtype(answers)

    expect(result).toEqual(expectedResult)
  })
})

const getAnswers = () => ({
  'individualIncome.contributionsByLegalEntities': 100,
  'individualIncome.candidatesOwnContributions': 101,
  'individualIncome.individualContributions': 102,
  'individualIncome.otherIncome': 128,
  'individualExpense.electionOffice': 129,
  'individualExpense.advertisements': 130,
  'individualExpense.travelCost': 131,
  'individualExpense.otherCost': 132,
  'capitalNumbers.capitalIncome': 139,
  'capitalNumbers.capitalCost': 148,
  'asset.fixedAssetsTotal': 150,
  'asset.currentAssets': 160,
  'liability.longTerm': 170,
  'liability.shortTerm': 180,
  'equity.totalEquity': 190,
})

const getValidExpectedAnswerObj = () => ({
  contributionsByLegalEntities: 100,
  candidatesOwnContributions: 101,
  individualContributions: 102,
  otherIncome: 128,
  electionOfficeExpenses: 129,
  advertisingAndPromotions: 130,
  meetingsAndTravelExpenses: 131,
  otherExpenses: 132,
  capitalIncome: 139,
  financialExpenses: 148,
  fixedAssetsTotal: 150,
  currentAssets: 160,
  longTermLiabilitiesTotal: 170,
  shortTermLiabilitiesTotal: 180,
  equityTotal: 190,
})

const getAllNaNExpectedAnswerObj = () => ({
  contributionsByLegalEntities: NaN,
  candidatesOwnContributions: NaN,
  individualContributions: NaN,
  otherIncome: NaN,
  electionOfficeExpenses: NaN,
  advertisingAndPromotions: NaN,
  meetingsAndTravelExpenses: NaN,
  otherExpenses: NaN,
  capitalIncome: NaN,
  financialExpenses: NaN,
  fixedAssetsTotal: NaN,
  currentAssets: NaN,
  longTermLiabilitiesTotal: NaN,
  shortTermLiabilitiesTotal: NaN,
  equityTotal: NaN,
})
