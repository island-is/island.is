import { AdrDto } from '@island.is/clients/adr-and-machine-license'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { FlattenedAdrDto } from './genericAdrLicense.type'

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

  const data = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: '1. Númer skírteinis',
      value: parsedResponse.skirteinisNumer?.toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. 3. Fullt nafn',
      value: parsedResponse.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4. Fæðingardagur',
      value: parsedResponse.faedingarDagur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5. Ríkisfang: ',
      value: parsedResponse.rikisfang ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '7. Útgefandi. ',
      value: 'Vinnueftirliti ríkisins',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '8. Gildir til/Valid to',
      value: parsedResponse.gildirTil ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: '9. Tankar ',
      fields: (parsedResponse.adrRettindi ?? [])
        .filter((field) => field.tankar && field.grunn)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Value,
          name: field.flokkur ?? '',
          label: field.heiti ?? '',
        })),
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: '10. Annað en í tanki ',
      fields: (parsedResponse.adrRettindi ?? [])
        .filter((field) => !field.tankar && field.grunn)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Value,
          name: field.flokkur ?? '',
          label: field.heiti ?? '',
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}
