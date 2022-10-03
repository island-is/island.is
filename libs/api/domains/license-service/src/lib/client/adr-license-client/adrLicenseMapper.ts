import { AdrDto } from '@island.is/clients/adr-and-machine-license'

import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import {
  GenericLicenseDataField,
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import {
  FlattenedAdrDto,
  FlattenedAdrRightsDto,
} from './genericAdrLicense.type'
import { Locale } from '@island.is/shared/types'
import { i18n } from '../../utils/translations'

const parseAdrLicenseResponse = (license: AdrDto) => {
  const { adrRettindi, ...rest } = license

  const flattenedAdr: FlattenedAdrDto = { ...rest, adrRettindi: [] }

  //Flatten the AdrRettindi into a simple array to make it easier to work with
  adrRettindi?.forEach((field) => {
    const heiti =
      field.heiti && field.heiti.length
        ? field.heiti
        : field.flokkur?.split(',').map((f) => ({
            flokkur: f.trim(),
            heiti: '',
          }))
    heiti?.forEach((item) => {
      flattenedAdr.adrRettindi?.push({
        flokkur: item.flokkur,
        grunn: field.grunn,
        tankar: field.tankar,
        heiti: item.heiti,
      })
    })
  })
  return flattenedAdr
}

export const parseAdrLicensePayload = (
  license: AdrDto,
  locale: Locale = 'is',
): GenericUserLicensePayload | null => {
  if (!license) return null

  const parsedResponse = parseAdrLicenseResponse(license)

  //TODO: Null check fields and filter!

  const data: Array<GenericLicenseDataField> = [
    {
      name: 'Grunnupplýsingar ADR skírteinis',
      type: GenericLicenseDataFieldType.Value,
      label: i18n.licenseNumber[locale],
      value: parsedResponse.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.fullName[locale],
      value: parsedResponse.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.publisher[locale],
      value: 'Vinnueftirlitið',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: i18n.validTo[locale],
      value: parsedResponse.gildirTil ?? '',
    },
  ]

  const adrRights = (parsedResponse.adrRettindi ?? []).filter(
    (field) => field.grunn,
  )
  const tankar = parseRights(
    i18n.tanks[locale],
    adrRights.filter((field) => field.tankar),
  )

  if (tankar) data.push(tankar)

  const grunn = parseRights(
    i18n.otherThanTanks[locale],
    adrRights.filter((field) => field.grunn),
  )
  if (grunn) data.push(grunn)

  return {
    data,
    rawData: JSON.stringify(license),
    metadata: {
      licenseNumber: license.skirteinisNumer?.toString() ?? '',
      expired: license.gildirTil
        ? !isAfter(new Date(license.gildirTil), new Date())
        : null,
    },
  }
}

const parseRights = (
  label: string,
  data: FlattenedAdrRightsDto[],
): GenericLicenseDataField | undefined => {
  if (!data.length) {
    return
  }

  return {
    type: GenericLicenseDataFieldType.Group,
    label: label,
    fields: data.map((field) => ({
      type: GenericLicenseDataFieldType.Category,
      name: field.flokkur ?? '',
      label: field.heiti ?? '',
      description: field.heiti ?? '',
    })),
  }
}

const formatDateString = (dateTime: string) =>
  dateTime ? format(new Date(dateTime), 'dd/MM/yyyy') : ''

const parseRightsForPkPassInput = (rights?: Array<FlattenedAdrRightsDto>) => {
  if (!rights?.length) return 'Engin réttindi'

  const rightsString = rights
    .filter((r) => r.grunn)
    .map((right) => `${right.flokkur}`)
    .join('\r\n')

  return rightsString
}

export const createPkPassDataInput = (license: AdrDto) => {
  if (!license) return null

  const parsedLicense = parseAdrLicenseResponse(license)

  const tankar = parsedLicense.adrRettindi?.filter((r) => r.tankar) ?? []
  const notTankar = parsedLicense.adrRettindi?.filter((r) => !r.tankar) ?? []

  return [
    {
      identifier: 'fulltNafn',
      value: parsedLicense.fulltNafn ?? '',
    },
    {
      identifier: 'skirteinisNumer',
      value: parsedLicense.skirteinisNumer ?? '',
    },
    {
      identifier: 'faedingardagur',
      value: parsedLicense.faedingarDagur
        ? formatDateString(parsedLicense.faedingarDagur)
        : '',
    },
    {
      identifier: 'rikisfang',
      value: parsedLicense.rikisfang ?? '',
    },
    {
      identifier: 'gildirTil',
      value: parsedLicense.gildirTil
        ? formatDateString(parsedLicense.gildirTil)
        : '',
    },
    {
      identifier: 'tankar',
      value: parseRightsForPkPassInput(tankar),
    },
    {
      identifier: 'ekkiTankar',
      value: parseRightsForPkPassInput(notTankar),
    },
  ]
}
