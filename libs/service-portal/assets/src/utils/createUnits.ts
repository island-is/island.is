import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { format as formatKennitala } from 'kennitala'
import chunk from 'lodash/chunk'
import isNumber from 'lodash/isNumber'

import {
  PropertyLocation,
  PropertyOwner,
  UnitOfUse,
} from '@island.is/api/schema'
import { FormatMessage } from '@island.is/application/core'

import { messages } from '../lib/messages'

import amountFormat from './amountFormat'

const ownersArray = (data: PropertyOwner[] | undefined) => {
  const ownerArray = data?.map((owner) => {
    return [
      owner.name || '',
      owner.ssn ? formatKennitala(owner.ssn) : '',
      owner.grantDisplay || '',
      isNumber(owner.ownership)
        ? `${parseFloat((owner.ownership * 100).toFixed(2))}%`
        : '',
      owner.purchaseDate
        ? format(new Date(owner.purchaseDate), 'dd.MM.yyyy', {
            locale: is,
          })
        : '',
    ]
  })
  return ownerArray && ownerArray.length > 0 ? ownerArray : [[]]
}

const unitsArray = (
  data: UnitOfUse[] | undefined,
  stadfang: PropertyLocation | undefined | null,
  formatMessage: FormatMessage,
) =>
  data?.map((unit: UnitOfUse) => {
    const locationData = unit.address || stadfang
    return {
      header: {
        title: unit.usageDisplay || '',
        value: locationData?.display || '',
      },
      rows: chunk(
        [
          {
            title: formatMessage(messages.unitsOfUseNr),
            value: unit.unitOfUseNumber || '',
          },
          {
            title: formatMessage(messages.location),
            value: locationData?.displayShort || '',
            detail: locationData?.locationNumber
              ? `${formatMessage(messages.locationNumber)}: ${
                  locationData?.locationNumber
                }`
              : undefined,
          },
          {
            title: formatMessage(messages.marking),
            value: unit.marking || '',
          },
          {
            title: formatMessage(messages.municipality),
            value: locationData?.municipality || '',
          },
          {
            title: formatMessage(messages.description),
            value: unit.explanation || '',
          },
          {
            title: formatMessage(messages.fireCompAssessment),
            value: unit.fireAssessment ? amountFormat(unit.fireAssessment) : '',
          },
          {
            title: 'Stærð',
            value: `${unit.displaySize} m²` || '',
          },
          {
            title: 'Byggingarár',
            value: unit.buildYearDisplay || '',
          },
        ],
        2,
      ),
    }
  })

export { ownersArray,unitsArray }
