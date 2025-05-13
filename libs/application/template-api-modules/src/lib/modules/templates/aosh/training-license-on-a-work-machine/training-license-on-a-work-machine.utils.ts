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
  return {
    nationalId: applicantInformation?.nationalId ?? '',
    name: applicantInformation?.name ?? '',
    phoneNumber: applicantInformation?.phone ?? '',
    email: applicantInformation?.email ?? '',
    postalCode: parseInt(applicantInformation?.postCode ?? '0', 10),
    drivingLicenseNumber: applicantInformation?.driversLicenseNumber ?? '',
  }
}

export const getCleanCompanyInformationList = (
  application: Application,
): Company[] => {
  const companyInformation = getValueViaPath<
    TrainingLicenseOnAWorkMachine['assigneeInformation']
  >(application.answers, 'assigneeInformation')
  const assigneeInformation = companyInformation ?? []

  return assigneeInformation.map((info) => ({
    companyName: info?.company.name ?? '',
    companyNationalId: info?.company.nationalId ?? '',
    contactNationalId: info?.assignee.nationalId ?? '',
    contactName: info?.assignee.name ?? '',
    contactPhoneNumber: info?.assignee.phone ?? '',
    contactEmail: info?.assignee.email ?? '',
    machineRegistrationNumbers:
      info?.workMachine?.map((x) => x.split(' ')[0]) ?? [],
  }))
}

export const getCleanCertificateOfTenure = (
  application: Application,
): CertificateOfTenure[] => {
  const certificateOfTenure = getValueViaPath<
    TrainingLicenseOnAWorkMachine['certificateOfTenure']
  >(application.answers, 'certificateOfTenure')
  return (
    certificateOfTenure?.map(
      ({
        machineNumber,
        machineType,
        dateFrom,
        dateTo,
        tenureInHours,
        isContractor,
      }) => ({
        machineRegistrationNumber: machineNumber,
        machineType: machineType,
        dateWorkedOnMachineFrom: new Date(dateFrom),
        dateWorkedOnMachineTo: new Date(dateTo),
        hoursWorkedOnMachine: parseInt(tenureInHours, 10),
        wasSelfEmployed: isContractor?.includes('yes') ?? false,
      }),
    ) ?? []
  )
}
