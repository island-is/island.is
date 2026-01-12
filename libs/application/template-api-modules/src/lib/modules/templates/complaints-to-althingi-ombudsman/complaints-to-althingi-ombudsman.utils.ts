import {
  ComplaintsToAlthingiOmbudsmanAnswers,
  ComplainedForTypes,
  GenderAnswerOptions,
} from '@island.is/application/templates/complaints-to-althingi-ombudsman'
import { Application } from '@island.is/application/types'
import {
  CreateCaseRequest,
  DocumentInfo,
  LinkedContact,
} from '@island.is/clients/althingi-ombudsman'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'
import { ComplainerContactInfo, ContactRole } from './models/complaint'
import { getValueViaPath } from '@island.is/application/core'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/complaints-to-althingi-ombudsman/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./complaints-to-althingi-ombudsman-assets/${file}`)
}

export const applicationToCaseRequest = async (
  application: Application,
  attachments: DocumentInfo[],
): Promise<CreateCaseRequest> => {
  const answers = application.answers as ComplaintsToAlthingiOmbudsmanAnswers
  const contacts = gatherContacts(answers)

  const metadata = contacts[0]?.gender
    ? [
        {
          name: 'GenderMod',
          value: contacts[0].gender,
        },
      ]
    : undefined

  return {
    category: 'Kvörtun',
    subject: 'Kvörtun frá ísland.is',
    template: 'Kvörtun',
    contacts,
    documents: attachments,
    metadata,
  }
}

const getContactInfo = (
  answers: ComplaintsToAlthingiOmbudsmanAnswers,
): ComplainerContactInfo => {
  const contact =
    answers.complainedFor.decision === ComplainedForTypes.SOMEONEELSE
      ? answers.complainedForInformation
      : answers.applicant

  return {
    name: contact.name,
    nationalId: contact.nationalId,
    type: 'Individual',
    address: contact.address,
    email: contact.email ?? '',
    phone: contact.phoneNumber ?? '',
    postalCode: contact.postalCode,
    city: contact.city,
  }
}

export const gatherContacts = (
  answers: ComplaintsToAlthingiOmbudsmanAnswers,
): LinkedContact[] => {
  const contact = getContactInfo(answers)
  const genderAnswer = getValueViaPath<GenderAnswerOptions>(
    answers,
    'genderAnswer',
  )
  //Kvartandi - main contact
  const complaintant = {
    type: contact.type,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    city: contact.city,
    idnumber: contact.nationalId,
    postalCode: contact.postalCode,
    role: ContactRole.COMPLAINTANT,
    primary: 'true',
    webPage: '',
    gender: genderAnswer,
  }

  return [complaintant]
}
