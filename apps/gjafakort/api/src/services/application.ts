import fetch from 'isomorphic-unfetch'

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
    name: string
    email: string
    state: string
    ssn: string
    serviceCategory: string
    generalEmail: string
    webpage: string
    phoneNumber: string
    approveTerms: boolean
    companyName: string
    companyDisplayName: string
    comments: string[]
  }
}

export const createApplication = async (
  application: CreateApplicationInput,
  context: GraphQLContext,
  state: string,
  comments: string[],
): Promise<ApplicationResponse> => {
  const url = `${environment.applicationUrl}/issuers/${application.companySSN}/applications`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: APPLICATION_TYPE,
      state,
      data: {
        ...application,
        comments,
      },
    }),
  })
  const data = await res.json()

  context.channel.publish({
    exchangeId: context.appExchangeId,
    message: data.application,
    routingKey: data.application.state,
  })
  return data.application
}

export const getApplication = async (
  ssn: string,
): Promise<ApplicationResponse> => {
  const url = `${environment.applicationUrl}/issuers/${ssn}/applications/${APPLICATION_TYPE}`

  const res = await fetch(url)
  const data = await res.json()
  return data.application
}
