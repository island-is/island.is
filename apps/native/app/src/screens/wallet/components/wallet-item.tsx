// import {useQuery} from '@apollo/client';
import {LicenceCard, LicenseCardType} from '@ui';
import React from 'react';
import {SafeAreaView, TouchableHighlight, View} from 'react-native';
import {navigateTo} from '../../../lib/deep-linking';
import {LicenseStatus, LicenseType} from '../../../types/license-type';
import {
  GenericUserLicense,
  IdentityDocumentModel,
} from '../../../graphql/types/schema';

export const WalletItem = React.memo(
  ({item}: {item: GenericUserLicense | IdentityDocumentModel}) => {
    let cardHeight = 140;

    // Passport card
    if (item.__typename === 'IdentityDocumentModel') {
      const isInvalid = item?.status?.toLowerCase() === 'invalid';
      return (
        <View
          style={{paddingHorizontal: 16}}
          onLayout={e => {
            cardHeight = Math.round(e.nativeEvent.layout.height);
          }}>
          <TouchableHighlight
            style={{marginBottom: 16, borderRadius: 16}}
            onPress={() => {
              navigateTo(`/walletpassport/${item?.number}`, {
                fromId: `license-${LicenseType.PASSPORT}_source`,
                toId: `license-${LicenseType.PASSPORT}_destination`,
                cardHeight: cardHeight,
              });
            }}>
            <SafeAreaView>
              <LicenceCard
                nativeID={`license-${LicenseType.PASSPORT}_source`}
                type={LicenseType.PASSPORT}
                date={new Date(item?.expirationDate)}
                status={
                  isInvalid ? LicenseStatus.NOT_VALID : LicenseStatus.VALID
                }
              />
            </SafeAreaView>
          </TouchableHighlight>
        </View>
      );
    }
    if (item.__typename === 'GenericUserLicense') {
      return (
        <View
          style={{paddingHorizontal: 16}}
          onLayout={e => {
            cardHeight = Math.round(e.nativeEvent.layout.height);
          }}>
          <TouchableHighlight
            style={{marginBottom: 16, borderRadius: 16}}
            onPress={() => {
              navigateTo(`/wallet/${item?.license?.type}`, {
                item,
                fromId: `license-${item?.license?.type}_source`,
                toId: `license-${item?.license?.type}_destination`,
                cardHeight: cardHeight,
              });
            }}>
            <SafeAreaView>
              <LicenceCard
                nativeID={`license-${item?.license?.type}_source`}
                type={item?.license?.type as LicenseCardType}
                date={new Date(Number(item.fetch.updated))}
                status={
                  !item?.payload?.metadata?.expired
                    ? LicenseStatus.VALID
                    : LicenseStatus.NOT_VALID
                }
              />
            </SafeAreaView>
          </TouchableHighlight>
        </View>
      );
    }
    return null;
  },
);
