import * as financialHelper from './helpers'
import { FinancialElectionIncomeLimit } from './helpers'

describe('Financial statement individual election helpers', () => {
  describe('getIndividualElectionValues', () => {
    it.each([
      { income: FinancialElectionIncomeLimit.LESS, valueStatement: true },
      { income: FinancialElectionIncomeLimit.GREATER, valueStatement: false },
    ])('should map correctly', (incomeValueStatementCombo) => {
      const expectedResult = {
        noValueStatement: incomeValueStatementCombo.valueStatement,
        incomeLimit: incomeValueStatementCombo.income,
        electionId: 'blegh',
        clientName: 'Fullname Fullname',
        clientPhone: '1234567',
        clientEmail: 'email@mockemail.com',
      }

      const answers = {
        'incomeLimit.limit': expectedResult.incomeLimit,
        'election.electionId': expectedResult.electionId,
        'about.fullName': expectedResult.clientName,
        'about.phoneNumber': expectedResult.clientPhone,
        'about.email': expectedResult.clientEmail,
      }

      const result = financialHelper.getIndividualElectionValues(answers)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('getShouldGetFileName', () => {
    it.each([
      { input: FinancialElectionIncomeLimit.LESS, expectedOutput: false },
      { input: FinancialElectionIncomeLimit.GREATER, expectedOutput: true },
    ])('should map correctly', (inputOutputCombo) => {
      const answers = {
        'incomeLimit.limit': inputOutputCombo.input,
      }

      const result = financialHelper.getShouldGetFileName(answers)

      expect(result).toEqual(inputOutputCombo.expectedOutput)
    })
  })

  describe('getInput', () => {
    it('should return correct input and loggerInfo', () => {
      const result = financialHelper.getInput(
        answers,
        nationalIdClient,
        fileName,
      )

      expect(result.input).toEqual(expectedInputResult)
      expect(result.loggerInfo.includes(nationalIdClient)).toBeTruthy()
      expect(result.loggerInfo.includes(electionId)).toBeTruthy()
      expect(result.loggerInfo.includes(clientName)).toBeTruthy()
      expect(
        result.loggerInfo.includes(fileName.length.toString()),
      ).toBeTruthy()
      otherAnswersMappedKeyNames.forEach((keyName) => {
        expect(result.loggerInfo.includes(keyName)).toBeTruthy()
      })
    })

    const fileName = '98498465654849896546.pdf'
    const electionId = 'blegh'
    const nationalIdClient = '1234564322'
    const clientName = 'Fullname Fullname'
    const clientPhone = '1234567'
    const clientEmail = 'email@mockemail.com'
    const otherAnswersRaw = {
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
    }

    const answers = {
      'election.incomeLimit': FinancialElectionIncomeLimit.GREATER,
      'election.electionId': electionId,
      'about.fullName': clientName,
      'about.phoneNumber': clientPhone,
      'about.email': clientEmail,
      ...otherAnswersRaw,
    }

    const otherAnswersMapped = {
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
    }

    const otherAnswersMappedKeyNames = Object.keys(otherAnswersMapped)

    const expectedInputResult = {
      client: {
        nationalId: nationalIdClient,
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
      },
      digitalSignee: {
        phone: clientPhone,
        email: clientEmail,
      },
      electionId: electionId,
      noValueStatement: false,
      values: {
        ...otherAnswersMapped,
      },
      file: fileName,
    }
  })
})
