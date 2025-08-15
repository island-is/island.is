import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { overviewFields } from '../../../utils/overviewFields'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: SectionRouteEnum.OVERVIEW,
  title: disabilityPensionFormMessage.overview.title,
  children: [
    buildMultiField({
      id: `${SectionRouteEnum.OVERVIEW}.multiFields`,
      title: disabilityPensionFormMessage.overview.title,
      description: disabilityPensionFormMessage.overview.description,
      space: 'containerGutter',
      nextButtonText: disabilityPensionFormMessage.overview.sendInApplication,
      children: [
        ...overviewFields(true),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: socialInsuranceAdministrationMessage.confirm.submitButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: socialInsuranceAdministrationMessage.confirm.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
