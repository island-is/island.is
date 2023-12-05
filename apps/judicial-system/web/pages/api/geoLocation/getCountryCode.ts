import ip3country from 'ip3country'
import { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'

function getCountryCode(ip: string | null): { countryCode: string } {
  if (!ip) {
    return { countryCode: '' }
  } else if (ip === '::1' || ip === '127.0.0.1') {
    return { countryCode: 'IS' }
  } else {
    ip3country.init()
    const countryCode = ip3country.lookupStr(ip)

    return { countryCode: countryCode || '' }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = requestIp.getClientIp(req)
  const countryCode = getCountryCode(ip)

  /* Max age is 30 minutes, revalided if repeated within 30 sec*/
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=30',
  )
  res.status(200).json(countryCode)
}
