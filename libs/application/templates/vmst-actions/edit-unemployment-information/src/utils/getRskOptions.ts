import {
  Application,
  FormatMessage,
  ExternalData,
} from '@island.is/application/types'
import { GaldurApplicationRSKQueriesGetRSKEmployerListRskEmployer } from '@island.is/clients/vmst-unemployment'
import { getValueViaPath } from '@island.is/application/core'
import { application as applicationMessages } from '../lib/messages'

export const getEmploymentFromRsk = (
  externalData: ExternalData,
  formatMessage?: FormatMessage,
) => {
  const employmentList =
    getValueViaPath<
      Array<GaldurApplicationRSKQueriesGetRSKEmployerListRskEmployer>
    >(
      externalData,
      'currentApplicationInformation.data.rskEmploymentInformation',
      [],
    ) ?? []

  const extendedList = [
    ...employmentList.map((x) => {
      return {
        employerSSN: x.ssn,
        employer: x.name,
      }
    }),
    {
      employerSSN: '-',
      employer: formatMessage
        ? formatMessage(applicationMessages.unregisteredEmployer)
        : '',
    },
  ]

  return extendedList
}

export const getRskOptions = (
  application: Application,
  formatMessage?: FormatMessage,
) => {
  const employmentList = getEmploymentFromRsk(
    application.externalData,
    formatMessage,
  )
  return employmentList
    .filter((x) => !!x.employerSSN)
    .map((job) => ({
      value: job.employerSSN ?? '',
      label:
        job.employerSSN !== '-'
          ? `${job.employer || ''}, ${job.employerSSN || ''}`
          : job.employer || '',
    }))
}
