import React, { useEffect, useState } from 'react'
import { DecodedEudcc, parseEudcc } from './parse-eudcc'
import { CovidResultCard } from '../covid-result-card'

export const CovidCertificateScanResult = ({ data }: any) => {
  const [loading, setLoading] = useState(true)
  const [decoded, setDecoded] = useState<DecodedEudcc>()
  const [error, setError] = useState<string>()
  const [valid, setValid] = useState(false)

  useEffect(() => {
    setError(undefined)
    setLoading(true)
    try {
      const decoded = parseEudcc(data)
      setDecoded(decoded)
      decoded
        .verify()
        .then((isValid) => {
          setValid(isValid)
          setLoading(false)
        })
        .catch((err) => {
          throw err
        })
    } catch (err) {
      setError('Villa')
      setLoading(false)
    }
  }, [data])

  return (
    <CovidResultCard
      loading={loading}
      errorMessage={error}
      error={!!error}
      valid={valid}
      name={`${decoded?.givenName} ${decoded?.familyName}`}
      birthDate={decoded?.dateOfBirth!}
      vaccination={decoded?.vaccinations?.[0]}
      test={decoded?.tests?.[0]}
      recovery={decoded?.recoveries?.[0]}
    />
  )
}
