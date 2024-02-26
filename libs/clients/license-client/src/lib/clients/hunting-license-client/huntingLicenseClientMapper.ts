import format from 'date-fns/format'
import { isDefined } from '@island.is/shared/utils'
import { HuntingLicenseDto } from '@island.is/clients/hunting-license'
import { PassInputFieldValueDataInput } from '@island.is/clients/smartsolutions'

export const createPkPassDataInput = (
  license: HuntingLicenseDto,
): Array<PassInputFieldValueDataInput> | null => {
  if (!license) return null

  return [
    {
      identifier: 'nafn',
      value: license.holderName ?? '',
    },
    {
      identifier: 'kt',
      value: license.holderNationalId ?? '',
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
      value: license.number ?? '',
    },
    {
      identifier: 'gildir_fyrir',
      value: license.permitFor?.join(', ') ?? '',
    },
    {
      identifier: 'tegund',
      value: license.category ?? '',
    },
    license.validTo
      ? {
          identifier: 'gildir_til',
          value: format(new Date(license.validTo), 'dd.MM.yyyy'),
        }
      : undefined,
    license.validFrom
      ? {
          identifier: 'gildir_fra',
          value: format(new Date(license.validFrom), 'dd.MM.yyyy'),
        }
      : undefined,
    {
      identifier: 'hljord',
      value: license.benefits?.land ?? '',
    },
  ].filter(isDefined)
}
