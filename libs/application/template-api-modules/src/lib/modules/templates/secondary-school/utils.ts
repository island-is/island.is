import { EmailRecipient } from './types'
import { join } from 'path'
import { SecondarySchoolAnswers } from '@island.is/application/templates/secondary-school'
import {
  Application,
  FormValue,
  NationalRegistryParent,
  YES,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationContact,
  ApplicationSelectionSchool,
} from '@island.is/clients/secondary-school'

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

  // Main other contact
  const mainOtherContact = getValueViaPath<
    SecondarySchoolAnswers['mainOtherContact']
  >(answers, 'mainOtherContact')
  if (mainOtherContact?.nationalId) {
    recipientList.push({
      nationalId: mainOtherContact.nationalId,
      name: mainOtherContact.name || '',
      email: mainOtherContact.email || '',
    })
  }

  // Other contacts
  const otherContacts = (
    getValueViaPath<SecondarySchoolAnswers['otherContacts']>(
      answers,
      'otherContacts',
    ) || []
  ).filter((x) => !!x.person.nationalId)
  for (let i = 0; i < otherContacts.length; i++) {
    recipientList.push({
      nationalId: otherContacts[i].person.nationalId,
      name: otherContacts[i].person.name || '',
      email: otherContacts[i].email || '',
    })
  }

  return recipientList
}

export const getCleanContacts = (
  application: Application,
): ApplicationContact[] => {
  const result: ApplicationContact[] = []

  // Parents
  const parents =
    (application.externalData.nationalRegistryParents
      .data as NationalRegistryParent[]) || []
  const parentsAnswers =
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      application.answers,
      'custodians',
    ) || []
  for (let i = 0; i < parents.length; i++) {
    if (parents[i].nationalId) {
      result.push({
        nationalId: parents[i].nationalId,
        name: `${parents[i].givenName} ${parents[i].familyName}`,
        phone: parentsAnswers[i]?.phone || '',
        email: parentsAnswers[i]?.email || '',
        address: parents[i].legalDomicile?.streetAddress,
        postalCode: parents[i].legalDomicile?.postalCode || undefined,
        city: parents[i].legalDomicile?.locality || undefined,
      })
    }
  }

  // Main other contact
  const mainOtherContact = getValueViaPath<
    SecondarySchoolAnswers['mainOtherContact']
  >(application.answers, 'mainOtherContact')
  if (mainOtherContact?.nationalId)
    result.push({
      nationalId: mainOtherContact.nationalId,
      name: mainOtherContact.name || '',
      phone: mainOtherContact.phone || '',
      email: mainOtherContact.email || '',
    })

  // Other contacts
  const otherContacts = (
    getValueViaPath<SecondarySchoolAnswers['otherContacts']>(
      application.answers,
      'otherContacts',
    ) || []
  ).filter((x) => !!x.person.nationalId)
  for (let i = 0; i < otherContacts.length; i++) {
    result.push({
      nationalId: otherContacts[i].person.nationalId,
      name: otherContacts[i].person.name || '',
      phone: otherContacts[i].phone || '',
      email: otherContacts[i].email || '',
    })
  }

  return result
}

export const getCleanSchoolSelection = (
  application: Application,
): ApplicationSelectionSchool[] => {
  const result: ApplicationSelectionSchool[] = []

  const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
    application.answers,
    'selection',
  )

  let schoolPriority = 0
  if (selection?.first?.school?.id && selection?.first?.firstProgram?.id) {
    result.push({
      priority: schoolPriority++,
      schoolId: selection?.first.school.id,
      programs: [
        {
          priority: 0,
          programId: selection?.first.firstProgram.id,
        },
        {
          priority: 1,
          programId: selection?.first.secondProgram?.include
            ? selection?.first.secondProgram.id || ''
            : '',
        },
      ].filter((x) => !!x.programId),
      thirdLanguageCode: selection?.first.thirdLanguage?.code || undefined,
      nordicLanguageCode: selection?.first.nordicLanguage?.code || undefined,
      requestDormitory: selection?.first.requestDormitory?.includes(YES),
    })
  }
  if (
    selection?.second?.include &&
    selection?.second?.school?.id &&
    selection?.second?.firstProgram?.id
  ) {
    result.push({
      priority: schoolPriority++,
      schoolId: selection?.second.school.id,
      programs: [
        {
          priority: 0,
          programId: selection?.second.firstProgram.id,
        },
        {
          priority: 1,
          programId: selection?.second.secondProgram?.include
            ? selection?.second.secondProgram.id || ''
            : '',
        },
      ].filter((x) => !!x.programId),
      thirdLanguageCode: selection?.second.thirdLanguage?.code || undefined,
      nordicLanguageCode: selection?.second.nordicLanguage?.code || undefined,
      requestDormitory: selection?.second.requestDormitory?.includes(YES),
    })
  }
  if (
    selection?.third?.include &&
    selection?.third?.school?.id &&
    selection?.third?.firstProgram?.id
  ) {
    result.push({
      priority: schoolPriority++,
      schoolId: selection?.third.school.id,
      programs: [
        {
          priority: 0,
          programId: selection?.third.firstProgram.id,
        },
        {
          priority: 1,
          programId: selection?.third.secondProgram?.include
            ? selection?.third.secondProgram.id || ''
            : '',
        },
      ].filter((x) => !!x.programId),
      thirdLanguageCode: selection?.third.thirdLanguage?.code || undefined,
      nordicLanguageCode: selection?.third.nordicLanguage?.code || undefined,
      requestDormitory: selection?.third.requestDormitory?.includes(YES),
    })
  }

  return result
}
