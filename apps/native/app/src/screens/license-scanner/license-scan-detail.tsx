import React from 'react'
import { View, Text } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import { StackRegistry } from '../../utils/component-registry'
import { LicenceCard } from '@island.is/island-ui-native'
import { LicenseStatus, LicenseType } from '../../types/license-type'
import rskLogo from '../../assets/temp/agency-logo.png'
import { useIntl } from 'react-intl'

export const LicenseScanDetailScreen: NavigationFunctionComponent<{
  data: string
}> = ({ componentId, data }) => {
  const intl = useIntl();
  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === 'LICENSE_SCANNER_DONE') {
      Navigation.dismissModal(StackRegistry.LicenseScannerStack)
    }
  })

  let driverLicenseNumber
  try {
    const parsed = JSON.parse(data)
    driverLicenseNumber = parsed?.TGLJZW
  } catch (err) {}

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <LicenceCard
        title=""
        status={driverLicenseNumber ? LicenseStatus.VALID : LicenseStatus.NOT_VALID}
        type={LicenseType.DRIVERS_LICENSE}
        agencyLogo={rskLogo}
      />
      <Text
        style={{
          marginTop: 32,
          fontSize: 16,
          textAlign: 'center',
        }}
      >
        {intl.formatMessage({ id: 'licenseScannerDetail.driverLicenseNumber' })}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 32,
          textAlign: 'center',
        }}
      >
        {driverLicenseNumber ?? 'N/A'}
      </Text>
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
