import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/core'

export const PendingReview: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Í vinnslu',
  mode: 'pending',
  children: [
    buildIntroductionField({
      id: 'inReview',
      name: 'Í vinnslu',
      introduction:
        'Umsóknin þín er nú í vinnslu. Á meðan getur þú útfært gaurinn sem þarf að útfæra... linkar á útfærslur.',
    }),
  ],
})
