import { m } from '../lib/messages/messages'
import { EmploymentStatus } from './constants'
import { m as cm, messagesCountries } from '../lib/messages/countries'
import { countries } from './countries'
import { FormText } from '@island.is/application/types'
import { NO, YES } from '@island.is/application/core'

export const statusTypeOptions = [
  {
    label: m.statusEmployed,
    value: EmploymentStatus.EMPLOYED,
    tooltip: m.statusEmployedInformation,
  },
  {
    label: m.statusStudent,
    value: EmploymentStatus.STUDENT,
    tooltip: m.statusStudentInformation,
  },
  {
    label: m.statusPensioner,
    value: EmploymentStatus.PENSIONER,
    tooltip: m.statusPensionerInformation,
  },
  {
    label: m.statusOther,
    value: EmploymentStatus.OTHER,
    tooltip: m.statusOtherInformation,
  },
]

export const countryOptions = countries.map(
  ({ name, alpha2Code: countryCode }) => {
    const option = { name, countryCode }
    return {
      label: () => {
        if (name in messagesCountries) {
          return cm[name as keyof typeof cm]
        }
        return name
      },
      value: JSON.stringify(option),
    }
  },
)

type YesNoOptions = {
  yes?: FormText
  no?: FormText
}

export const getYesNoOptions = ({ yes, no }: YesNoOptions) => {
  return [
    { label: no ?? m.noOptionLabel, value: NO },
    { label: yes ?? m.yesOptionLabel, value: YES },
  ]
}
