import { Application } from '@island.is/application/types'
import { Applicant, CertificateOfTenure, Company } from './types'
import { getValueViaPath } from '@island.is/application/core'
import { TrainingLicenseOnAWorkMachine } from '@island.is/application/templates/aosh/training-license-on-a-work-machine'
import { join } from 'path'
import { EmailRecipient } from './types'

export const getApplicationPruneDateStr = (
  applicationCreated: Date,
): string => {
  const expiresAfterDays = 7
  const date = new Date(applicationCreated)
  date.setDate(date.getDate() + expiresAfterDays)

  return (
    ('0' + date.getDate()).slice(-2) +
    '.' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '.' +
    date.getFullYear()
  )
}

export const pathToAsset = (file: string) => {
  return join(
    __dirname,
    `./aosh-training-license-on-a-work-machine-assets/${file}`,
  )
}

export const getRecipient = (company: Company): EmailRecipient => {
  return {
    ssn: company.contactNationalId || '',
    name: company.contactName || '',
    email: company.contactEmail,
    phone: company.contactPhoneNumber,
  }
}

export const getCleanApplicantInformation = (
  application: Application,
): Applicant => {
  const applicantInformation = getValueViaPath<
    TrainingLicenseOnAWorkMachine['information']
  >(application.answers, 'information')
  const isContractor = getValueViaPath<string[]>(
    application.answers,
    'assigneeInformation.isContractor',
  )

  return {
    nationalId: applicantInformation?.nationalId ?? '',
    name: applicantInformation?.name ?? '',
    phoneNumber: applicantInformation?.phone ?? '',
    email: applicantInformation?.email ?? '',
    postalCode: parseInt(applicantInformation?.postCode ?? '0', 10),
    isSelfEmployed: isContractor?.includes('yes') ?? false,
  }
}

export const getCleanCompanyInformation = (
  application: Application,
): Company => {
  const companyInformation = getValueViaPath<
    TrainingLicenseOnAWorkMachine['assigneeInformation']
  >(application.answers, 'assigneeInformation')
  const isContractor =
    companyInformation?.isContractor?.includes('yes') ?? false

  return {
    companyName: isContractor ? '' : companyInformation?.company.name ?? '',
    companyNationalId: isContractor
      ? ''
      : companyInformation?.company.nationalId ?? '',
    contactNationalId: isContractor
      ? ''
      : companyInformation?.assignee.nationalId ?? '',
    contactName: isContractor ? '' : companyInformation?.assignee.name ?? '',
    contactPhoneNumber: isContractor
      ? ''
      : companyInformation?.assignee.phone ?? '',
    contactEmail: isContractor ? '' : companyInformation?.assignee.email ?? '',
  }
}

export const getCleanCertificateOfTenure = (
  application: Application,
): CertificateOfTenure => {
  const certificateOfTenure = getValueViaPath<
    TrainingLicenseOnAWorkMachine['certificateOfTenure']
  >(application.answers, 'certificateOfTenure')
  return {
    machineRegistrationNumber: certificateOfTenure?.machineNumber ?? '',
    licenseCategoryPrefix: certificateOfTenure?.licenseCategoryPrefix ?? '',
    machineType: certificateOfTenure?.machineType ?? '',
    dateWorkedOnMachineFrom: certificateOfTenure?.dateFrom
      ? new Date(certificateOfTenure.dateFrom)
      : new Date(),
    dateWorkedOnMachineTo: certificateOfTenure?.dateTo
      ? new Date(certificateOfTenure.dateTo)
      : new Date(),
    hoursWorkedOnMachine: parseInt(
      certificateOfTenure?.tenureInHours ?? '0',
      10,
    ),
  }
}
