import fetch from 'isomorphic-unfetch'
import { Context, CreateApplicationInput } from '../../../types'
import { environment } from '../../../environments/environment'

const APPLICATION_TYPE = 'gjafakort'

interface Application {
  id: string
  state: string
  email: string
}

const formatApplication = (application: any): Application => ({
  id: application.id,
  state: application.state,
  email: application.data.email,
})

export const createApplication = async (
  application: CreateApplicationInput,
  context: Context,
) => {
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

export const getApplication = async (ssn: string) => {
  const url = `${environment.applicationUrl}/issuers/${ssn}/applications/${APPLICATION_TYPE}`

  const res = await fetch(url)
  const data = await res.json()
  return formatApplication(data.application)
}
