import { buildForm, buildImageField } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { HikingAndWateringPlants } from '@island.is/application/assets/graphics'

export const inReviewForm = buildForm({
  id: 'inReviewForm',
  mode: FormModes.COMPLETED,
  logo: HmsLogo,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      tabTitle: 'Umsókn í vinnslu ',
      alertTitle: 'Umsókn hefur verið send inn til HMS',
      alertMessage:
        'Umsóknin þín er nú í vinnslu hjá HMS og verður tekin til afgreiðslu sem fyrst.',
      image: buildImageField({
        id: 'inReviewImage',
        image: HikingAndWateringPlants,
      }),
    }),
  ],
})
