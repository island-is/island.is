import { buildForm, buildImageField } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { HikingAndWateringPlants } from '@island.is/application/assets/graphics'
import * as m from '../../lib/messages'

export const inReviewForm = buildForm({
  id: 'inReviewForm',
  mode: FormModes.COMPLETED,
  logo: HmsLogo,
  children: [
    buildFormConclusionSection({
      sectionTitle: '',
      tabTitle: m.inReviewMessages.tabTitle,
      alertTitle: m.inReviewMessages.alertTitle,
      alertMessage: m.inReviewMessages.alertMessage,
      image: buildImageField({
        id: 'inReviewImage',
        image: HikingAndWateringPlants,
      }),
    }),
  ],
})
