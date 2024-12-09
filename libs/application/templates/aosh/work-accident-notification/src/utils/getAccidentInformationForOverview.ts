import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormatMessage,
  FormValue,
} from '@island.is/application/types'
import { overview, shared } from '../lib/messages'
import { AccidentType, EmployeeType } from '../lib/dataSchema'
import { formatDate } from './formatDate'
import { MunicipalityDto } from '@island.is/clients/work-accident-ver'

export const getAccidentInformationForOverview = (
  answers: FormValue,
  externalData: ExternalData,
  formatMessage: FormatMessage,
) => {
  const accident = getValueViaPath<AccidentType>(answers, 'accident')
  const municipalities =
    getValueViaPath<MunicipalityDto[]>(
      externalData,
      'aoshData.data.municipality',
    ) ?? []
  const employees = getValueViaPath<EmployeeType[]>(answers, 'employee') ?? []
  const chosenMunicipality = municipalities.find(
    ({ code }) => accident?.municipality === code,
  )

  return [
    `${formatMessage(overview.labels.dateAndTime)}: ${formatDate(
      accident?.date ?? '',
    )}, ${accident?.time.slice(0, 2)}:${accident?.time.slice(2, 4)}`,
    `${formatMessage(overview.labels.didAoshCome)}:  ${formatMessage(
      accident?.didAoshCome === 'yes' ? shared.options.yes : shared.options.no,
    )}`,
    `${formatMessage(overview.labels.didPoliceCome)}: ${formatMessage(
      accident?.didPoliceCome === 'yes'
        ? shared.options.yes
        : shared.options.no,
    )}`,
    `${formatMessage(overview.labels.injuredAmount)}: ${employees.length}`,
    `${formatMessage(overview.labels.municipality)}: ${
      chosenMunicipality?.name
    }`,
    `${formatMessage(overview.labels.exactLocation)}: ${
      accident?.exactLocation
    }`,
    `${formatMessage(overview.labels.accidentDescription)}: 
    \n ${accident?.wasDoing}
    \n ${accident?.wentWrong}
    \n ${accident?.how}`,
    `${formatMessage(overview.labels.locationOfAccident)}: ${
      accident?.accidentLocation.label
    }`,
  ].filter((n) => n)
}
