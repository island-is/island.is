import React from 'react'
import { Button, font } from '@island.is/island-ui-native'
import { TouchableOpacity, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { navigateTo } from '../../lib/deep-linking'
import styled from 'styled-components/native'
import { config } from '../../utils/config'
import { ComponentRegistry } from '../../utils/component-registry'
import { authStore } from '../../stores/auth-store'
import { getAppRoot } from '../../utils/lifecycle/get-app-root'

const Host = styled.View`
  flex: 1;
  padding: 24px;
`
const Information = styled.ScrollView`
  flex: 2;
`
const Footer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
`
const Bottom = styled.View``
const Action = styled.View`
  align-items: center;
  justify-content: center;
  height: 100%;
`
const InformationItem = styled.View`
  margin-bottom: 16px;
`
const Version = styled.Text`
  text-align: center;
`
const Logout = styled.Text`
  text-align: center;
  ${font({
    fontWeight: '500',
    color: '#828282',
  })}
  padding: 8px;
`
const Bold = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
`
const Normal = styled.Text``
const Title = styled.Text`
  ${font({
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  })}
  margin-bottom: 4px;
`
const Copy = styled.Text`
  ${font({
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '300',
  })}
  margin-bottom: 8px;
`

export const ScannerHomeScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  const onLogoutPress = async () => {
    await authStore.getState().logout()
    Navigation.setRoot({ root: await getAppRoot() })
  }
  return (
    <Host>
      <Information>
        <InformationItem>
          <Title>1. Uppfærið strikamerki</Title>
          <Copy>
            <Bold>Android</Bold>
            {'  '}
            <Normal>
              Smellið á hnapp neðan við skírteini til þess að fá uppfært strikamerki.
            </Normal>
          </Copy>
          <Copy>
            <Bold>iOS</Bold>
            {'  '}
            <Normal>
              Smellið á hnapp með þremur punktum fyrir neðan skírteinið. Dragið
              því næst niður með fingur á miðjum skjánum til þess að uppfæra
              strikamerkið.
            </Normal>
          </Copy>
        </InformationItem>
        <InformationItem>
          <Title>2. Skannið skilríki</Title>
          <Copy>
            Beinið myndavélinni að strikamerkinu til þess að skanna það.
          </Copy>
        </InformationItem>
      </Information>
      <Footer>
        <Action>
          <Button
            title="Skanna"
            onPress={() => {
              Navigation.showModal({
                component: {
                  name: ComponentRegistry.LicenseScannerScreen,
                },
              })
            }}
          />
        </Action>
        <Bottom>
          <Version>
            {config.constants.nativeAppVersion} (build{' '}
            {config.constants.nativeBuildVersion})
            {config.constants.debugMode ? ' (debug)' : ''}
          </Version>
          <TouchableOpacity onPress={onLogoutPress}>
            <Logout>Útskrá</Logout>
          </TouchableOpacity>
        </Bottom>
      </Footer>
    </Host>
  )
}

ScannerHomeScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: 'Skilríkjaskanni',
    },
  },
}
