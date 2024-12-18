import { EmailRecipient } from './types'
import { join } from 'path'
import { SecondarySchoolAnswers } from '@island.is/application/templates/secondary-school'
import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

export const pathToAsset = (file: string) => {
  return join(__dirname, `./secondary-school-assets/${file}`)
}

export const getRecipients = (answers: FormValue): Array<EmailRecipient> => {
  const recipientList: Array<EmailRecipient> = []

  // Applicant
  const applicant = getValueViaPath<SecondarySchoolAnswers['applicant']>(
    answers,
    'applicant',
  )
  if (applicant) {
    recipientList.push({
      nationalId: applicant.nationalId,
      name: applicant.name,
      email: applicant.email,
    })
  }

  // Custodians
  const custodians =
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      answers,
      'custodians',
    ) || []
  for (let i = 0; i < custodians.length; i++) {
    if (custodians[i].nationalId) {
      recipientList.push({
        nationalId: custodians[i].nationalId || '',
        name: custodians[i].name || '',
        email: custodians[i].email || '',
      })
    }
  }

  // Other contacts
  const otherContacts =
    getValueViaPath<SecondarySchoolAnswers['otherContacts']>(
      answers,
      'otherContacts',
    ) || []
  for (let i = 0; i < otherContacts.length; i++) {
    if (otherContacts[i].include) {
      recipientList.push({
        nationalId: otherContacts[i].nationalId || '',
        name: otherContacts[i].name || '',
        email: otherContacts[i].email || '',
      })
    }
  }

  return recipientList
}
