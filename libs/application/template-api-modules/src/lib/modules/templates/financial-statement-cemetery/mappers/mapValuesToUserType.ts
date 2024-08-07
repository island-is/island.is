import { getValueViaPath } from '@island.is/application/core'
import { BoardMember } from '@island.is/application/templates/financial-statements-inao/types'
import { FormValue } from '@island.is/application/types'
import {
  Contact,
  ContactType,
  ClientRoles,
  DigitalSignee,
} from '@island.is/clients/financial-statements-inao'

export const mapValuesToCemeterytype = (answers: FormValue) => {
  return {
    careIncome: Number(getValueViaPath(answers, 'cemetryIncome.careIncome')),
    burialRevenue: Number(
      getValueViaPath(answers, 'cemetryIncome.burialRevenue'),
    ),
    grantFromTheCemeteryFund: Number(
      getValueViaPath(answers, 'cemetryIncome.grantFromTheCemeteryFund'),
    ),
    otherIncome: Number(getValueViaPath(answers, 'cemetryIncome.otherIncome')),
    salaryAndSalaryRelatedExpenses: Number(
      getValueViaPath(answers, 'cemetryExpense.payroll'),
    ),
    operationOfAFuneralChapel: Number(
      getValueViaPath(answers, 'cemetryExpense.chapelExpense'),
    ),
    funeralExpenses: Number(
      getValueViaPath(answers, 'cemetryExpense.funeralCost'),
    ),
    donationsToCemeteryFund: Number(
      getValueViaPath(answers, 'cemetryExpense.cemeteryFundExpense'),
    ),
    contributionsAndGrantsToOthers: Number(
      getValueViaPath(answers, 'cemetryExpense.donationsToOther'),
    ),
    otherOperatingExpenses: Number(
      getValueViaPath(answers, 'cemetryExpense.otherOperationCost'),
    ),
    depreciation: Number(
      getValueViaPath(answers, 'cemetryExpense.depreciation'),
    ),
    financialExpenses: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalCost'),
    ),
    capitalIncome: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalIncome'),
    ),
    fixedAssetsTotal: Number(
      getValueViaPath(answers, 'cemetryAsset.fixedAssetsTotal'),
    ),
    currentAssets: Number(
      getValueViaPath(answers, 'cemetryAsset.currentAssets'),
    ),
    longTermLiabilitiesTotal: Number(
      getValueViaPath(answers, 'cemetryLiability.longTerm'),
    ),
    shortTermLiabilitiesTotal: Number(
      getValueViaPath(answers, 'cemetryLiability.shortTerm'),
    ),
    equityAtTheBeginningOfTheYear: Number(
      getValueViaPath(answers, 'cemetryEquity.equityAtTheBeginningOfTheYear'),
    ),
    revaluationDueToPriceChanges: Number(
      getValueViaPath(answers, 'cemetryEquity.revaluationDueToPriceChanges'),
    ),
    reassessmentOther: Number(
      getValueViaPath(answers, 'cemetryEquity.reevaluateOther'),
    ),
  }
}

export const getNeededCemeteryValues = (answers: FormValue) => {
  const year = getValueViaPath(
    answers,
    'conditionalAbout.operatingYear',
  ) as string
  const actorsName = getValueViaPath(
    answers,
    'about.powerOfAttorneyName',
  ) as string

  const contactsAnswer = getValueViaPath(
    answers,
    'cemeteryCaretaker',
  ) as Array<BoardMember>
  const clientPhone = getValueViaPath(answers, 'about.phoneNumber') as string
  const clientEmail = getValueViaPath(answers, 'about.email') as string

  const file = getValueViaPath(answers, 'attachments.files')

  return { year, actorsName, contactsAnswer, clientPhone, clientEmail, file }
}

export const mapContactsAnswersToContacts = (
  actor: { nationalId: string; scope: Array<string> },
  actorsName: string,
  contactsAnswer: Array<BoardMember>,
) => {
  const contacts: Array<Contact> = [
    {
      nationalId: actor.nationalId,
      name: actorsName,
      contactType: ContactType.Actor,
    },
  ]

  if (contactsAnswer) {
    contactsAnswer.map((x) => {
      const contact: Contact = {
        nationalId: x.nationalId,
        name: x.name,
        contactType:
          x.role === ClientRoles.BoardMember
            ? ContactType.BoardMember
            : ContactType.Inspector,
      }
      contacts.push(contact)
    })
  }

  return contacts
}

export const mapDigitalSignee = (clientEmail: string, clientPhone: string) => {
  const digitalSignee: DigitalSignee = {
    email: clientEmail,
    phone: clientPhone,
  }

  return digitalSignee
}
