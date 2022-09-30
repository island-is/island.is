import {
  VinnuvelaDto,
  VinnuvelaRettindiDto,
} from '@island.is/clients/adr-and-machine-license'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'

import isAfter from 'date-fns/isAfter'

const checkLicenseExpirationDate = (license: VinnuvelaDto) => {
  return license.vinnuvelaRettindi
    ? license.vinnuvelaRettindi
        .filter((field) => field.kenna || field.stjorna)
        .every(
          (field: VinnuvelaRettindiDto) =>
            field.kenna &&
            !isAfter(new Date(field.kenna), new Date()) &&
            field.stjorna &&
            !isAfter(new Date(field.stjorna), new Date()),
        )
    : null
}
export const parseMachineLicensePayload = (
  license: VinnuvelaDto,
): GenericUserLicensePayload | null => {
  if (!license) return null

  const expired: boolean | null = checkLicenseExpirationDate(license)

  const data: Array<GenericLicenseDataField> = [
    {
      name: 'Grunnupplýsingar vinnuvélaskírteinis',
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer skírteinis',
      value: license.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Fullt nafn',
      value: license?.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Útgáfustaður',
      value: license.utgafuStadur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Fyrsti útgáfudagur',
      value: license.fyrstiUtgafuDagur?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildir til',
      value: 'Sjá réttindi',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Ökuskírteinisnúmer',
      value: license.okuskirteinisNumer ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: 'Réttindaflokkar',
      fields: (license.vinnuvelaRettindi ?? [])
        .filter((field) => field.kenna || field.stjorna)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Category,
          name: field.flokkur ?? '',
          label: field.fulltHeiti ?? field.stuttHeiti ?? '',
          description: field.fulltHeiti ?? field.stuttHeiti ?? '',
          fields: parseVvrRights(field),
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.skirteinisNumer?.toString() ?? '',
      expired: expired,
    },
  }
}

const parseVvrRights = (
  rights: VinnuvelaRettindiDto,
): Array<GenericLicenseDataField> | undefined => {
  const fields = new Array<GenericLicenseDataField>()

  if (rights.stjorna) {
    fields.push({
      type: GenericLicenseDataFieldType.Value,
      label: 'Stjórna',
      value: rights.stjorna,
    })
  }
  if (rights.kenna) {
    fields.push({
      type: GenericLicenseDataFieldType.Value,
      label: 'Kenna',
      value: rights.kenna,
    })
  }

  return fields?.length ? fields : undefined
}
