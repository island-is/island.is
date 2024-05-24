import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { incomePlanFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const IncomePlanForm: Form = buildForm({
  id: 'IncomePlanDraft',
  title: incomePlanFormMessage.pre.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'externalData',
      title: socialInsuranceAdministrationMessage.pre.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'incomePlan',
      title: incomePlanFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'incomePlanInstructions',
          title: incomePlanFormMessage.info.instructionsShortTitle,
          children: [
            buildMultiField({
              id: 'instructionsSection',
              title:
                incomePlanFormMessage.info.instructionsTitle,
              children: [
                buildDescriptionField({
                  id: 'instructions',
                  title: '',
                  description: incomePlanFormMessage.info.instructionsDescription,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
