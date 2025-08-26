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

    const isPassportOrIdentityDocument =
      type === GenericLicenseType.Passport ||
      type === GenericLicenseType.IdentityDocument

    // We receive an "empty" license item if the user has no passport or identity document
    const noLicense =
      isPassportOrIdentityDocument &&
      !item?.payload?.metadata?.licenseNumber &&
      !item?.payload?.data?.length

    return (
      <Container
        style={style}
        onLayout={(e) => {
          cardHeight = Math.round(e.nativeEvent.layout.height)
        }}
      >
        {noLicense ? (
          <SafeAreaView style={{ marginBottom: theme.spacing[2] }}>
            <LicenseListCard
              type={type}
              subtitle={item?.payload?.metadata?.subtitle}
              emptyState={true}
              title={
                item?.isOwnerChildOfUser
                  ? type === GenericLicenseType.Passport
                    ? intl.formatMessage({
                        id: 'licenseDetail.passport.title',
                      })
                    : type === GenericLicenseType.IdentityDocument
                    ? intl.formatMessage({
                        id: 'licenseDetail.identityDocument.title',
                      })
                    : ''
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
                    type === GenericLicenseType.Passport
                      ? 'https://island.is/vegabref'
                      : 'https://island.is/nafnskirteini'
                  }
                >
                  <LinkText
                    variant="small"
                    icon={externalLinkIcon}
                    underlined={false}
                  >
                    {item?.payload?.metadata?.ctaLink?.label ?? (
                      <FormattedMessage id="licenseDetail.apply" />
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
                `/wallet/${item?.license.type}/${item.payload?.metadata?.licenseId}`,
                {
                  item,
                  fromId: `license-${item?.license?.type}_source`,
                  toId: `license-${item?.license?.type}_destination`,
                  cardHeight,
                },
              )
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
        )}
      </Container>
    )
  },
)
