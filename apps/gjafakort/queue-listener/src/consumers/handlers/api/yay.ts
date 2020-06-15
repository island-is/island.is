import md5 from 'crypto-js/md5'

import {
  GjafakortUserApplicationMessage,
  GjafakortCompanyApplicationMessage,
} from '@island.is/message-queue'

import { environment } from '../../../environments'
import { request } from './api'

const {
  yay: { url, apiKey, secretKey },
} = environment

const getYayHeaders = () => {
  const timestamp = new Date().toISOString()
  return {
    ApiKey: apiKey,
    'X-Timestamp': timestamp,
    'X-Signature': md5(`${apiKey}-${secretKey}-${timestamp}`),
  }
}

export const createUser = async (message: GjafakortUserApplicationMessage) => {
  return await request({
    applicationId: message.id,
    method: 'POST',
    url: `${url}/api/v1/User`,
    headers: getYayHeaders(),
    body: JSON.stringify({
      countryCode: message.data.countryCode,
      mobileNumber: message.data.mobileNumber,
      name: '',
      email: '',
    }),
  })
}

export const createGiftCard = async (
  message: GjafakortUserApplicationMessage,
) => {
  return await request({
    applicationId: message.id,
    method: 'POST',
    url: `${url}/api/v1/GiftCardAssignment`,
    headers: getYayHeaders(),
    body: JSON.stringify({
      countryCode: message.data.countryCode,
      mobileNumber: message.data.mobileNumber,
    }),
  })
}

export const createCompany = async (
  message: GjafakortCompanyApplicationMessage,
) => {
  return await request({
    applicationId: message.id,
    method: 'POST',
    url: `${url}/api/v1/Company`,
    headers: getYayHeaders(),
    body: JSON.stringify({
      socialSecurityNumber: message.issuerSSN,
      companyName: message.data.companyDisplayName,
      name: message.data.name,
      email: message.data.email,
    }),
  })
}

export const rejectCompany = async (
  message: GjafakortCompanyApplicationMessage,
) => {
  return await request({
    applicationId: message.id,
    method: 'DELETE',
    url: `${url}/api/v1/Company/${message.issuerSSN}`,
    headers: getYayHeaders(),
  })
}
