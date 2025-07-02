import { getAllCountryCodes } from "@island.is/shared/utils"

export const countryOptions = getAllCountryCodes().map(
  ({ name}) => {
    return {
      label: name,
      value: name,
    }
  },
)
