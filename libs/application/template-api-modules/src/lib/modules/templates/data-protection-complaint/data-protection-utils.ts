import get from 'lodash/get'
import { Agency, ComplaintDto, TargetOfComplaint } from './models'
import {
  OnBehalf,
  subjectOfComplaintValueLabelMapper,
  onBehalfValueLabelMapper,
  SubjectOfComplaint,
} from '@island.is/application/templates/data-protection-complaint'
import { Application } from '@island.is/application/core'

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
  application: Application,
): TargetOfComplaint[] => {
  const firstTarget = extractAnswer<TargetOfComplaint>(
    application.answers,
    'complainee',
  )
  const otherTargets = extractAnswer<TargetOfComplaint[]>(
    application.answers,
    'additionalComplainees',
    [],
  )

  return [firstTarget, ...otherTargets]
}

export const getAgencies = (application: Application): Agency[] => {
  return extractAnswer<Agency[]>(application.answers, 'commissions.persons', [])
}

export const getAndFormatOnBehalf = (application: Application): string => {
  const onBehalf = extractAnswer<OnBehalf>(application.answers, 'info.onBehalf')

  return onBehalfValueLabelMapper[onBehalf].defaultMessage
}

export const getAndFormatSubjectsOfComplaint = (
  application: Application,
): string[] => {
  const other = extractAnswer<SubjectOfComplaint[]>(
    application.answers,
    'subjectOfComplaint.other',
  )
  const authorities = extractAnswer<SubjectOfComplaint[]>(
    application.answers,
    'subjectOfComplaint.authorities',
  )
  const useOfPersonalInformation = extractAnswer<SubjectOfComplaint[]>(
    application.answers,
    'subjectOfComplaint.useOfPersonalInformation',
  )

  const enums = [...other, ...authorities, ...useOfPersonalInformation]

  const somethingElse =
    extractAnswer<string>(
      application.answers,
      'subjectOfComplaint.somethingElse',
    ) ?? ''

  return [
    ...enums.map((subject) => {
      return subjectOfComplaintValueLabelMapper[subject].defaultMessage
    }),
    somethingElse,
  ]
}

export const transformApplicationToComplaintDto = (
  application: Application,
): ComplaintDto => {
  console.log(application.answers)
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
    contactInfo: {
      name: extractAnswer(application.answers, 'applicant.name'),
      nationalId: extractAnswer(application.answers, 'applicant.nationalId'),
      type: extractAnswer(application.answers, 'applicant.email'), //person | felag/samtok,
      address: extractAnswer(application.answers, 'applicant.address'),
      email: extractAnswer(application.answers, 'applicant.email'),
      phone: extractAnswer(application.answers, 'applicant.phoneNumber'),
      postalCode: extractAnswer(application.answers, 'applicant.postalCode'),
      city: extractAnswer(application.answers, 'applicant.city'),
    },
    targetsOfComplaint: getComplaintTargets(application),
    complaintCategories: getAndFormatSubjectsOfComplaint(application),
    attachments: [],
    description: extractAnswer(application.answers, 'complaint.description'),
    applicationPdf: '',
  }
}
