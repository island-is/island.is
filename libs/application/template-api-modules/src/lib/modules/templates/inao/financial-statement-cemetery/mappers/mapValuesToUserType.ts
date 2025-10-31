import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  Contact,
  ContactType,
  ClientRoles,
  DigitalSignee,
} from '@island.is/clients/financial-statements-inao'

type BoardMember = {
  nationalId: string
  name: string
  role: string
}

export const mapValuesToCemeterytype = (answers: FormValue) => {
  return {
    careIncome: Number(getValueViaPath(answers, 'cemeteryIncome.careIncome')),
    burialRevenue: Number(
      getValueViaPath(answers, 'cemeteryIncome.burialRevenue'),
    ),
    grantFromTheCemeteryFund: Number(
      getValueViaPath(answers, 'cemeteryIncome.grantFromTheCemeteryFund'),
    ),
    otherIncome: Number(getValueViaPath(answers, 'cemeteryIncome.otherIncome')),
    salaryAndSalaryRelatedExpenses: Number(
      getValueViaPath(answers, 'cemeteryExpense.payroll'),
    ),
    operationOfAFuneralChapel: Number(
      getValueViaPath(answers, 'cemeteryExpense.chapelExpense'),
    ),
    funeralExpenses: Number(
      getValueViaPath(answers, 'cemeteryExpense.funeralCost'),
    ),
    donationsToCemeteryFund: Number(
      getValueViaPath(answers, 'cemeteryExpense.cemeteryFundExpense'),
    ),
    contributionsAndGrantsToOthers: Number(
      getValueViaPath(answers, 'cemeteryExpense.donationsToOther'),
    ),
    otherOperatingExpenses: Number(
      getValueViaPath(answers, 'cemeteryExpense.otherOperationCost'),
    ),
    depreciation: Number(
      getValueViaPath(answers, 'cemeteryExpense.depreciation'),
    ),
    financialExpenses: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalCost'),
    ),
    capitalIncome: Number(
      getValueViaPath(answers, 'capitalNumbers.capitalIncome'),
    ),
    fixedAssetsTotal: Number(
      getValueViaPath(answers, 'cemeteryAsset.fixedAssetsTotal'),
    ),
    currentAssets: Number(
      getValueViaPath(answers, 'cemeteryAsset.currentAssets'),
    ),
    longTermLiabilitiesTotal: Number(
      getValueViaPath(answers, 'cemeteryLiability.longTerm'),
    ),
    shortTermLiabilitiesTotal: Number(
      getValueViaPath(answers, 'cemeteryLiability.shortTerm'),
    ),
    equityAtTheBeginningOfTheYear: Number(
      getValueViaPath(answers, 'cemeteryEquity.equityAtTheBeginningOfTheYear'),
    ),
    revaluationDueToPriceChanges: Number(
      getValueViaPath(answers, 'cemeteryEquity.revaluationDueToPriceChanges'),
    ),
    reassessmentOther: Number(
      getValueViaPath(answers, 'cemeteryEquity.reevaluateOther'),
    ),
  }
}

export const getNeededCemeteryValues = (answers: FormValue) => {
  const year = getValueViaPath<string>(
    answers,
    'conditionalAbout.operatingYear',
  )
  const actorsName = getValueViaPath<string>(
    answers,
    'about.powerOfAttorneyName',
  )

  const contactsAnswer = getValueViaPath<Array<BoardMember>>(
    answers,
    'cemeteryCaretaker',
  )
  const clientPhone = getValueViaPath<string>(answers, 'about.phoneNumber')
  const clientEmail = getValueViaPath<string>(answers, 'about.email')

  const file = getValueViaPath(answers, 'attachments.files')

  return { year, actorsName, contactsAnswer, clientPhone, clientEmail, file }
}

export const mapContactsAnswersToContacts = (
  actor: { nationalId: string; scope: Array<string> },
  actorsName: string,
  contactsAnswer?: Array<BoardMember>,
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
