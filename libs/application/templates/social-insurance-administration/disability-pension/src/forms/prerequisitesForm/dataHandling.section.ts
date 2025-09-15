import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const dataHandlingSection = buildSection({
  id: 'dataHandlingSection',
  title: sm.pre.externalDataSection,
  children: [
    buildMultiField({
      title: m.prerequisite.pre,
      id: 'agreementDescriptionMultiField',
      space: 2,
      children: [
        buildDescriptionField({
          id: 'agreementDescriptionDescriptionField',
          description: m.externalData.bullets,
        }),
        buildDescriptionField({
          id: 'moreInformation',
          description: m.externalData.moreInformation,
        }),
      ],
    }),
  ],
})
