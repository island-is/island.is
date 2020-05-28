import fetch from 'isomorphic-unfetch'

import {
  Application,
  GraphQLContext,
  CreateApplicationInput,
} from '../../types'
import { environment } from '../../environments'

const APPLICATION_TYPE = 'gjafakort'

const formatApplication = (application): Application =>
  application && {
    id: application.id,
    state: application.state,
    email: application.data.email,
  }

export const createApplication = async (
  application: CreateApplicationInput,
  context: GraphQLContext,
): Promise<Application> => {
  const url = `${environment.applicationUrl}/issuers/${application.ssn}/applications`
  const { email } = application

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: APPLICATION_TYPE,
      state: 'approved',
      data: { email },
    }),
  })
  const data = await res.json()
  const formattedApplication = formatApplication(data.application)

  if (formattedApplication.state === 'approved') {
    context.channel.publish({
      exchangeId: context.appExchangeId,
      message: formattedApplication,
      routingKey: formattedApplication.state,
    })
  }
  return formattedApplication
}

export const getApplication = async (ssn: string): Promise<Application> => {
  const url = `${environment.applicationUrl}/issuers/${ssn}/applications/${APPLICATION_TYPE}`

  const res = await fetch(url)
  const data = await res.json()
  return formatApplication(data.application)
}
