import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const serviceProviderService = getValueViaPath<string>(
    answers,
    'serviceProvider.service',
  )

  const serviceProviderServiceType = getValueViaPath<string>(
    answers,
    'serviceProvider.serviceType',
  )

  const serviceProviderName = getValueViaPath<string>(
    answers,
    'serviceProvider.name',
  )

  const serviceProviderNationalId = getValueViaPath<string>(
    answers,
    'serviceProvider.nationalId',
  )

  const serviceProviderAddressStreet = getValueViaPath<string>(
    answers,
    'serviceProvider.address.streetAddress',
  )

  const serviceProviderAddressPostalCode = getValueViaPath<string>(
    answers,
    'serviceProvider.address.postalCode',
  )

  const serviceProviderAddressCity = getValueViaPath<string>(
    answers,
    'serviceProvider.address.city',
  )

  const serviceProviderContactPersonName = getValueViaPath<string>(
    answers,
    'serviceProvider.contactPersonName',
  )

  const serviceProviderContactPersonNationalId = getValueViaPath<string>(
    answers,
    'serviceProvider.contactPersonNationalId',
  )

  const serviceProviderContactPersonWorkEmail = getValueViaPath<string>(
    answers,
    'serviceProvider.contactPersonWorkEmail',
  )

  const serviceProviderContactPersonWorkPhone = getValueViaPath<string>(
    answers,
    'serviceProvider.contactPersonWorkPhone',
  )

  return {
    serviceProviderService,
    serviceProviderServiceType,
    serviceProviderName,
    serviceProviderNationalId,
    serviceProviderAddressStreet,
    serviceProviderAddressPostalCode,
    serviceProviderAddressCity,
    serviceProviderContactPersonName,
    serviceProviderContactPersonNationalId,
    serviceProviderContactPersonWorkEmail,
    serviceProviderContactPersonWorkPhone,
  }
}
