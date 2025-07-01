import {
  buildTextField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../lib/routes'

export const employmentCapabilityField = buildTextField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT_CAPABILITY,
  title: disabilityPensionFormMessage.questions.employmentCapabilityTitle,
  placeholder: disabilityPensionFormMessage.questions.employmentCapabilityLabel,
  variant: 'number',
  width: 'full',
})
