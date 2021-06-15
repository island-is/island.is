import * as kennitala from 'kennitala'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import {
  GenericUserLicense,
  GenericLicenseDataField,
  GenericLicenseType,
  GenericLicenseDataFieldType,
  GenericLicenseProviderId,
  GenericUserLicenseStatus,
  GenericUserLicenseFetchStatus,
} from '../../licenceService.type'

export type ExcludesFalse = <T>(x: T | null | undefined | false) => x is T

function licenseCategoryClassToLabel(licenseClass: string): string {
  if (!licenseClass || typeof licenseClass !== 'string') {
    return ''
  }

  switch (licenseClass.toLowerCase()) {
    case 'am':
      return 'Létt bifhjól (L1e- og L2e-flokkar)'
    case 'a1':
      return 'Bifhjól (L3e-flokkur eða L4e-flokkur)'
    case 'a2':
      return 'Bifhjól (L3e- eða L4e-flokkur)'
    case 'a':
      return 'Bifhjól'
    case 'b1':
      return 'Fjórhjól'
    case 'b':
      return 'Bifreið'
    case 'c1':
      return 'Bifreið fyrir 8 farþega'
    case 'c':
      return 'Bifreið fyrir 8 farþega með eftirvagn/tengitæki'
    case 'd1':
      return 'Bifreið fyrir fleiri en 8 farþega með eftirvagn/tengitæki'
    case 'd':
      return 'Bifreið fyrir fleiri en 8 farþega'
    case 'be':
      return 'Bifreið með eftirvagn/tengitæki'
    case 'c1e':
      return 'C1E'
    case 'd1e':
      return 'D1E'
    case 'ce':
      return 'CE'
    case 'de':
      return 'DE'
    default:
      return licenseClass
  }
}

export const drivingLicensesToSingleGenericLicense = (
  licenses: GenericDrivingLicenseResponse[],
): GenericUserLicense | null => {
  if (licenses.length === 0) {
    return null
  }

  // TODO(osk) we're only handling the first driving license, we get them ordered so pick first
  const license = licenses[0]
  const birthday = license.kennitala
    ? kennitala.info(license.kennitala).birthday
    : ''

  // We parse license data into the fields as they're displayed on the physical drivers license
  // see: https://www.samgongustofa.is/umferd/nam-og-rettindi/skirteini-og-rettindi/okurettindi-og-skirteini/
  const data: Array<GenericLicenseDataField> = [
    // We don't get the name split into two from the API, combine
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. Eiginnafn 1. Kenninafn',
      value: license.nafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '3. Fæðingardagur og fæðingarstaður',
      value: [
        birthday ? format(new Date(birthday), dateFormat.is) : null,
        license.faedingarStadurHeiti ?? null,
      ]
        .filter(Boolean)
        .join(' '),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4a. Útgáfudagur',
      value: license.utgafuDagsetning
        ? format(new Date(license.utgafuDagsetning), dateFormat.is)
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4b. Lokadagur',
      value: license.gildirTil
        ? format(new Date(license.gildirTil), dateFormat.is)
        : '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4c. Nafn útgefanda',
      value: license.nafnUtgafustadur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4d. Kennitala',
      value: license.kennitala,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5. Númer',
      value: (license?.id ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: '9. Réttindaflokkar',
      fields: (license.rettindi ?? []).map((field) => ({
        type: GenericLicenseDataFieldType.Category,
        name: (field.nr ?? '').trim(),
        label: licenseCategoryClassToLabel((field.nr ?? '').trim()),
        fields: [
          {
            type: GenericLicenseDataFieldType.Value,
            label: 'Lokadagur',
            value: field.gildirTil
              ? format(new Date(field.gildirTil), dateFormat.is)
              : '',
          },
          {
            type: GenericLicenseDataFieldType.Value,
            label: 'Útgáfudagur',
            value: field.utgafuDags
              ? format(new Date(field.utgafuDags), dateFormat.is)
              : '',
          },
        ],
      })),
    },
  ].filter((Boolean as unknown) as ExcludesFalse)

  const out: GenericUserLicense = {
    nationalId: license.kennitala ?? '',
    license: {
      type: GenericLicenseType.DriversLicense,
      provider: {
        id: GenericLicenseProviderId.NationalPoliceCommissioner,
      },
      status: GenericUserLicenseStatus.HasLicense,
      pkpass: true,
      timeout: 1,
    },
    fetch: {
      status: GenericUserLicenseFetchStatus.Fetched,
      // TODO(osk) what's the standard date format to pass thru?
      updated: new Date().toISOString(),
    },
    pkpassUrl: '',
    payload: {
      data,
      rawData: JSON.stringify(license),
    },
  }

  return out
}
