import {
  ClientRoles,
  Contact,
  ContactType,
} from '@island.is/clients/financial-statements-inao'
import * as mapper from './mapValuesToUserType'

describe('mapValuesToUserType', () => {
  describe('mapValuesToCemeterytype', () => {
    it('should map correctly', () => {
      const answers = {
        'cemetryIncome.careIncome': 100,
        'cemetryIncome.burialRevenue': 101,
        'cemetryIncome.grantFromTheCemeteryFund': 102,
        'cemetryIncome.otherIncome': 103,
        'cemetryExpense.payroll': 104,
        'cemetryExpense.chapelExpense': 105,
        'cemetryExpense.funeralCost': 106,
        'cemetryExpense.cemeteryFundExpense': 107,
        'cemetryExpense.donationsToOther': 108,
        'cemetryExpense.otherOperationCost': 109,
        'cemetryExpense.depreciation': 110,
        'capitalNumbers.capitalCost': 111,
        'capitalNumbers.capitalIncome': 112,
        'cemetryAsset.fixedAssetsTotal': 113,
        'cemetryAsset.currentAssets': 114,
        'cemetryLiability.longTerm': 115,
        'cemetryLiability.shortTerm': 116,
        'cemetryEquity.equityAtTheBeginningOfTheYear': 117,
        'cemetryEquity.revaluationDueToPriceChanges': 118,
        'cemetryEquity.reevaluateOther': 119,
      }

      const expectedResult = {
        careIncome: 100,
        burialRevenue: 101,
        grantFromTheCemeteryFund: 102,
        otherIncome: 103,
        salaryAndSalaryRelatedExpenses: 104,
        operationOfAFuneralChapel: 105,
        funeralExpenses: 106,
        donationsToCemeteryFund: 107,
        contributionsAndGrantsToOthers: 108,
        otherOperatingExpenses: 109,
        depreciation: 110,
        financialExpenses: 111,
        capitalIncome: 112,
        fixedAssetsTotal: 113,
        currentAssets: 114,
        longTermLiabilitiesTotal: 115,
        shortTermLiabilitiesTotal: 116,
        equityAtTheBeginningOfTheYear: 117,
        revaluationDueToPriceChanges: 118,
        reassessmentOther: 119,
      }

      const result = mapper.mapValuesToCemeterytype(answers)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('getNeededCemeteryValues', () => {
    it('should map correctly', () => {
      const actorName = 'Someone Important'
      const year = '1999'
      const phone = '1234567'
      const email = 'mock@mockemail.com'
      const file = '123456789.pdf'
      const caretakersRaw = [
        {
          nationalId: '1234564321',
          name: 'Fullname Fullname',
          role: ClientRoles.BoardMember,
        },
        {
          nationalId: '1234564322',
          name: 'Fullername Fullername',
          role: ClientRoles.Individual,
        },
      ]

      const answers = {
        'conditionalAbout.operatingYear': year,
        'about.powerOfAttorneyName': actorName,
        cemeteryCaretaker: caretakersRaw,
        'about.phoneNumber': phone,
        'about.email': email,
        'attachments.files': file,
      }

      const expectedResult = {
        year: year,
        actorsName: actorName,
        contactsAnswer: caretakersRaw,
        clientPhone: phone,
        clientEmail: email,
        file: file,
      }

      const result = mapper.getNeededCemeteryValues(answers)

      expect(result).toEqual(expectedResult)
    })
  })

  describe('mapContactsAnswersToContacts', () => {
    it('should map correctly', () => {
      const actor = { nationalId: '1234564321', scope: ['not', 'relevant'] }
      const actorsName = 'Fullname Fullname'
      const boardMemberContact = {
        nationalId: '1234564321',
        name: 'Fullername Fullername',
        role: ClientRoles.BoardMember,
      }
      const individualContact = {
        nationalId: '1234564322',
        name: 'Fullestname Fullestname',
        role: ClientRoles.Individual,
      }

      const contactsAnswer = [boardMemberContact, individualContact]

      const expectedResult: Contact[] = [
        {
          nationalId: actor.nationalId,
          name: actorsName,
          contactType: ContactType.Actor,
        },
        {
          nationalId: boardMemberContact.nationalId,
          name: boardMemberContact.name,
          contactType: ContactType.BoardMember,
        },
        {
          nationalId: individualContact.nationalId,
          name: individualContact.name,
          contactType: ContactType.Inspector,
        },
      ]

      const result = mapper.mapContactsAnswersToContacts(
        actor,
        actorsName,
        contactsAnswer,
      )

      expect(result).toEqual(expectedResult)
    })
  })

  describe('mapDigitalSignee', () => {
    it('should map correctly', () => {
      const email = 'mock@mockemail.com'
      const phone = '1234567'

      const result = mapper.mapDigitalSignee(email, phone)

      expect(result.email).toEqual(email)
      expect(result.phone).toEqual(phone)
    })
  })
})
