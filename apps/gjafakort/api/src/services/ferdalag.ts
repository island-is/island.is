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

export const getServiceProviders = async (
  ssn: string,
): Promise<ServiceProvider[]> => {
  try {
    logger.debug(`Requesting service provider for ${ssn}`)
    const res = await fetch(
      `${ferdalag.url}/ssn/${ssn}?key=${ferdalag.apiKey}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    )
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }
    const { data } = await res.json()
    return data
  } catch (err) {
    logger.error('Failed fetching company from ferdalag:', err)
  }
  return []
}
