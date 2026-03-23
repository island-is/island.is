import { ExternalData, FormTextArray } from '@island.is/application/types'

import { FormValue } from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import { overview } from '../lib/messages'
import { isContactDifferentFromApplicant } from './isContactDifferentFromApplicant'
import { RealEstateAnswers } from '../lib/dataSchema'
import { formatCurrency } from '@island.is/application/ui-components'
import { Fasteign } from '@island.is/clients/assets'

export const getApplicantOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: overview.applicant,
      valueText: [
        getValueViaPath<string>(answers, 'applicant.name') ?? '',
        formatKennitala(
          getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
        ),
        {
          ...overview.phoneNumber,
          values: {
            value:
              getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
          },
        },
        getValueViaPath<string>(answers, 'applicant.email') ?? '',
      ],
    },
  ]
}

export const getContactOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const isDifferent = isContactDifferentFromApplicant(answers)
  let valueText: FormTextArray = []
  if (isDifferent) {
    valueText = [
      {
        ...overview.name,
        values: {
          value: getValueViaPath<string>(answers, 'contact.name') ?? '',
        },
      },
      {
        ...overview.email,
        values: {
          value: getValueViaPath<string>(answers, 'contact.email') ?? '',
        },
      },
      {
        ...overview.phoneNumber,
        values: {
          value: getValueViaPath<string>(answers, 'contact.phone') ?? '',
        },
      },
    ]
  } else {
    valueText = [
      {
        ...overview.contactIsSameAsApplicant,
      },
    ]
  }

  return [
    {
      width: 'full',
      keyText: overview.contact,
      valueText: valueText,
    },
  ]
}

export const getRealEstateOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const realEstateData = getValueViaPath<RealEstateAnswers>(
    answers,
    'realEstate',
  )
  const properties = getValueViaPath<Array<Fasteign>>(
    externalData,
    'getProperties.data',
  )
  const chosenProperty = properties?.find(
    (property) => property.fasteignanumer === realEstateData?.realEstateName,
  )

  const currencyAmount = formatCurrency(realEstateData?.realEstateCost ?? '0')

  return [
    {
      width: 'full',
      keyText: overview.realEstate,
      valueText: [
        {
          ...overview.theRealEstate,
          values: {
            value: `${chosenProperty?.sjalfgefidStadfang?.birting} (${chosenProperty?.fasteignanumer})`,
          },
        },
        {
          ...overview.numberOfNewPropertyNumbers,
          values: {
            value: realEstateData?.realEstateAmount ?? 0,
          },
        },
        {
          ...overview.amountToBePaid,
          values: {
            value: currencyAmount,
          },
        },
        {
          ...overview.comments,
          values: {
            value: realEstateData?.realEstateOtherComments ?? '',
          },
        },
      ],
    },
  ]
}
