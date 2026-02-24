import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, SafeAreaView, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { ApolloError } from '@apollo/client'

import {
  Typography,
  Heading,
  ChevronRight,
  ViewPager,
  EmptyCard,
  GeneralCardSkeleton,
} from '@/ui'
import { navigateTo } from '@/lib/deep-linking'
import {
  GenericLicenseType,
  GenericUserLicense,
  ListLicensesQuery,
  useListLicensesQuery,
} from '@/graphql/types/schema'
import illustrationSrc from '@/assets/illustrations/le-retirement-s3.png'
import { WalletItem } from '../wallet-item'
import { screenWidth } from '@/utils/dimensions'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

interface LicenseModuleProps {
  data: ListLicensesQuery | undefined
  loading: boolean
  error?: ApolloError | undefined
}

const validateLicensesInitialData = ({
  data,
  loading,
}: {
  data: ListLicensesQuery | undefined
  loading: boolean
}) => {
  if (loading) {
    return true
  }
  // We only want to show the widget for the first time if the user has driving license
  if (
    data?.genericLicenseCollection?.licenses?.some(
      (license) => license.license.type === GenericLicenseType.DriversLicense,
    )
  ) {
    return true
  }

  return false
}

const isLicenseEmptyStateOrChildLicense = (license: GenericUserLicense) => {
  const isPassportOrIdentityDocument =
    license.license.type === GenericLicenseType.Passport ||
    license.license.type === GenericLicenseType.IdentityDocument

  // We receive an "empty" license item if the user has no passport or identity document
  // We don't want to show them on the home screen
  const noLicense =
    isPassportOrIdentityDocument &&
    !license?.payload?.metadata?.licenseNumber &&
    !license?.payload?.data?.length

  return !!(noLicense || license?.isOwnerChildOfUser)
}

const LicensesModule = React.memo(
  ({ data, loading, error }: LicenseModuleProps) => {
    const theme = useTheme()
    const intl = useIntl()

    if (error && !data) {
      return null
    }

    const licenses = data?.genericLicenseCollection?.licenses

    const count = licenses?.length ?? 0

    const allLicenses = [...(licenses ?? [])]
    const viewPagerItemWidth = screenWidth - theme.spacing[2] * 3

    const items = allLicenses
      .filter((license) => license.__typename === 'GenericUserLicense')
      ?.filter((license) => !isLicenseEmptyStateOrChildLicense(license as GenericUserLicense))
      ?.slice(0, 3)
      .map((item, index) => (
        <WalletItem
          key={index}
          item={item as GenericUserLicense}
          style={
            count > 1
              ? {
                  width: viewPagerItemWidth,
                  paddingLeft: theme.spacing[2],
                  paddingRight: 0,
                }
              : {
                  width: '100%',
                  paddingLeft: 0,
                  paddingRight: 0,
                }
          }
        />
      ))

    return (
      <SafeAreaView
        style={{
          marginHorizontal: theme.spacing[2],
        }}
      >
        <Host>
          <TouchableOpacity
            disabled={count === 0}
            onPress={() => navigateTo(`/wallet`)}
          >
            <Heading
              button={
                count === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => navigateTo('/wallet')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="heading5" color={theme.color.blue400}>
                      <FormattedMessage id="button.seeAll" />
                    </Typography>
                    <ChevronRight />
                  </TouchableOpacity>
                )
              }
            >
              <FormattedMessage id="homeOptions.licenses" />
            </Heading>
          </TouchableOpacity>
          {loading && !data ? (
            <GeneralCardSkeleton height={104} />
          ) : (
            <>
              {count === 0 && (
                <EmptyCard
                  text={intl.formatMessage({
                    id: 'wallet.emptyListDescription',
                  })}
                  image={
                    <Image
                      source={illustrationSrc}
                      resizeMode="contain"
                      style={{ height: 80, width: 55 }}
                    />
                  }
                  link={null}
                />
              )}
              {count === 1 && items}
              {count >= 2 && (
                <ViewPager itemWidth={viewPagerItemWidth}>{items}</ViewPager>
              )}
            </>
          )}
        </Host>
      </SafeAreaView>
    )
  },
)

export { LicensesModule, validateLicensesInitialData, useListLicensesQuery }
