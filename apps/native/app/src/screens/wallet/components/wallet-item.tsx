import React from 'react'
import { SafeAreaView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { CustomLicenseType, LicenseListCard } from '../../../ui'
import { Pressable as PressableRaw } from '../../../components/pressable/pressable'
import {
  GenericUserLicense,
  IdentityDocumentModel,
} from '../../../graphql/types/schema'
import { navigateTo } from '../../../lib/deep-linking'

const Container = styled.View`
  padding-left: ${({ theme }) => theme.spacing[2]}px;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
`

const Pressable = styled(PressableRaw)`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.extraLarge};
`

export const WalletItem = React.memo(
  ({
    item,
    style,
  }: {
    item: GenericUserLicense | IdentityDocumentModel
    style?: ViewStyle
  }) => {
    let cardHeight = 96
    const type = item.__typename

    // Passport card
    if (type === 'IdentityDocumentModel') {
      return (
        <Container
          style={style}
          onLayout={(e) => {
            cardHeight = Math.round(e.nativeEvent.layout.height)
          }}
        >
          <Pressable
            style={style}
            onPress={() => {
              navigateTo(`/walletpassport/${item?.number}`, {
                fromId: `license-${CustomLicenseType.Passport}_source`,
                toId: `license-${CustomLicenseType.Passport}_destination`,
                cardHeight: cardHeight,
              })
            }}
          >
            <SafeAreaView>
              <LicenseListCard
                nativeID={`license-${CustomLicenseType.Passport}_source`}
                type={CustomLicenseType.Passport}
                licenseNumber={item?.numberWithType ?? ''}
              />
            </SafeAreaView>
          </Pressable>
        </Container>
      )
    } else if (type === 'GenericUserLicense') {
      return (
        <Container
          style={style}
          onLayout={(e) => {
            cardHeight = Math.round(e.nativeEvent.layout.height)
          }}
        >
          <Pressable
            onPress={() => {
              navigateTo(`/wallet/${item?.license?.type}`, {
                item,
                fromId: `license-${item?.license?.type}_source`,
                toId: `license-${item?.license?.type}_destination`,
                cardHeight,
              })
            }}
          >
            <SafeAreaView>
              <LicenseListCard
                nativeID={`license-${item?.license?.type}_source`}
                title={item?.payload?.metadata?.name}
                type={item?.license?.type}
                licenseNumber={item?.payload?.metadata?.licenseNumber}
              />
            </SafeAreaView>
          </Pressable>
        </Container>
      )
    }

    return null
  },
)
