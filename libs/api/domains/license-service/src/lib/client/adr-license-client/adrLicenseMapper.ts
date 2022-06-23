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

  const data = [
    {
      type: GenericLicenseDataFieldType.Value,
      label: '1.',
      value: (parsedResponse.skirteinisNumer ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '2. 3.',
      value: parsedResponse.fulltNafn ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '4',
      value: parsedResponse.faedingarDagur ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '5.',
      value: parsedResponse.rikisfang ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '8. Gildir til: ',
      value: parsedResponse.gildirTil ?? '',
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: '9. Tankar ',
      fields: (parsedResponse.adrRettindi ?? [])
        .filter((field) => field.tankar)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Category,
          name: field.flokkur ?? '',
          label: field.heiti ?? '',
          fields: [
            {
              type: GenericLicenseDataFieldType.Value,
              label: 'Grunn',
              value: String(field.grunn),
            },
          ],
        })),
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: '10. Annað en tankar ',
      fields: (parsedResponse.adrRettindi ?? [])
        .filter((field) => !field.tankar)
        .map((field) => ({
          type: GenericLicenseDataFieldType.Category,
          name: field.flokkur ?? '',
          label: field.heiti ?? '',
          fields: [
            {
              type: GenericLicenseDataFieldType.Value,
              label: 'Grunn',
              value: String(field.grunn),
            },
          ],
        })),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}
