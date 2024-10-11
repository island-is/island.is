import { m, messagesCountries } from '../lib/messages/countries'
import { countries } from './countries'

export const getCountryOptions = () => {
  return countries.map(({ name, alpha2Code: countryCode }) => {
    const option = { name, countryCode }
    return {
      label: () => {
        if (name in messagesCountries) {
          return m[name as keyof typeof m]
        }
        return name
      },
      value: JSON.stringify(option),
    }
  })
}
