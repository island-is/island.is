import fetch from 'isomorphic-unfetch'

import { GjafakortApplicationRoutingKey } from '@island.is/message-queue'

import { GraphQLContext, CreateApplicationInput } from '../types'
import { environment } from '../environments'

const APPLICATION_TYPE = 'gjafakort'

interface ApplicationResponse {
  created: string
  modified: string
  id: string
  issuerSSN: string
  type: string
  state: string
  data: {
    comments: string[]
    companyDisplayName: string
    companyName: string
    companySSN: string
    email: string
    exhibition: boolean
    generalEmail: string
    name: string
    operatingPermitForRestaurant: boolean
    operatingPermitForVehicles: boolean
    operationsTrouble: boolean
    phoneNumber: string
    serviceCategory: string
    state: string
    validLicenses: boolean
    validPermit: boolean
    webpage: string
  }
}

export const createApplication = async (
  applicationInput: CreateApplicationInput,
  context: GraphQLContext,
  state: string,
  comments: string[],
): Promise<ApplicationResponse> => {
  const url = `${environment.applicationUrl}/issuers/${applicationInput.companySSN}/applications`
  const authorSSN = context.user.ssn
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      authorSSN,
      type: APPLICATION_TYPE,
      state,
      data: {
        ...applicationInput,
        comments,
      },
    }),
  })
  const { application }: { application: ApplicationResponse } = await res.json()

  context.channel.publish({
    exchangeId: context.companyApplicationExchangeId,
    message: {
      ...application,
      authorSSN,
    },
    routingKey: application.state as GjafakortApplicationRoutingKey,
  })
  return application
}

export const getApplication = async (
  companySSN: string,
): Promise<ApplicationResponse> => {
  const url = `${environment.applicationUrl}/issuers/${companySSN}/applications/${APPLICATION_TYPE}`

  const res = await fetch(url)
  const data = await res.json()
  return data.application
}
