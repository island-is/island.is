import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { paymentPlanFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const PaymentPlanForm: Form = buildForm({
  id: 'PaymentPlanDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'externalData',
      title: socialInsuranceAdministrationMessage.pre.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'paymentPlan',
      title: paymentPlanFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'paymentPlanInstructions',
          title: paymentPlanFormMessage.info.instructionsTitle,
          children: [
            buildMultiField({
              id: 'instructionsSection',
              title:
                paymentPlanFormMessage.info.instructionsTitle,
              children: [
                buildDescriptionField({
                  id: 'instructions',
                  title: '',
                  description: '',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
