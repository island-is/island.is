import { AdrDto } from '@island.is/clients/adr-and-machine-license'

import format from 'date-fns/format'
import { FlattenedAdrDto, FlattenedAdrRightsDto } from './adrLicenseClient.type'

const formatDateString = (dateTime: string) =>
  dateTime ? format(new Date(dateTime), 'dd/MM/yyyy') : ''

export const parseAdrLicenseResponse = (license: AdrDto) => {
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

const parseRightsForPkPassInput = (rights?: Array<FlattenedAdrRightsDto>) => {
  if (!rights?.length) return 'Engin réttindi'

  const rightsString = rights
    .filter((r) => r.grunn)
    .map((right) => `${right.flokkur}`)
    .join('\r\n')

  return rightsString
}

export const createPkPassDataInput = (license: AdrDto, nationalId: string) => {
  if (!license) return null

  const parsedLicense = parseAdrLicenseResponse(license)

  const tankar = parsedLicense.adrRettindi?.filter((r) => r.tankar) ?? []
  const notTankar = parsedLicense.adrRettindi?.filter((r) => r.grunn) ?? []

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
      identifier: 'kennitala',
      value: nationalId,
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
