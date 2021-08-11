import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import { client } from '../../graphql/client'
import { VERIFY_PKPASS_MUTATION } from '../../graphql/queries/verify-pkpass.mutation'
import { StackRegistry } from '../../utils/component-registry'
import { ScanResultCard } from './scan-result-card'

export const LicenseScanDetailScreen: NavigationFunctionComponent<{
  data: string
}> = ({ componentId, data }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [name, setName] = useState<string>();
  const [nationalId, setNationalId] = useState<string>();
  const [photo, setPhoto] = useState<string>();

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === 'LICENSE_SCANNER_DONE') {
      Navigation.dismissModal(StackRegistry.LicenseScannerStack)
    }
  })

  useEffect(() => {
    client.mutate({
      mutation: VERIFY_PKPASS_MUTATION,
      variables: {
        licenseType: 'DriversLicense',
        data,
      }
    })
    .then((res) => {
      if (res.errors) {
        setError(true);
        setErrorMessage('Unknown error');
        setLoading(false);
      } else {
        const { data } = res.data.verifyPkPass;
        try {
          const { name, nationalId, photo } = JSON.parse(data);
          setNationalId(nationalId);
          setName(name)
          setPhoto(photo);
        } catch (err) {
          // whoops
        }
        setError(false);
        setLoading(false);
      }
    }).catch(() => {
      setError(true);
      setErrorMessage('Network error');
      setLoading(false);
    })
  }, [data]);

  let driverLicenseNumber
  try {
    const parsed = JSON.parse(data)
    driverLicenseNumber = parsed?.TGLJZW
  } catch (err) {
    // noop
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ScanResultCard
        loading={loading}
        error={error}
        errorMessage={errorMessage}
        name={name}
        nationalId={nationalId}
        licenseNumber={driverLicenseNumber}
        photo={photo}
      />
    </View>
  )
}

LicenseScanDetailScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: '',
    },
    rightButtons: [
      {
        id: 'LICENSE_SCANNER_DONE',
        systemItem: 'done',
      },
    ],
  },
}
