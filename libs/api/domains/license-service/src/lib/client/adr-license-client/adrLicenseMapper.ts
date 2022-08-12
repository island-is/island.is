import { AdrDto } from '@island.is/clients/adr-and-machine-license'
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

export const parseAdrLicensePayload = (
  license: AdrDto,
  locale: Locale = 'is',
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
      label: `1. ${i18n.licenseNumberFull[locale]}`,
      value: parsedResponse.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `3. 2. ${i18n.fullName[locale]}`,
      value: parsedResponse.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `4. ${i18n.birthday[locale]}`,
      value: parsedResponse.faedingarDagur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `5. ${i18n.nationality[locale]}`,
      value: parsedResponse.rikisfang ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `7. ${i18n.publisher[locale]}`,
      value: 'Vinnueftirliti ríkisins',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: `8. ${i18n.validTo[locale]}`,
      value: parsedResponse.gildirTil ?? '',
    },
  ]

  const adrRights = (parsedResponse.adrRettindi ?? []).filter(
    (field) => field.grunn,
  )
  const tankar = parseRights(
    `9. ${i18n.tanks[locale]}`,
    adrRights.filter((field) => field.tankar),
  )

  if (tankar) data.push(tankar)

  const notTankar = parseRights(
    `10. ${i18n.otherThanInTank[locale]}`,
    adrRights.filter((field) => !field.tankar),
  )
  if (notTankar) data.push(notTankar)

  return {
    data,
    rawData: JSON.stringify(license),
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
    })),
  }
}
