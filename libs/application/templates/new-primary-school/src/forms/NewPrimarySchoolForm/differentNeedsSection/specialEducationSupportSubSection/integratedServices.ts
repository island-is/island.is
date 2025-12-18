import { buildRadioField, NO, YES } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../../lib/messages'
import {
  getApplicationExternalData,
  getDefaultYESNOValue,
} from '../../../../utils/newPrimarySchoolUtils'

export const integratedServices = [
  buildRadioField({
    id: 'specialEducationSupport.hasIntegratedServices',
    title:
      newPrimarySchoolMessages.differentNeeds
        .specialEducationHasIntegratedServices,
    description:
      newPrimarySchoolMessages.differentNeeds.hasIntegratedServicesDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'has-integrated-services',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
        dataTestId: 'no-has-integrated-services',
        value: NO,
      },
    ],
    defaultValue: (application: Application) => {
      const { socialProfile } = getApplicationExternalData(
        application.externalData,
      )

      return getDefaultYESNOValue(socialProfile?.hasIntegratedServices)
    },
  }),
]
