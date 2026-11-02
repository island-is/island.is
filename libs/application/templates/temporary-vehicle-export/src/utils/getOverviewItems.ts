import { getValueViaPath } from '@island.is/application/core'
import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import format from 'date-fns/format'
import { m } from '../lib/messages'
import {
  formatMileage,
  getArrivalMileage,
  getDepartureMileage,
  getMileageDrivenAbroad,
  getSelectedVehicle,
  getVehicleLabel,
  toDate,
} from './helpers'

export const formatDate = (value?: string): string => {
  const date = toDate(value)
  return date ? format(date, 'dd.MM.yyyy') : ''
}

export const getDepartureOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => [
  {
    width: 'full',
    keyText: m.overview.vehicle,
    valueText: getVehicleLabel(getSelectedVehicle(answers, externalData)),
  },
  {
    width: 'half',
    keyText: m.overview.departureDate,
    valueText: formatDate(getValueViaPath<string>(answers, 'departure.date')),
  },
  {
    width: 'half',
    keyText: m.overview.departureMileage,
    valueText: formatMileage(getDepartureMileage(answers)),
  },
]

export const getTripOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => [
  ...getDepartureOverviewItems(answers, externalData),
  {
    width: 'half',
    keyText: m.overview.arrivalDate,
    valueText: formatDate(getValueViaPath<string>(answers, 'arrival.date')),
  },
  {
    width: 'half',
    keyText: m.overview.arrivalMileage,
    valueText: formatMileage(getArrivalMileage(answers)),
  },
  {
    width: 'full',
    keyText: m.overview.mileageDrivenAbroad,
    valueText: formatMileage(getMileageDrivenAbroad(answers)),
    boldValueText: true,
  },
]

export const getProofOfTravelAttachments = (
  answers: FormValue,
): Array<AttachmentItem> =>
  (
    getValueViaPath<Array<{ name: string }>>(answers, 'proofOfTravel') ?? []
  ).map((file) => ({
    width: 'full',
    fileName: file.name,
    fileType: file.name.split('.').pop()?.toLowerCase(),
  }))
