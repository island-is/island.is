import { coreMessages, getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { format as formatKennitala } from 'kennitala'
import { prerequisitesMessages, sharedMessages } from '../lib/messages'
import { getApplicationAnswers } from './getApplicationAnswers'

export const getOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: 'Full width',
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText:
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText: 'Hvassaleiti 5',
    },
    {
      width: 'full',
      // empty item to end line
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'test@test.is',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: '+354 123 4567',
    },
    {
      width: 'full',
      // empty item to end line
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'Reykjavík',
    },
    {
      width: 'half',
      keyText: 'Half width',
      valueText: 'test@test.is',
    },
    {
      width: 'snug',
      keyText: 'Snug width',
      valueText: 'test@test.is',
    },
  ]
}

export const getServiceProviderItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    serviceProviderService,
    serviceProviderServiceType,
    serviceProviderName,
    serviceProviderNationalId,
    serviceProviderAddressStreet,
    serviceProviderAddressPostalCode,
    serviceProviderAddressCity,
  } = getApplicationAnswers(answers)

  return [
    {
      // TODO: Need to update when data implementation is done (need to display the label, not the value)
      width: 'half',
      keyText: prerequisitesMessages.serviceProvider.service,
      valueText: serviceProviderService ?? '',
    },
    {
      // TODO: Need to update when data implementation is done (need to display the label, not the value)
      width: 'half',
      keyText: prerequisitesMessages.serviceProvider.serviceType,
      valueText: serviceProviderServiceType ?? '',
    },
    {
      width: 'half',
      keyText: coreMessages.name,
      valueText: serviceProviderName ?? '',
    },
    {
      width: 'half',
      keyText: coreMessages.nationalId,
      valueText: formatKennitala(serviceProviderNationalId ?? ''),
    },
    {
      width: 'half',
      keyText: sharedMessages.address,
      valueText: serviceProviderAddressStreet ?? '',
    },
    {
      width: 'half',
      keyText: sharedMessages.municipality,
      valueText: `${serviceProviderAddressPostalCode}, ${serviceProviderAddressCity}`,
    },
  ]
}

export const getServiceProviderContactPersonItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const {
    serviceProviderContactPersonName,
    serviceProviderContactPersonNationalId,
    serviceProviderContactPersonWorkEmail,
    serviceProviderContactPersonWorkPhone,
  } = getApplicationAnswers(answers)

  return [
    {
      width: 'half',
      keyText: coreMessages.name,
      valueText: serviceProviderContactPersonName ?? '',
    },
    {
      width: 'half',
      keyText: coreMessages.nationalId,
      valueText: formatKennitala(serviceProviderContactPersonNationalId ?? ''),
    },
    {
      width: 'half',
      keyText: prerequisitesMessages.serviceProvider.workEmail,
      valueText: serviceProviderContactPersonWorkEmail ?? '',
    },
    {
      width: 'half',
      keyText: prerequisitesMessages.serviceProvider.workPhone,
      valueText: formatPhoneNumber(
        removeCountryCode(serviceProviderContactPersonWorkPhone ?? ''),
      ),
    },
  ]
}
