import { YES, NO } from "@island.is/application/core"
import { socialInsuranceAdministrationMessage } from "@island.is/application/templates/social-insurance-administration-core/lib/messages"
import { getAllCountryCodes } from "@island.is/shared/utils"

export const countryOptions = getAllCountryCodes().map(
  ({ name}) => {
    return {
      label: name,
      value: name,
    }
  },
)

export const YesOrNoOptions = [
    {
      value: YES,
      label: socialInsuranceAdministrationMessage.shared.yes,
    },
    {
      value: NO,
      label:  socialInsuranceAdministrationMessage.shared.no,
    }]
