import {
  buildCustomField,
  buildDescriptionField,
  buildRadioField,
  NO,
  YES,
} from '@island.is/application/core'
import {
  differentNeedsMessages,
  sharedMessages,
} from '../../../../lib/messages'
import { shouldShowServicesFromMunicipality } from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'

export const servicesFromMunicipality = [
  buildRadioField({
    id: 'specialEducationSupport.hasReceivedServicesFromMunicipality',
    title:
      differentNeedsMessages.specialEducationSupport
        .hasReceivedServicesFromMunicipality,
    description:
      differentNeedsMessages.specialEducationSupport
        .hasReceivedServicesFromMunicipalityDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: sharedMessages.yes,
        dataTestId: 'has-received-services-from-municipality',
        value: YES,
      },
      {
        label: sharedMessages.no,
        dataTestId: 'no-has-received-services-from-municipality',
        value: NO,
      },
    ],
  }),
  buildDescriptionField({
    id: 'specialEducationSupport.servicesFromMunicipality.description',
    title: differentNeedsMessages.specialEducationSupport.whichService,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowServicesFromMunicipality,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.servicesFromMunicipality',
      title: differentNeedsMessages.specialEducationSupport.service,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowServicesFromMunicipality,
    },
    {
      optionsType: OptionsType.SERVICE_CENTER,
      placeholder:
        differentNeedsMessages.specialEducationSupport
          .selectAllThatAppliesPlaceholder,
      isMulti: true,
    },
  ),
]
