import { getAllCountryCodes } from '@island.is/shared/utils'

export const getCountryName = (code: string | undefined) => {
  const countries = getAllCountryCodes()
  const country = countries.find((x) => x.code === code)
  return country?.name_is || country?.name || ''
}
