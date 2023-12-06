import ip3country from 'ip3country'
import { NextApiRequest, NextApiResponse } from 'next'

function getCountryCode(ip?: string): { countryCode: string } {
  if (!ip) {
    return { countryCode: '' }
  } else if (ip.includes('127.0.0.1')) {
    return { countryCode: 'IS' }
  } else {
    ip3country.init()
    const countryCode = ip3country.lookupStr(ip)

    return { countryCode: countryCode || '' }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const forwarded = req.headers['x-forwarded-for']

  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress

  const countryCode = getCountryCode(ip)

  /* Max age is 30 minutes, revalided if repeated within 30 sec*/
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=30',
  )
  res.status(200).json(countryCode)
}
