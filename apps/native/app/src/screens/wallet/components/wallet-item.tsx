import { CustomLicenseType, LicenseCard } from '@ui'
import React from 'react'
import { SafeAreaView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
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
    let cardHeight = 140
    const type = item.__typename

    // Passport card
    if (type === 'IdentityDocumentModel') {
      const isInvalid = item?.status?.toLowerCase() === 'invalid'

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
              <LicenseCard
                nativeID={`license-${CustomLicenseType.Passport}_source`}
                type={CustomLicenseType.Passport}
                date={
                  item?.expirationDate
                    ? new Date(item?.expirationDate)
                    : undefined
                }
                status={isInvalid ? 'NOT_VALID' : 'VALID'}
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
              <LicenseCard
                nativeID={`license-${item?.license?.type}_source`}
                type={item?.license?.type}
                date={new Date(Number(item.fetch.updated))}
                status={
                  !item?.payload?.metadata?.expired ? 'VALID' : 'NOT_VALID'
                }
              />
            </SafeAreaView>
          </Pressable>
        </Container>
      )
    }

    return null
  },
)
