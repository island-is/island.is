import {
  ApplicationTypes,
  buildCustomField,
  buildForm,
  buildMultiField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'
export const Rejected: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: m.rejectedTitle,
  mode: FormModes.REJECTED,
  children: [
    buildMultiField({
      id: 'rejected',
      name: m.rejectedTitle,
      description: m.rejectedSubTitle,
      children: [
        buildCustomField({
          id: 'RejectionScreen',
          name: 'RejectionScreen',
          component: 'RejectionScreen',
        }),
        buildCustomField({
          id: 'ManOnBench',
          name: 'ManOnBench',
          component: 'ManOnBenchIllustrationPeriods',
        }),
      ],
    }),
  ],
})
