import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types/routes'
import { overviewFields } from '../../../utils/overviewFields'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: SectionRouteEnum.OVERVIEW,
  title: m.overview.title,
  children: [
    buildMultiField({
      id: `${SectionRouteEnum.OVERVIEW}.multiFields`,
      title: m.overview.title,
      description: m.overview.description,
      space: 'containerGutter',
      nextButtonText: m.overview.sendInApplication,
      children: [
        ...overviewFields(true),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: sm.confirm.submitButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: sm.confirm.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
