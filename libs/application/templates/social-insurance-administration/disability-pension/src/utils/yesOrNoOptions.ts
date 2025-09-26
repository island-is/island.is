import { YES, NO } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const yesOrNoOptions = [
  {
    value: YES,
    label: sm.shared.yes,
  },
  {
    value: NO,
    label: sm.shared.no,
  },
]
