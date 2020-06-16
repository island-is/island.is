import { GjafakortCompanyApplicationMessage } from '@island.is/message-queue'

import { environment } from '../../../environments'
import { request } from './api'

const {
  ferdalag: { url, apiKey },
} = environment

const formatBody = (message: GjafakortCompanyApplicationMessage) => ({
  giftcert: true,
  contactEmail: message.data.email,
  contactName: message.data.name,
  email: message.data.generalEmail,
  phone: message.data.phoneNumber,
  website: message.data.webpage,
  name: message.data.companyDisplayName,
  legalName: message.data.companyName,
})

export const createProvider = (message: GjafakortCompanyApplicationMessage) => {
  return request({
    applicationId: message.id,
    method: 'POST',
    url: `${url}/ssn/create`,
    query: {
      key: apiKey,
    },
    body: JSON.stringify({
      SSN: message.issuerSSN,
      ...formatBody(message),
    }),
  })
}

export const updateProvider = (message: GjafakortCompanyApplicationMessage) => {
  return request({
    applicationId: message.id,
    method: 'POST',
    url: `${url}/ssn/update/${message.issuerSSN}`,
    query: {
      key: apiKey,
    },
    body: JSON.stringify(formatBody(message)),
  })
}

export const getProviders = (message: GjafakortCompanyApplicationMessage) => {
  return request({
    applicationId: message.id,
    method: 'GET',
    url: `${url}/ssn/${message.issuerSSN}`,
    query: {
      key: apiKey,
    },
  })
}
