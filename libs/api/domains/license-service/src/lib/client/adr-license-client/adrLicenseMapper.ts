import { AdrDto } from '@island.is/clients/adr-and-machine-license'
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

export const parseAdrLicensePayload = (
  license: AdrDto,
): GenericUserLicensePayload | null => {
  if (!license) return null

  const parseAdrLicenseResponse = () => {
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

  const parsedResponse = parseAdrLicenseResponse()

  //TODO: Null check fields and filter!

  const data: Array<GenericLicenseDataField> = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Númer skírteinis',
      value: parsedResponse.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Fullt nafn',
      value: parsedResponse.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Útgefandi',
      value: 'Vinnueftirlitið',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: 'Gildir til',
      value: parsedResponse.gildirTil ?? '',
    },
  ]

  const adrRights = (parsedResponse.adrRettindi ?? []).filter(
    (field) => field.grunn,
  )
  const tankar = parseRights(
    'Tankar',
    adrRights.filter((field) => field.tankar),
  )

  if (tankar) data.push(tankar)

  const grunn = parseRights(
    'Annað en í tanki',
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
