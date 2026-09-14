import { buildForm, buildImageField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { GhostOnABench } from '@island.is/application/assets/graphics'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { m } from '../lib/messages'

export const declined: Form = buildForm({
  id: 'declined',
  mode: FormModes.REJECTED,
  logo: DistrictCommissionersLogo,
  children: [
    buildFormConclusionSection({
      sectionTitle: m.applicationDenied,
      tabTitle: m.applicationDenied,
      multiFieldTitle: m.applicationDenied,
      descriptionFieldDescription: m.declinedOtherCountryHelpText,
      alertType: 'info',
      alertTitle: m.declinedOtherEESCountryTitle,
      alertMessage: m.declinedOtherEESCountryDescription,
      infoAlertTitle: m.declinedOtherNonEESCountryTitle,
      infoAlertMessage: m.declinedOtherNonEESCountryDescription,
      accordion: false,
      image: buildImageField({
        id: 'declinedImage',
        image: GhostOnABench,
        imagePosition: 'center',
      }),
    }),
  ],
})
