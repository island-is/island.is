import ip3country from 'ip3country'
import { NextApiRequest, NextApiResponse } from 'next'

async function getCountryCode(): Promise<{ countryCode: string }> {
  const response = await fetch('https://api.ipify.org/?format=json', {
    headers: {
      Accept: 'application/json',
    },
  })

  console.log('getCountryCode', response)

  if (response.ok) {
    const ip = await response.json()

    ip3country.init()
    const countryCode = ip3country.lookupStr(ip.ip)

    return { countryCode: countryCode || '' }
  }

  const reason = await response.text()
  console.error('Failed to get country code:', reason)
  throw new Error(reason)
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const countryCode = await getCountryCode()

  /* Max age is 30 minutes, revalided if repeated within 30 sec*/
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=30',
  )
  res.status(200).json(countryCode)
}
