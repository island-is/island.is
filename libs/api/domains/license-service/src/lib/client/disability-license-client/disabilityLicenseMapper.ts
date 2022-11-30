import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { Locale } from '@island.is/shared/types'
import { i18n } from '../../utils/translations'
import { OrorkuSkirteini } from '@island.is/clients/disability-license'

export const parseDisabilityLicensePayload = (
  license: OrorkuSkirteini,
  locale: Locale = 'is',
  labels?: GenericLicenseLabels,
): GenericUserLicensePayload | null => {
  if (!license) return null
  const label = labels?.labels
  const data: Array<GenericLicenseDataField> = [
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'Grunnupplýsingar örorkuskírteinis',
      label: label ? label['fullName'] : i18n.fullName[locale],
      value: license.nafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['publisher'] : i18n.publisher[locale],
      value: 'Tryggingastofnun ríkisins',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: label ? label['validTo'] : i18n.validTo[locale],
      value: license.gildirTil?.toISOString() ?? '',
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.kennitala?.toString() ?? '',
      expired: license.gildirTil
        ? !isAfter(new Date(license.gildirTil), new Date())
        : null,
    },
  }
}

const formatDateString = (dateTime: Date) => {
  return dateTime ? format(dateTime, 'dd/MM/yyyy') : ''
}

// TODO FORMAT CORRECTLY
// TODO what to do about "rennurUt" field?
export const createPkPassDataInput = (license: OrorkuSkirteini) => {
  if (!license) return null

  return [
    {
      identifier: 'name',
      value: license.nafn ?? '',
    },
    {
      identifier: 'kennitala',
      value: license.kennitala ?? '',
    },
    {
      identifier: 'gildirTil',
      value: license.gildirTil ? formatDateString(license.gildirTil) : '',
    },
  ]
}
