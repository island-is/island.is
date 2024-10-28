import { ExternalData, FormatMessage } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { EmployeeType } from '../lib/dataSchema'
import {
  EmploymentStatusOfVictimDto,
  LengthOfEmploymentDto,
  MunicipalityDto,
  WorkhourArrangementDto,
  WorkstationDto,
} from '@island.is/clients/work-accident-ver'
import { getValueViaPath } from '@island.is/application/core'
import { overview } from '../lib/messages'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { formatDate } from './formatDate'

export const getEmployeeInformationForOverview = (
  externalData: ExternalData,
  employee: EmployeeType,
  formatMessage: FormatMessage,
) => {
  // Post code
  const postCode = getValueViaPath(
    externalData,
    'aoshData.data.postCode',
    [],
  ) as MunicipalityDto[]
  const chosenPostCode = postCode.find(
    ({ code }) => employee.postnumberAndMunicipality === code,
  )

  // Nationality
  const countries = getAllCountryCodes()
  const chosenNationality = countries.find(
    ({ code }) => employee.nationality === code,
  )

  // Employment status
  const employmentStatus = getValueViaPath(
    externalData,
    'aoshData.data.employmentStatusOfVictim',
  ) as EmploymentStatusOfVictimDto[]
  const chosenEmploymentStatus = employmentStatus.find(
    ({ code }) => employee.employmentStatus === code,
  )

  // Employment time
  const employmentTime = getValueViaPath(
    externalData,
    'aoshData.data.lengthOfEmployment',
    [],
  ) as LengthOfEmploymentDto[]
  const chosenEmploymentTime = employmentTime.find(
    ({ code }) => employee.employmentTime === code,
  )

  // Workhour arrangement
  const workhourArrangement = getValueViaPath(
    externalData,
    'aoshData.data.workhourArrangement',
    [],
  ) as WorkhourArrangementDto[]
  const chosenWorkhourArrangement = workhourArrangement.find(
    ({ code }) => employee.workhourArrangement === code,
  )

  // Workstation
  const workstation = getValueViaPath(
    externalData,
    'aoshData.data.workstation',
    [],
  ) as WorkstationDto[]
  const chosenWorkstation = workstation.find(
    ({ code }) => employee.workstation === code,
  )
  return [
    employee.nationalField.name ?? '',
    formatKennitala(employee.nationalField.nationalId, '-'),
    `${employee.address ?? ''}, ${chosenPostCode?.code} ${
      chosenPostCode?.name
    }`,
    `${formatMessage(overview.employee.nationality)}: ${
      chosenNationality?.name
    }`,
    `${formatMessage(overview.employee.employmentStatus)}: ${
      chosenEmploymentStatus?.name
    }`,
    `${formatMessage(overview.employee.startDate)}: ${formatDate(
      employee.startDate,
    )}`,
    `${formatMessage(overview.employee.employmentTime)}: ${
      chosenEmploymentTime?.name
    }`,
    `${formatMessage(overview.employee.employmentRate)}: ${
      employee?.employmentRate
    }`,
    `${formatMessage(overview.employee.workhourArrangement)}: ${
      chosenWorkhourArrangement?.name
    }`,
    `${formatMessage(overview.employee.startTime)}: ${formatDate(
      employee.startOfWorkdayDate,
    )}, ${employee.startTime.slice(0, 2)}:${employee.startTime.slice(2, 4)}`,
    `${formatMessage(overview.employee.workstation)}: ${
      chosenWorkstation?.name
    }`,
    `${formatMessage(overview.employee.occupationTitle)}: ${
      employee.victimsOccupation.label
    }`,
  ].filter((n) => n)
}
