import { ScanResultCard } from '@island.is/island-ui-native'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { client } from '../../../graphql/client'
import { VERIFY_PKPASS_MUTATION } from '../../../graphql/queries/verify-pkpass.mutation'

export const DriverLicenseScanResult = ({ data, onLoad, isExpired }: any) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [name, setName] = useState<string>()
  const [nationalId, setNationalId] = useState<string>()
  const [photo, setPhoto] = useState<string>()
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
          const { data, valid } = res.data.verifyPkPass
          if (!valid) {
            setError(true)
            setErrorMessage(
              intl.formatMessage({ id: 'licenseScanDetail.errorTryToRefresh' }),
            )
            setLoading(false)
          } else {
            try {
              const { name, nationalId, photo } = JSON.parse(data)
              setError(false)
              setErrorMessage(undefined);
              setNationalId(nationalId)
              setName(name)
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
      isExpired={isExpired}
      error={error}
      errorMessage={errorMessage}
      name={name}
      nationalId={nationalId}
      licenseNumber={driverLicenseNumber}
      photo={photo}
    />
  )
}
