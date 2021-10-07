import get from 'lodash/get'
import { Agency, ComplaintDto, ContactInfo, TargetOfComplaint } from './models'
import {
  OnBehalf,
  subjectOfComplaintValueLabelMapper,
  onBehalfValueLabelMapper,
  SubjectOfComplaint,
  DataProtectionComplaint,
  yesNoValueLabelMapper,
  YES,
  NO,
} from '@island.is/application/templates/data-protection-complaint'
import { Application } from '@island.is/application/core'
import * as kennitala from 'kennitala'
import {
  CreateCaseRequest,
  CreateQuickCaseRequest,
  DocumentInfo,
  LinkedContact,
  Metadata,
} from '@island.is/clients/data-protection-complaint'
import { generateApplicationPdf } from './pdfGenerators'
import { DataProtectionAttachment } from './models/attachments'

type YesOrNo = typeof YES | typeof NO

const extractAnswer = <T>(
  object: unknown,
  path: string,
  defaultValue: unknown | undefined = undefined,
): T => {
  const value = get(object, path, defaultValue)
  if (defaultValue === undefined && typeof value === 'undefined') {
    throw new Error(`ComplaintDto.extractAnswer: missing value for ${path}`)
  }

  return value
}

export const getComplaintTargets = (
  answers: DataProtectionComplaint,
): TargetOfComplaint[] => {
  const targets = extractAnswer<TargetOfComplaint[]>(answers, 'complainees', [])
  return targets
}

export const getAgencies = (application: Application): Agency[] => {
  return extractAnswer<Agency[]>(application.answers, 'commissions.persons', [])
}

export const getAndFormatOnBehalf = (application: Application): string => {
  const onBehalf = extractAnswer<OnBehalf>(application.answers, 'info.onBehalf')

  return onBehalfValueLabelMapper[onBehalf].defaultMessage
}

export const getAndFormatSubjectsOfComplaint = (
  answers: DataProtectionComplaint,
): string[] => {
  const values = extractAnswer<SubjectOfComplaint[]>(
    answers,
    'subjectOfComplaint.values',
  )

  return [
    ...values.map((subject) => {
      return subjectOfComplaintValueLabelMapper[subject].defaultMessage
    }),
  ]
}

export const gatherContacts = (
  answers: DataProtectionComplaint,
): LinkedContact[] => {
  const contact = getContactInfo(answers)
  //Kvartandi - main contact
  const complaintant = {
    type: getContactType(contact.nationalId),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    city: contact.city,
    idnumber: contact.nationalId,
    postalCode: contact.postalCode,
    role: 'Kvartandi',
    primary: 'true',
  }

  //Ábyrgðaraðili - subject of complaint
  const complainees = getComplaintTargets(answers).map(
    (target: TargetOfComplaint, index: number) => {
      return {
        type: getContactType(target.nationalId),
        name: target.name,
        address: target.address,
        idnumber: target.nationalId,
        role: 'Ábyrgðaraðili',
        primary: index === 0 ? 'true' : 'false',
        webPage: '',
      }
    },
  )

  return [complaintant, ...complainees]
}

export const getContactType = (nationalId: string): string => {
  return kennitala.isCompany(nationalId) ? 'Company' : 'Individal'
}

export const applicationToQuickCaseRequest = (
  application: Application,
): CreateQuickCaseRequest => {
  const answers = application.answers as DataProtectionComplaint

  return {
    category: 'Kvörtun',
    subject: 'kvörtun frá ísland.is',
    keywords: getAndFormatSubjectsOfComplaint(answers),
    metadata: toRequestMetadata(answers),
    template: 'Kvörtun',
  }
}

export const applicationToCaseRequest = async (
  application: Application,
  attachments: DataProtectionAttachment[],
): Promise<CreateCaseRequest> => {
  const answers = application.answers as DataProtectionComplaint

  return {
    category: 'Kvörtun',
    subject: 'kvörtun frá ísland.is',
    keywords: getAndFormatSubjectsOfComplaint(answers),
    metadata: toRequestMetadata(answers),
    template: 'Kvörtun',
    contacts: gatherContacts(answers),
    documents: gatherDocuments(attachments),
  }
}

const gatherDocuments = (
  attachments: DataProtectionAttachment[],
): DocumentInfo[] => {
  return attachments.map((attachment) => {
    return {
      content: attachment.content,
      subject: 'Kvörtun',
      fileName: attachment.name,
      type: 'Other',
    } as DocumentInfo
  })
}

export const toRequestMetadata = (
  answers: DataProtectionComplaint,
): Metadata[] => {
  const onBehalf = extractAnswer<OnBehalf>(answers, 'info.onBehalf')

  const targets = getComplaintTargets(answers)
  const mainTarget = targets[0]

  if (!mainTarget)
    throw new Error('No targets of complaint found on application')

  return [
    {
      name: 'OnBehalf',
      value: onBehalf,
    },
    {
      name: 'OperatesWithinEurope',
      value:
        yesNoValueLabelMapper[mainTarget.operatesWithinEurope].defaultMessage,
    },
    {
      name: 'CountryOfOperation',
      value: mainTarget.countryOfOperation ?? '',
    },
  ]
}

export const transformApplicationToComplaintDto = (
  application: Application,
): ComplaintDto => {
  const answers = application.answers as DataProtectionComplaint
  return {
    applicantInfo: {
      name: 'Applicant',
      nationalId: extractAnswer(application, 'applicant'),
    },
    onBehalf: getAndFormatOnBehalf(application),
    agency: {
      files: [],
      persons: getAgencies(application),
    },
    contactInfo: getContactInfo(answers),
    targetsOfComplaint: getComplaintTargets(answers),
    complaintCategories: getAndFormatSubjectsOfComplaint(answers),
    attachments: [],
    description: extractAnswer(application.answers, 'complaint.description'),
    applicationPdf: '',
  }
}
export const getContactInfo = (
  answers: DataProtectionComplaint,
): ContactInfo => {
  return {
    name: extractAnswer(answers, 'applicant.name'),
    nationalId: extractAnswer(answers, 'applicant.nationalId'),
    type: extractAnswer(answers, 'applicant.email'), //person | felag/samtok,
    address: extractAnswer(answers, 'applicant.address'),
    email: extractAnswer(answers, 'applicant.email'),
    phone: extractAnswer(answers, 'applicant.phoneNumber'),
    postalCode: extractAnswer(answers, 'applicant.postalCode'),
    city: extractAnswer(answers, 'applicant.city'),
  }
}
