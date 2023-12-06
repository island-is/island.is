import { CustomLicenseType, LicenceCard } from '@ui'
import React from 'react'
import { SafeAreaView, TouchableHighlight, View } from 'react-native'
import {
  GenericUserLicense,
  IdentityDocumentModel,
} from '../../../graphql/types/schema'
import { navigateTo } from '../../../lib/deep-linking'

export const WalletItem = React.memo(
  ({ item }: { item: GenericUserLicense | IdentityDocumentModel }) => {
    let cardHeight = 140

    // Passport card
    if (item.__typename === 'IdentityDocumentModel') {
      const isInvalid = item?.status?.toLowerCase() === 'invalid'
      return (
        <View
          style={{ paddingHorizontal: 16 }}
          onLayout={(e) => {
            cardHeight = Math.round(e.nativeEvent.layout.height)
          }}
        >
          <TouchableHighlight
            style={{ marginBottom: 16, borderRadius: 16 }}
            onPress={() => {
              navigateTo(`/walletpassport/${item?.number}`, {
                fromId: `license-${CustomLicenseType.Passport}_source`,
                toId: `license-${CustomLicenseType.Passport}_destination`,
                cardHeight: cardHeight,
              })
            }}
          >
            <SafeAreaView>
              <LicenceCard
                nativeID={`license-${CustomLicenseType.Passport}_source`}
                type={CustomLicenseType.Passport}
                date={new Date(item?.expirationDate)}
                status={isInvalid ? 'NOT_VALID' : 'VALID'}
              />
            </SafeAreaView>
          </TouchableHighlight>
        </View>
      )
    }
    if (item.__typename === 'GenericUserLicense') {
      return (
        <View
          style={{ paddingHorizontal: 16 }}
          onLayout={(e) => {
            cardHeight = Math.round(e.nativeEvent.layout.height)
          }}
        >
          <TouchableHighlight
            style={{ marginBottom: 16, borderRadius: 16 }}
            onPress={() => {
              navigateTo(`/wallet/${item?.license?.type}`, {
                item,
                fromId: `license-${item?.license?.type}_source`,
                toId: `license-${item?.license?.type}_destination`,
                cardHeight: cardHeight,
              })
            }}
          >
            <SafeAreaView>
              <LicenceCard
                nativeID={`license-${item?.license?.type}_source`}
                type={item?.license?.type}
                date={new Date(Number(item.fetch.updated))}
                status={
                  !item?.payload?.metadata?.expired ? 'VALID' : 'NOT_VALID'
                }
              />
            </SafeAreaView>
          </TouchableHighlight>
        </View>
      )
    }
    return null
  },
)
