import { RESTDataSource } from 'apollo-datasource-rest'
import fetch from 'isomorphic-unfetch'

import { CreateApplicationInput, MessageQueue } from '../types'
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

class ApplicationAPI extends RESTDataSource {
  baseURL = `${environment.applicationUrl}/issuers/`

  async createApplication(
    application: CreateApplicationInput,
    messageQueue: MessageQueue,
    state: string,
    comments: string[],
  ): Promise<ApplicationResponse> {
    const url = `${this.baseURL}${application.companySSN}/applications`
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

    messageQueue.channel.publish({
      exchangeId: messageQueue.companyApplicationExchangeId,
      message: data.application,
      routingKey: data.application.state,
    })
    return data.application
  }

  async getApplication(companySSN: string): Promise<ApplicationResponse> {
    const url = `${this.baseURL}${companySSN}/applications/${APPLICATION_TYPE}`

    const res = await fetch(url)
    const data = await res.json()
    return data.application
  }
}

export default ApplicationAPI
