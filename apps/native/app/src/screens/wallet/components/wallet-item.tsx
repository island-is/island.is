import React from 'react'
import { SafeAreaView, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LicenseListCard, Link, LinkText } from '../../../ui'
import { Pressable as PressableRaw } from '../../../components/pressable/pressable'
import {
  GenericLicenseType,
  GenericUserLicense,
} from '../../../graphql/types/schema'
import { navigateTo } from '../../../lib/deep-linking'
import externalLinkIcon from '../../../assets/icons/external-link.png'
import { FormattedMessage, useIntl } from 'react-intl'

const Container = styled.View`
  padding-left: ${({ theme }) => theme.spacing[2]}px;
  padding-right: ${({ theme }) => theme.spacing[2]}px;
`

const Pressable = styled(PressableRaw)`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.extraLarge};
`

export const WalletItem = React.memo(
  ({ item, style }: { item: GenericUserLicense; style?: ViewStyle }) => {
    let cardHeight = 96
    const type = item.license?.type
    const intl = useIntl()
    const theme = useTheme()

    // Passport card
    if (type === GenericLicenseType.Passport) {
      // We receive an "empty" passport item if the user has no passport
      const noPassport =
        !item?.payload?.metadata?.licenseNumber && !item?.payload?.data?.length

      return (
        <Container
          style={style}
          onLayout={(e) => {
            cardHeight = Math.round(e.nativeEvent.layout.height)
          }}
        >
          {noPassport ? (
            <SafeAreaView style={{ marginBottom: theme.spacing[2] }}>
              <LicenseListCard
                type={GenericLicenseType.Passport}
                subtitle={item?.payload?.metadata?.subtitle}
                emptyState={true}
                title={
                  item?.isOwnerChildOfUser
                    ? intl.formatMessage({ id: 'walletPassport.screenTitle' })
                    : item?.payload?.metadata?.name
                }
                childName={
                  item?.isOwnerChildOfUser
                    ? item?.payload?.metadata?.name
                    : undefined
                }
                link={
                  <Link
                    url={
                      item?.payload?.metadata?.ctaLink?.value ??
                      'https://island.is/vegabref'
                    }
                  >
                    <LinkText
                      variant="small"
                      icon={externalLinkIcon}
                      underlined={false}
                    >
                      {item?.payload?.metadata?.ctaLink?.label ?? (
                        <FormattedMessage id="walletPassport.noPassportLink" />
                      )}
                    </LinkText>
                  </Link>
                }
              />
            </SafeAreaView>
          ) : (
            <Pressable
              onPress={() => {
                navigateTo(
                  `/walletpassport/${item?.payload?.metadata?.licenseId}`,
                  {
                    fromId: `license-${GenericLicenseType.Passport}_source`,
                    toId: `license-${GenericLicenseType.Passport}_destination`,
                    cardHeight: cardHeight,
                  },
                )
              }}
            >
              <SafeAreaView>
                <LicenseListCard
                  nativeID={`license-${GenericLicenseType.Passport}_source`}
                  type={GenericLicenseType.Passport}
                  subtitle={item?.payload?.metadata?.subtitle}
                  title={
                    item?.isOwnerChildOfUser
                      ? intl.formatMessage({ id: 'walletPassport.screenTitle' })
                      : item?.payload?.metadata?.name
                  }
                  childName={
                    item?.isOwnerChildOfUser
                      ? item?.payload?.metadata?.name
                      : undefined
                  }
                />
              </SafeAreaView>
            </Pressable>
          )}
        </Container>
      )
    } else {
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
                subtitle={item?.payload?.metadata?.subtitle}
              />
            </SafeAreaView>
          </Pressable>
        </Container>
      )
    }

    return null
  },
)
