import { buildRadioField, NO, YES } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  differentNeedsMessages,
  sharedMessages,
} from '../../../../lib/messages'
import {
  getApplicationExternalData,
  getDefaultYESNOValue,
} from '../../../../utils/newPrimarySchoolUtils'

export const integratedServices = [
  buildRadioField({
    id: 'specialEducationSupport.hasIntegratedServices',
    title: differentNeedsMessages.specialEducationSupport.hasIntegratedServices,
    description:
      differentNeedsMessages.support.hasIntegratedServicesDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'has-integrated-services',
        value: YES,
      },
      {
        label: sharedMessages.no,
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
