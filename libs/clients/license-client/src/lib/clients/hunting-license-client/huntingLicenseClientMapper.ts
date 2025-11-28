import format from 'date-fns/format'
import { isDefined } from '@island.is/shared/utils'
import { PassInputFieldValueDataInput } from '@island.is/clients/smartsolutions'
import capitalize from 'lodash/capitalize'
import { HuntingLicenseDto } from './types'

export const createPkPassDataInput = (
  license: HuntingLicenseDto,
): Array<PassInputFieldValueDataInput> | null => {
  if (
    !license ||
    !license.holderName ||
    !license.holderNationalId ||
    !license.holderAddress ||
    !license.number ||
    !license.validFrom ||
    !license.category ||
    !license.validTo ||
    !license.permitFor
  )
    return null

  return [
    {
      identifier: 'nafn',
      value: license.holderName,
    },
    {
      identifier: 'kt',
      value: license.holderNationalId,
    },
    {
      identifier: 'heimili',
      value: license.holderAddress,
    },
    {
      identifier: 'pnr_stadur',
      value: license.holderCity,
    },
    {
      identifier: 'numer',
      value: license.number,
    },
    {
      identifier: 'gildir_fyrir',
      value: license.permitFor?.join(', '),
    },
    {
      identifier: 'tegund',
      value: license.category,
    },
    {
      identifier: 'gildir_til',
      value: format(license.validTo, 'dd.MM.yyyy'),
    },
    {
      identifier: 'gildir_fra',
      value: format(license.validFrom, 'dd.MM.yyyy'),
    },
    {
      identifier: 'hljord',
      value: license.benefits?.map((b) => capitalize(b.land)).join(' ,'),
    },
  ].filter(isDefined)
}
