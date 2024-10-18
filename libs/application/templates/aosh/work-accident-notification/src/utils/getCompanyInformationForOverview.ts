import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormatMessage,
  FormValue,
} from '@island.is/application/types'
import { information } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { CompanyLaborProtectionType, CompanyType } from '../lib/dataSchema'
import {
  SizeOfTheEnterpriseDto,
  WorkplaceHealthAndSafetyDto,
} from '@island.is/clients/work-accident-ver'

export const getCompanyInformationForOverview = (
  answers: FormValue,
  externalData: ExternalData,
  formatMessage: FormatMessage,
) => {
  const company = getValueViaPath(answers, 'companyInformation') as CompanyType
  const companyLaborProtection = getValueViaPath(
    answers,
    'companyLaborProtection',
  ) as CompanyLaborProtectionType
  const sizeOfEnterprises = getValueViaPath(
    externalData,
    'aoshData.data.sizeOfTheEnterprise',
    [],
  ) as SizeOfTheEnterpriseDto[]
  const workplaceHealthAndSafety = getValueViaPath(
    externalData,
    'aoshData.data.workplaceHealthAndSafety',
    [],
  ) as WorkplaceHealthAndSafetyDto[]
  const chosenSizeOfEnterprise = sizeOfEnterprises.find(
    (size) => company.numberOfEmployees === size?.code,
  )

  return [
    company.name ?? undefined,
    company.nationalId ? formatKennitala(company.nationalId) : undefined,
    `${company.address ?? ''}, ${company.postnumber ?? ''}`,
    company.industryClassification ?? undefined,
    chosenSizeOfEnterprise?.name ?? undefined,
    `${formatMessage(information.labels.workhealth.sectionTitle)}: ${
      workplaceHealthAndSafety.length > 0
        ? companyLaborProtection.workhealthAndSafetyOccupation
            ?.map((c) => {
              return workplaceHealthAndSafety.find((x) => c === x.code)?.name
            })
            ?.join(', ')
        : ''
    }`,
  ].filter((n) => n)
}
