import {
  ComplaintsToAlthingiOmbudsmanAnswers,
  ComplainedForTypes,
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
  return {
    category: 'Kvörtun',
    subject: 'Kvörtun frá ísland.is',
    template: 'Kvörtun',
    contacts: gatherContacts(answers),
    documents: attachments,
  }
}

const getContactInfo = (
  answers: ComplaintsToAlthingiOmbudsmanAnswers,
): ComplainerContactInfo => {
  let contact = answers.applicant
  if (answers.complainedFor.decision == ComplainedForTypes.SOMEONEELSE) {
    contact = answers.complainedForInformation as typeof answers.applicant
  } else {
    contact = answers.applicant
  }
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
  }

  const complainee = {
    type: 'Company',
    name: answers.complaintDescription.complaineeName,
    email: '',
    phone: '',
    address: '',
    city: '',
    idnumber: '0000000001',
    postalCode: '',
    role: ContactRole.GOVERNMENT,
    primary: 'false',
    webPage: '',
  }
  return [complaintant, complainee]
}
