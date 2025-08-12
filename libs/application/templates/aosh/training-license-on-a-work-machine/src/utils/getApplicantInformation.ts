import { getValueViaPath } from '@island.is/application/core'
import { FormValue, KeyValueItem } from '@island.is/application/types'
import { overview } from '../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { formatPhoneNumber } from './formatPhoneNumber'

export const getApplicantOverviewInformation = (
  answers: FormValue,
  isAssignee?: boolean,
): Array<KeyValueItem> => {
  const applicantNationalId = getValueViaPath<string>(
    answers,
    'information.nationalId',
  )
  const applicantName = getValueViaPath<string>(answers, 'information.name')
  const applicantAddress = getValueViaPath<string>(
    answers,
    'information.address',
  )
  const applicantPostCode = getValueViaPath<string>(
    answers,
    'information.postCode',
  )
  const applicantEmail = getValueViaPath<string>(answers, 'information.email')
  const applicantPhone = getValueViaPath<string>(answers, 'information.phone')

  return [
    {
      width: 'full',
      keyText: overview.labels.applicant,
      valueText: isAssignee
        ? [
            {
              ...overview.applicant.name,
              values: {
                value: applicantName,
              },
            },
            {
              ...overview.applicant.nationalId,
              values: {
                value: formatKennitala(applicantNationalId ?? ''),
              },
            },
          ]
        : [
            {
              ...overview.applicant.name,
              values: {
                value: applicantName,
              },
            },
            {
              ...overview.applicant.nationalId,
              values: {
                value: formatKennitala(applicantNationalId ?? ''),
              },
            },
            {
              ...overview.applicant.address,
              values: {
                value: applicantAddress,
              },
            },
            {
              ...overview.applicant.postCode,
              values: {
                value: applicantPostCode,
              },
            },
            {
              ...overview.applicant.email,
              values: {
                value: applicantEmail,
              },
            },
            {
              ...overview.applicant.phone,
              values: {
                value: formatPhoneNumber(applicantPhone ?? ''),
              },
            },
          ],
    },
  ]
}
