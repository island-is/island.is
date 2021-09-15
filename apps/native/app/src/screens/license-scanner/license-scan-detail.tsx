import { Button, font } from '@island.is/island-ui-native'
import { BarCodeEvent, Constants } from 'expo-barcode-scanner'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useNavigationButtonPress } from 'react-native-navigation-hooks/dist'
import styled from 'styled-components/native'
import { StackRegistry } from '../../utils/component-registry'
import { CovidCertificateScanResult } from './scan-results/covid-certificate-scan-result'
import { DriverLicenseScanResult } from './scan-results/driver-license-scan-result'

enum ScanResult {
  COVID_CERTIFICATE,
  DRIVER_LICENSE,
  UNKNOWN,
}

const Timer = styled.View`
  align-items: center;
  margin-bottom: 32px;
`
const TimerTitle = styled.Text`
  ${font({
    fontSize: 20,
    fontWeight: '400',
  })}
`
const TimerCounter = styled.Text`
  ${font({
    fontSize: 24,
    fontWeight: '600',
  })}
`
const Actions = styled.View``

const VIEW_TIMEOUT = 60

export const LicenseScanDetailScreen: NavigationFunctionComponent<BarCodeEvent> = ({
  data,
  type,
  componentId,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [timer, setTimer] = useState<number>(VIEW_TIMEOUT)
  const [scanResult, setScanResult] = useState<ScanResult>()
  const interval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    try {
      if (type === Constants.BarCodeType.pdf417) {
        const parsed = JSON.parse(data)
        if (parsed?.TGLJZW) {
          setScanResult(ScanResult.DRIVER_LICENSE)
        }
      } else if (type === Constants.BarCodeType.qr) {
        if (data.startsWith('HC1')) {
          setScanResult(ScanResult.COVID_CERTIFICATE)
        }
      }
    } catch (err) {
      console.log('unable to decode barcode', err)
    }
  }, [data, type])

  useEffect(() => {
    if (loaded) {
      interval.current = setInterval(() => {
        setTimer((t) => {
          if (t < 1) {
            interval.current && clearInterval(interval.current)
            Navigation.dismissAllModals()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => {
      interval.current && clearInterval(interval.current)
    }
  }, [loaded])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {scanResult === ScanResult.DRIVER_LICENSE && (
        <DriverLicenseScanResult data={data} onLoad={setLoaded} />
      )}
      {scanResult === ScanResult.COVID_CERTIFICATE && (
        <CovidCertificateScanResult data={data} onLoad={setLoaded} />
      )}
      <Timer>
        <TimerTitle>Rennur út eftir</TimerTitle>
        <TimerCounter>{timer} sekúndur</TimerCounter>
      </Timer>
      <Actions>
        <Button
          title="Skanna aftur"
          onPress={() => {
            Navigation.dismissModal(componentId)
          }}
        />
      </Actions>
    </View>
  )
}

LicenseScanDetailScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: 'Niðurstöður',
    },
  },
}
