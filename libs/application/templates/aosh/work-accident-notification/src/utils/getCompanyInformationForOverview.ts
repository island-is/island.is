import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormatMessage,
  FormValue,
} from '@island.is/application/types'
import { information, overview } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import {
  BasicCompanyType,
  CompanyLaborProtectionType,
  CompanyType,
} from '../lib/dataSchema'
import {
  SizeOfTheEnterpriseDto,
  WorkplaceHealthAndSafetyDto,
} from '@island.is/clients/work-accident-ver'
import { formatPhoneNumber } from './formatPhonenumber'

export const getCompanyInformationForOverview = (
  answers: FormValue,
  externalData: ExternalData,
  formatMessage: FormatMessage,
) => {
  const basicCompany = getValueViaPath<BasicCompanyType>(
    answers,
    'basicInformation',
  )
  const company = getValueViaPath<CompanyType>(answers, 'companyInformation')
  const companyLaborProtection = getValueViaPath<CompanyLaborProtectionType>(
    answers,
    'companyLaborProtection',
  )
  const sizeOfEnterprises =
    getValueViaPath<SizeOfTheEnterpriseDto[]>(
      externalData,
      'aoshData.data.sizeOfTheEnterprise',
    ) ?? []
  const workplaceHealthAndSafety =
    getValueViaPath<WorkplaceHealthAndSafetyDto[]>(
      externalData,
      'aoshData.data.workplaceHealthAndSafety',
    ) ?? []
  const chosenSizeOfEnterprise = sizeOfEnterprises.find(
    (size) => basicCompany?.numberOfEmployees === size?.code,
  )

  return [
    basicCompany?.name ?? undefined,
    basicCompany?.nationalId
      ? formatKennitala(basicCompany.nationalId)
      : undefined,
    `${basicCompany?.address ?? ''}, ${basicCompany?.postnumber ?? ''}`,
    company?.industryClassification ?? undefined,
    chosenSizeOfEnterprise?.name ?? undefined,
    `${formatMessage(information.labels.workhealth.sectionTitle)}: ${
      workplaceHealthAndSafety.length > 0
        ? companyLaborProtection?.workhealthAndSafetyOccupation
            ?.map((c) => {
              return workplaceHealthAndSafety.find((x) => c === x.code)?.name
            })
            ?.join(', ')
        : ''
    }`,

    `${formatMessage(overview.labels.email)}: ${company?.email}`,
    `${formatMessage(overview.labels.phonenumber)}: ${formatPhoneNumber(
      company?.phonenumber ?? '',
    )}`,
  ].filter((n) => n)
}
