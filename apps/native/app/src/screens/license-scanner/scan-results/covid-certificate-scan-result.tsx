import React, { useEffect, useState } from 'react'
import { DecodedEudcc, parseEudcc } from './parse-eudcc'
import { CovidResultCard } from '../covid-result-card'

export const CovidCertificateScanResult = ({ data, onLoad }: any) => {
  const [loading, setLoading] = useState(true)
  const [decoded, setDecoded] = useState<DecodedEudcc>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    setError(undefined)
    parseEudcc(data)
      .then((value) => {
        setDecoded(value)
        setLoading(false)
        onLoad(true);
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
        onLoad(true);
      })
  }, [data])

  return (
    <CovidResultCard
      loading={loading}
      errorMessage={error}
      error={!!error}
      valid={decoded?.valid!}
      name={`${decoded?.givenName} ${decoded?.familyName}`}
      birthDate={decoded?.dateOfBirth!}
      vaccination={decoded?.vaccinations?.[0]}
      test={decoded?.tests?.[0]}
      recovery={decoded?.recoveries?.[0]}
    />
  )
}
