import {
  VinnuvelaDto,
  VinnuvelaRettindiDto,
} from '@island.is/clients/adr-and-machine-license'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { Locale } from '@island.is/shared/types'
import { i18n } from '../../utils/translations'

export const parseMachineLicensePayload = (
  license: VinnuvelaDto,
  locale: Locale = 'is',
): GenericUserLicensePayload | null => {
  if (!license) return null

  const data: Array<GenericLicenseDataField> = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.numberOnLicense[locale],
      value: license.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `1. ${i18n.fullName[locale]}`,
      value: license?.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `2. ${i18n.ssn[locale]}`,
      value: license.kennitala ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `3. ${i18n.placeOfIssue[locale]}`,
      value: license.utgafuStadur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `3. ${i18n.publicationDate[locale]}`,
      value: license.fyrstiUtgafuDagur?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `5. ${i18n.validTo[locale]}`,
      value: 'Sjá réttindi',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `6. ${i18n.drivingLicenseNr[locale]}`,
      value: license.okuskirteinisNumer ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: i18n.classesOfRights[locale],
      fields: (license.vinnuvelaRettindi ?? [])
        .filter((field) => field.kenna || field.stjorna)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Category,
          name: field.flokkur ?? '',
          label: field.fulltHeiti ?? field.stuttHeiti ?? '',
          fields: parseVvrRights(field, locale),
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}

const parseVvrRights = (
  rights: VinnuvelaRettindiDto,
  locale: Locale = 'is',
): Array<GenericLicenseDataField> | undefined => {
  const fields = new Array<GenericLicenseDataField>()

  if (rights.stjorna) {
    fields.push({
      type: GenericLicenseDataFieldType.Value,
      label: i18n.control[locale],
      value: rights.stjorna,
    })
  }
  if (rights.kenna) {
    fields.push({
      type: GenericLicenseDataFieldType.Value,
      label: i18n.teach[locale],
      value: rights.kenna,
    })
  }

  return fields?.length ? fields : undefined
}
