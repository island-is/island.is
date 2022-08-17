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

export const parseMachineLicensePayload = (
  license: VinnuvelaDto,
): GenericUserLicensePayload | null => {
  if (!license) return null

  let expired: boolean | null = null

  expired = license.vinnuvelaRettindi
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

  const data: Array<GenericLicenseDataField> = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Skírteini nr. ',
      value: license.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '1. Fullt nafn',
      value: license?.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. Kennitala',
      value: license.kennitala ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '3. Útgáfustaður',
      value: license.utgafuStadur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4. Útgáfudagur',
      value: license.fyrstiUtgafuDagur?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5. Gildir til.',
      value: 'Sjá réttindi',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '6. Ökuskírteini nr',
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
          fields: parseVvrRights(field),
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
    licenseNumber: license.skirteinisNumer?.toString() ?? '',
    expired: expired,
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
