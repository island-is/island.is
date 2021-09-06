import React, { useEffect, useState } from 'react'
import { ScanResultCard } from '../scan-result-card'
import { DecodedEudcc, parseEudcc } from './parse-eudcc'

export const CovidCertificateScanResult = ({ data }: any) => {
  const [loading, setLoading] = useState(true)
  const [decoded, setDecoded] = useState<DecodedEudcc>()
  const [error, setError] = useState<string>();

  useEffect(() => {
    setError(undefined);
    parseEudcc(data)
      .then(value => {
        setDecoded(value);
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false)
      })
  }, [data])

  return (
    <ScanResultCard
      loading={loading}
      error={false}
      valid={decoded?.valid}
      name={`${decoded?.givenName} ${decoded?.familyName}`}
      birthDate={decoded?.dateOfBirth}
      backgroundColor="blue"
      data={[
        {
          key: 'Vaccine',
          value: decoded?.vaccinations?.length ? `${decoded?.vaccinations?.[0]?.vaccineManufacturer}, ${decoded?.vaccinations?.[0]?.vaccineProduct} - ${decoded?.vaccinations?.[0]?.doseNumber} / ${decoded?.vaccinations?.[0]?.totalDoses}` : 'N/A',
        },
        {
          key: 'Test',
          value: `${decoded?.tests?.[0]?.testDate ?? 'N/A'}`,
        },
        {
          key: 'Recovery',
          value: `${decoded?.recoveries?.[0]?.firstPositiveTest ?? 'N/A'}`,
        },
      ]}
    />
  )
}
