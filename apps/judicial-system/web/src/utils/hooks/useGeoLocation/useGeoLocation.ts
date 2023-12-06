import useSWR from 'swr'

export const useGeoLocation = (): { countryCode: string } => {
  const { data, error } = useSWR<{ countryCode: string }>(
    '/api/geoLocation/getCountryCode',
    (url: string) => fetch(url).then((res) => res.json()),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 2,
    },
  )

  if (!data || error) {
    return { countryCode: '' }
  }

  return data
}
