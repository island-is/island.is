import { flatten } from '@nestjs/common'
import { INSTANCE_METADATA_SYMBOL } from '@nestjs/core/injector/instance-wrapper'
import { GenericLicenseDataField } from '../../graphql/payload.model'
import {
  GenericLicenseDataFieldType,
  GenericUserLicensePayload,
} from '../../licenceService.type'
import { GenericAdrLicenseResponse } from './genericAdrLicense.type'

export const parseAdrLicensePayload = (
  license: GenericAdrLicenseResponse,
): GenericUserLicensePayload | null => {
  if (!license) return null

  const flattenAdrRights = () => {
    const rights: Array<GenericLicenseDataField> = []

    license.adrRettindi?.forEach((field) => {
      const heiti = field.heiti ?? [
        {
          flokkur: field.flokkur,
          heiti: '',
        },
      ]
      heiti.forEach((item) => {
        const to = {
          type: GenericLicenseDataFieldType.Category,
          name: item.flokkur?.toString(),
          label: item.heiti,
          fields: [
            {
              type: GenericLicenseDataFieldType.Value,
              label: 'Grunn',
              value: String(field.grunn),
            },
            {
              type: GenericLicenseDataFieldType.Value,
              label: 'Tankar',
              value: String(field.tankar),
            },
          ],
        }
        rights.push(to)
      })
    })
    return rights
  }

  const data = [
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'skirteinisNumer',
      label: '1.',
      value: (license?.skirteinisNumer ?? '').toString(),
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'fulltNafn',
      label: '2. 3.',
      value: license.fulltNafn,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'faedingardagur',
      label: '4',
      value: license.faedingarDagur,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      name: 'rikisfang',
      label: '5.',
      value: license.rikisfang,
    },
    {
      type: GenericLicenseDataFieldType.Value,
      label: '8. Gildir til: ',
      name: 'gildirTil',
      value: license.gildirTil,
    },
    {
      type: GenericLicenseDataFieldType.Group,
      label: 'ADR réttindi',
      fields: flattenAdrRights(),
    },
  ]

  return {
    data,
    rawData: JSON.stringify(license),
  }
}
