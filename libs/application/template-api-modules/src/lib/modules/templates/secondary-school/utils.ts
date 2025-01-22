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
  const custodians = (
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      answers,
      'custodians',
    ) || []
  ).filter((x) => !!x.nationalId)
  custodians.forEach((custodian) => {
    recipientList.push({
      nationalId: custodian.nationalId,
      name: custodian.name || '',
      email: custodian.email || '',
    })
  })

  return recipientList
}

export const getCleanContacts = (
  application: Application,
): ApplicationContact[] => {
  const result: ApplicationContact[] = []

  // Parents
  const parents = (
    getValueViaPath<NationalRegistryParent[]>(
      application.externalData,
      'nationalRegistryParents.data',
    ) || []
  ).filter((x) => !!x.nationalId)
  const parentsAnswers =
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      application.answers,
      'custodians',
    ) || []
  parents.forEach((parent, index) => {
    result.push({
      nationalId: parent.nationalId,
      name: `${parent.givenName} ${parent.familyName}`,
      phone: parentsAnswers[index]?.phone || '',
      email: parentsAnswers[index]?.email || '',
      address: parent.legalDomicile?.streetAddress,
      postalCode: parent.legalDomicile?.postalCode || undefined,
      city: parent.legalDomicile?.locality || undefined,
    })
  })

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
  otherContacts.forEach((otherContact) => {
    result.push({
      nationalId: otherContact.person.nationalId,
      name: otherContact.person.name || '',
      phone: otherContact.phone || '',
      email: otherContact.email || '',
    })
  })

  return result
}

export const getCleanSchoolSelection = (
  application: Application,
): ApplicationSelectionSchool[] => {
  const result: ApplicationSelectionSchool[] = []

  let schoolPriority = 1

  const indexKeys = [0, 1, 2]
  indexKeys.forEach((index) => {
    const selectionItem = getValueViaPath<
      SecondarySchoolAnswers['selection'][0]
    >(application.answers, `selection.${index}`)

    if (
      (selectionItem?.include || index === 0) &&
      selectionItem?.school?.id &&
      selectionItem?.firstProgram?.id
    ) {
      result.push({
        priority: schoolPriority++,
        schoolId: selectionItem.school.id,
        programs: [
          {
            priority: 1,
            programId: selectionItem.firstProgram.id,
          },
          {
            priority: 2,
            programId: selectionItem.secondProgram?.id || '',
          },
        ].filter((x) => !!x.programId),
        thirdLanguageCode: selectionItem.thirdLanguage?.code || undefined,
        nordicLanguageCode: selectionItem.nordicLanguage?.code || undefined,
        requestDormitory: selectionItem.requestDormitory?.includes(YES),
      })
    }
  })

  return result
}
