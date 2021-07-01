import { dynamicColor, LicenceCard } from '@island.is/island-ui-native'
import React from 'react'
import { useIntl } from 'react-intl'
import { Text, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import styled from 'styled-components/native'
import rskLogo from '../../assets/temp/agency-logo.png'
import { LicenseStatus, LicenseType } from '../../types/license-type'
import { StackRegistry } from '../../utils/component-registry'

const DetailText = styled.Text`
  margin-top: 32px;
  font-size: 16px;
  text-align: center;
  color: ${dynamicColor('foreground')};
`

const LicenseNumber = styled.Text`
  margin-top: 8px;
  font-size: 32px;
  text-align: center;
  color: ${dynamicColor('foreground')};
`

export const LicenseScanDetailScreen: NavigationFunctionComponent<{
  data: string
}> = ({ componentId, data }) => {
  const intl = useIntl()
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
        status={
          driverLicenseNumber ? LicenseStatus.VALID : LicenseStatus.NOT_VALID
        }
        type={LicenseType.DRIVERS_LICENSE}
        agencyLogo={rskLogo}
      />
      <DetailText>
        {intl.formatMessage({ id: 'licenseScannerDetail.driverLicenseNumber' })}
        </DetailText>
      <LicenseNumber>
        {driverLicenseNumber ?? 'N/A'}
      </LicenseNumber>
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
