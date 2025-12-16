import {
  buildCustomField,
  buildDescriptionField,
  buildRadioField,
  NO,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../../lib/messages'
import { shouldShowServicesFromMunicipality } from '../../../../utils/conditionUtils'
import { OptionsType } from '../../../../utils/constants'

export const servicesFromMunicipality = [
  buildRadioField({
    id: 'specialEducationSupport.hasReceivedServicesFromMunicipality',
    title:
      newPrimarySchoolMessages.differentNeeds
        .hasReceivedServicesFromMunicipality,
    description:
      newPrimarySchoolMessages.differentNeeds
        .hasReceivedServicesFromMunicipalityDescription,
    width: 'half',
    required: true,
    space: 4,
    options: [
      {
        label: newPrimarySchoolMessages.shared.yes,
        dataTestId: 'has-received-services-from-municipality',
        value: YES,
      },
      {
        label: newPrimarySchoolMessages.shared.no,
        dataTestId: 'no-has-received-services-from-municipality',
        value: NO,
      },
    ],
  }),
  buildDescriptionField({
    id: 'specialEducationSupport.servicesFromMunicipality.description',
    title: newPrimarySchoolMessages.differentNeeds.whichService,
    titleVariant: 'h4',
    space: 4,
    condition: shouldShowServicesFromMunicipality,
  }),
  buildCustomField(
    {
      id: 'specialEducationSupport.servicesFromMunicipality',
      title: newPrimarySchoolMessages.differentNeeds.service,
      component: 'FriggOptionsAsyncSelectField',
      condition: shouldShowServicesFromMunicipality,
    },
    {
      optionsType: OptionsType.SERVICE_CENTER,
      placeholder:
        newPrimarySchoolMessages.differentNeeds.selectAllThatAppliesPlaceholder,
      isMulti: true,
    },
  ),
]
