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

  // Custodians
  const custodiansExternalData = (
    getValueViaPath<NationalRegistryParent[]>(
      application.externalData,
      'nationalRegistryCustodians.data',
    ) || []
  ).filter((x) => !!x.nationalId)
  const custodiansAnswers =
    getValueViaPath<SecondarySchoolAnswers['custodians']>(
      application.answers,
      'custodians',
    ) || []
  custodiansExternalData.forEach((custodian, index) => {
    result.push({
      nationalId: custodian.nationalId,
      name: `${custodian.givenName} ${custodian.familyName}`,
      phone: custodiansAnswers[index]?.phone || '',
      email: custodiansAnswers[index]?.email || '',
      address: custodian.legalDomicile?.streetAddress,
      postalCode: custodian.legalDomicile?.postalCode || undefined,
      city: custodian.legalDomicile?.locality || undefined,
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
