import type { BrokenDownRegistrationStatistic } from '@island.is/api/domains/electronic-registration-statistics'

export const extractRegistrationTypesFromData = (
  data: BrokenDownRegistrationStatistic[],
) => {
  const types = new Set<string>()
  // TODO: i18n
  types.add('Allt')

  for (const period of data)
    for (const type of period?.registrationTypes ?? [])
      if (type.registrationType) types.add(type.registrationType)

  return Array.from(types)
}
