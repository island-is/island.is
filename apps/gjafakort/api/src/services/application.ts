import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'

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

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
  }

  async createApplication(
    application: CreateApplicationInput,
    messageQueue: MessageQueue,
    state: string,
    comments: string[],
  ): Promise<ApplicationResponse> {
    const res = await this.post(`${application.companySSN}/applications`, {
      type: APPLICATION_TYPE,
      state,
      data: {
        ...application,
        comments,
      },
    })

    messageQueue.channel.publish({
      exchangeId: messageQueue.companyApplicationExchangeId,
      message: res.application,
      routingKey: res.application.state,
    })
    return res.application
  }

  async getApplication(companySSN: string): Promise<ApplicationResponse> {
    try {
      const res = await this.get(
        `${companySSN}/applications/${APPLICATION_TYPE}`,
      )
      return res.application
    } catch {
      return null
    }
  }
}

export default ApplicationAPI
