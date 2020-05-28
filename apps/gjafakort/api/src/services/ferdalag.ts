import { environment } from '../environments'
import { Application } from '../types'

const { ferdalag } = environment

interface CompanyContactInfo {
  email: string
  name: string
  phone: string
}

interface Company {
  serviceProviderId: string
  SSN: string
  legalName: string
  address: string
  zipCode: string
  phoneNr: string
  email: string
  website: string
  contactInfo: CompanyContactInfo
}

const formatCompany = (company: Company): Application => ({
  id: company.serviceProviderId,
  email: company.email,
  state: 'empty',
})

export const getCompany = async (ssn: string): Promise<Application> => {
  try {
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
    if (data.length === 1) {
      return formatCompany(data[0])
    } else if (data.length > 1) {
      console.debug(`Got multiple entries for ssn ${ssn}`)
    } else if (data.length < 1) {
      console.debug(`Got no entries for ssn ${ssn}`)
    }
  } catch (err) {
    console.error('Failed fetching company from ferdalag:', err)
  }
  return null
}
