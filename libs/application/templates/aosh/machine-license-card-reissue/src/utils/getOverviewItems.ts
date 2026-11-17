import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { overview } from '../lib/messages'
import { AddressDeliveryType } from '../shared'
import { getLegalDomicileAddress } from './getAddressString'

export const getApplicantOverviewItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const get = (key: string) =>
    getValueViaPath<string>(answers, `applicant.${key}`) ?? ''
  const address = [get('address'), `${get('postalCode')} ${get('city')}`.trim()]
    .filter(Boolean)
    .join(', ')

  return [
    {
      width: 'full',
      keyText: overview.applicant.title,
      valueText: [
        { ...overview.applicant.name, values: { value: get('name') } },
        {
          ...overview.applicant.nationalId,
          values: { value: get('nationalId') },
        },
        { ...overview.applicant.address, values: { value: address } },
        { ...overview.applicant.email, values: { value: get('email') } },
        { ...overview.applicant.phone, values: { value: get('phoneNumber') } },
      ],
    },
  ]
}

export const getCardDeliveryOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const type = getValueViaPath<AddressDeliveryType>(
    answers,
    'cardDelivery.type',
  )

  if (type === AddressDeliveryType.OTHER) {
    const address = [
      getValueViaPath<string>(answers, 'cardDelivery.address'),
      getValueViaPath<string>(answers, 'cardDelivery.postalCodeAndCity'),
    ]
      .filter(Boolean)
      .join(', ')
    const recipient = getValueViaPath<string>(answers, 'cardDelivery.recipient')

    return [
      {
        width: 'full',
        keyText: overview.cardDelivery.title,
        valueText: [
          { ...overview.cardDelivery.otherAddress, values: { address } },
          ...(recipient
            ? [
                {
                  ...overview.cardDelivery.recipient,
                  values: { value: recipient },
                },
              ]
            : []),
        ],
      },
    ]
  }

  return [
    {
      width: 'full',
      keyText: overview.cardDelivery.title,
      valueText: {
        ...overview.cardDelivery.currentAddress,
        values: { address: getLegalDomicileAddress(externalData) },
      },
    },
  ]
}
