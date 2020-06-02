import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'

import { logger } from '@island.is/logging'

import { environment } from '../environments'

const { ferdalag } = environment

interface ServiceProvider {
  serviceProviderId: string
  SSN: string
  legalName: string
  address: string
  zipCode: string
  phoneNr: string
  email: string
  website: string
  contactInfo: {
    email: string
    name: string
    phone: string
  }
}

class FerdalagAPI extends RESTDataSource {
  baseURL = `${ferdalag.url}/ssn/`

  willSendRequest(request: RequestOptions) {
    request.params.set('key', ferdalag.apiKey)
    request.headers.set('Content-Type', 'application/json')
  }

  async getServiceProviders(ssn: string): Promise<ServiceProvider[]> {
    try {
      console.debug(`Requesting service provider for ${ssn}`)
      const res = await this.get(ssn)
      if (!res.status) {
        throw new Error(res.errors || res.message)
      }

      return res.data
    } catch (err) {
      logger.error('Failed fetching company from ferdalag:', err)
    }
    return []
  }
}

export default FerdalagAPI
