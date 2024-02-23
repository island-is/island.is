import format from 'date-fns/format'
import { PermitHunting } from '@island.is/clients/hunting-license'
import { PassInputFieldValueDataInput } from '@island.is/clients/smartsolutions'

export const createPkPassDataInput = (
  license: PermitHunting,
): Array<PassInputFieldValueDataInput> | null => {
  if (!license) return null

  return [
    {
      identifier: 'nafn',
      value: license.personname ?? '',
    },
    {
      identifier: 'kt',
      value: license.personid ?? '',
    },
    {
      identifier: 'heimili',
      value: '',
    },
    {
      identifier: 'pnr_stadur',
      value: '',
    },
    {
      identifier: 'number',
      value: license.permitNumber ?? '',
    },
    {
      identifier: 'gildir_fyrir',
      value: license.permitFor?.join(', ') ?? '',
    },
    {
      identifier: 'tegund',
      value: license.permitCategory ?? '',
    },
    {
      identifier: 'gildir_til',
      value: license.validTo
        ? format(new Date(license.validTo), 'dd.MM.yyyy')
        : '',
    },
    {
      identifier: 'gildir_fra',
      value: license.validFrom
        ? format(new Date(license.validFrom), 'dd.MM.yyyy')
        : '',
    },
    {
      identifier: 'hljord',
      value: license.benefits?.benefitLand ?? '',
    },
  ]
}
