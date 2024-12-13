import { EmailRecipient } from './types'
import { join } from 'path'
import { SecondarySchoolAnswers } from '@island.is/application/templates/secondary-school'

export const pathToAsset = (file: string) => {
  return join(__dirname, `./secondary-school-assets/${file}`)
}

export const getRecipients = (
  answers: SecondarySchoolAnswers,
): Array<EmailRecipient> => {
  const recipientList: Array<EmailRecipient> = []

  // Applicant
  recipientList.push({
    nationalId: answers.applicant.nationalId,
    name: answers.applicant.name,
    email: answers.applicant.email,
  })

  // Custodians
  const custodians = answers?.custodians || []
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
  const otherContacts = answers?.otherContacts || []
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
