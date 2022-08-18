import type { RegistrationOfTypeForPeriod } from '@island.is/clients/electronic-registrations'

export const extractRegistrationTypesFromData = (
  data: RegistrationOfTypeForPeriod[],
) => {
  const types = new Set<string>()
  // TODO: i18n
  types.add('Allt')

  for (const period of data)
    for (const type of period?.registrationTypes ?? [])
      if (type.registrationType) types.add(type.registrationType)

  return Array.from(types)
}
