import { ScanResultCard } from '@island.is/island-ui-native'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { client } from '../../../graphql/client'
import { VERIFY_PKPASS_MUTATION } from '../../../graphql/queries/verify-pkpass.mutation'

function nationalIdToBirthDate(ssn?: string) {
  const firstChar = ssn?.substr(0, 1)
  if (['8', '9'].includes(firstChar ?? '8')) {
    return null
  }
  const lastChar = ssn?.substr(-1)
  const decade = lastChar === '9' ? 1900 : 2000 + Number(lastChar) * 100
  const year = decade + Number(ssn?.substr(4, 2))
  const month = Number(ssn?.substr(2, 2))
  const date = Number(ssn?.substr(0, 2))

  return [date, month, year].map((n) => n.toString().padStart(2, '0')).join('-')
}

export const DriverLicenseScanResult = ({ data, onLoad }: any) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [name, setName] = useState<string>()
  const [nationalId, setNationalId] = useState<string>()
  const [photo, setPhoto] = useState<string>()
  const [birthDate, setBirthDate] = useState<string>()
  const intl = useIntl()

  useEffect(() => {
    onLoad(!loading);
  }, [loading])

  useEffect(() => {
    client
      .mutate({
        mutation: VERIFY_PKPASS_MUTATION,
        variables: {
          input: {
            licenseType: 'DriversLicense',
            data,
          },
        },
      })
      .then((res) => {
        if (res.errors) {
          setError(true)
          setErrorMessage(
            intl.formatMessage({ id: 'licenseScanDetail.errorUnknown' }),
          )
          setLoading(false)
        } else {
          const { data, valid, error } = res.data.verifyPkPass
          if (!valid) {
            setError(true)

            setErrorMessage(
              intl.formatMessage({ id: 'licenseScanDetail.errorCodeMessage' }, { errorCode: error?.code }),
            )
            setLoading(false)
          } else {
            try {
              const { name, nationalId, photo, birthDate } = JSON.parse(data)
              setError(false)
              setErrorMessage(undefined);
              setNationalId(nationalId)
              setName(name)
              setBirthDate(birthDate ? birthDate.substr(0, 10) : nationalIdToBirthDate(nationalId));
              setPhoto(photo.mynd)
            } catch (err) {
              // whoops
            }
            setError(false)
            setLoading(false)
          }
        }
      })
      .catch((err) => {
        setError(true)
        setErrorMessage(
          intl.formatMessage({ id: 'licenseScanDetail.errorNetwork' }),
        )
        setLoading(false)
      })
  }, [data])

  let driverLicenseNumber
  try {
    const parsed = JSON.parse(data)
    driverLicenseNumber = parsed?.TGLJZW
  } catch (err) {
    // noop
  }

  return (
    <ScanResultCard
      loading={loading}
      error={error}
      errorMessage={errorMessage}
      name={name}
      birthDate={birthDate ?? undefined}
      licenseNumber={driverLicenseNumber}
      photo={photo}
    />
  )
}
