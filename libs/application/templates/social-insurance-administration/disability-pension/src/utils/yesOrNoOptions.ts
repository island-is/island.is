import { YES, NO } from "@island.is/application/core"
import { socialInsuranceAdministrationMessage } from "@island.is/application/templates/social-insurance-administration-core/lib/messages"

export const YesOrNoOptions = [
    {
      value: YES,
      label: socialInsuranceAdministrationMessage.shared.yes,
    },
    {
      value: NO,
      label:  socialInsuranceAdministrationMessage.shared.no,
    }]
