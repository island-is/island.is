import type { BrokenDownRegistrationStatistic } from '@island.is/api/domains/electronic-registration-statistics'

export const extractRegistrationTypesFromData = (
  data: BrokenDownRegistrationStatistic[],
) => {
  const types = new Set<string>()
  // The external service only returns Icelandic words so that's why we can hardcode 'Allt' here to represent all choices in the dropdown
  types.add('Allt')

  for (const period of data)
    for (const type of period?.registrationTypes ?? [])
      if (type.registrationType) types.add(type.registrationType)

  return Array.from(types)
}
