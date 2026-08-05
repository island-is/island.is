import { useEffect, useState } from 'react'

export const useGeoLocation = (): { countryCode: string } => {
  const [countryCode, setCountryCode] = useState<string>('')

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/geoLocation/getCountryCode', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }

        return res.json()
      })
      .then((res) => setCountryCode(res.countryCode ?? ''))
      .catch(() => {
        // Silently ignore errors; country code stays empty
      })

    return () => controller.abort()
  }, [])

  return { countryCode }
}
