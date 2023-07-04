import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericLicenseLabels,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { Locale } from '@island.is/shared/types'
import { getLabel } from '../../utils/translations'
import { OrorkuSkirteini } from '@island.is/clients/disability-license'

export const parseDisabilityLicensePayload = (
  license: OrorkuSkirteini,
  locale: Locale = 'is',
  labels: GenericLicenseLabels,
): GenericUserLicensePayload | null => {
  if (!license) return null
  const label = labels.labels
  const data: Array<GenericLicenseDataField> = [
    {
      name: getLabel('basicInfoLicense', locale, label),
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('fullName', locale, label),
      value: license.nafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('publisher', locale, label),
      value: 'Tryggingastofnun',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: getLabel('validTo', locale, label),
      value: license.gildirtil?.toISOString() ?? '',
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.kennitala?.toString() ?? '',
      expired: license.gildirtil
        ? !isAfter(new Date(license.gildirtil), new Date())
        : null,
    },
  }
}

const formatDateString = (dateTime: Date) => {
  return dateTime ? format(dateTime, 'dd.MM.yyyy') : ''
}

export const createPkPassDataInput = (license: OrorkuSkirteini) => {
  if (!license) return null

  return [
    {
      identifier: 'nafn',
      value: license.nafn ?? '',
    },
    {
      identifier: 'kennitala',
      value: license.kennitala ?? '',
    },
    {
      identifier: 'gildir',
      value: license.gildirtil ? formatDateString(license.gildirtil) : '',
    },
  ]
}
