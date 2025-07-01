import {
  buildRadioField,
  YES,
  NO,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../lib/routes'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const rehabilitationOrTherapyField =
  buildRadioField({
    id: SectionRouteEnum.BACKGROUND_INFO_REHABILITATION_OR_THERAPY,
    title: disabilityPensionFormMessage.questions.rehabilitationOrTherapyTitle,
    options: [
      {
        value: YES,
        label: socialInsuranceAdministrationMessage.shared.yes,
      },
      {
        value: NO,
        label: socialInsuranceAdministrationMessage.shared.no,
      },
    ]
  })