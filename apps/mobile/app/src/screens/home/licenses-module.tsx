import {
  Typography,
  Heading,
  ChevronRight,
  ViewPager,
  EmptyCard,
  GeneralCardSkeleton,
} from '@ui'

import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, SafeAreaView, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { ApolloError } from '@apollo/client'

import { navigateTo } from '../../lib/deep-linking'
import {
  GenericLicenseType,
  GetIdentityDocumentQuery,
  ListLicensesQuery,
  useGetIdentityDocumentQuery,
  useListLicensesQuery,
} from '../../graphql/types/schema'
import illustrationSrc from '../../assets/illustrations/le-retirement-s3.png'
import { WalletItem } from '../wallet/components/wallet-item'
import { screenWidth } from '../../utils/dimensions'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

interface LicenseModuleProps {
  data: ListLicensesQuery | undefined
  dataPassport: GetIdentityDocumentQuery | undefined
  loading: boolean
  loadingPassport: boolean
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
    data?.genericLicenses?.some(
      (license) => license.license.type === GenericLicenseType.DriversLicense,
    )
  ) {
    return true
  }

  return false
}

const useGetLicensesData = ({ skipFetching }: { skipFetching: boolean }) => {
  // Query list of licenses
  const { data, loading, error, refetch } = useListLicensesQuery({
    variables: {
      input: {
        includedTypes: [
          GenericLicenseType.DriversLicense,
          GenericLicenseType.AdrLicense,
          GenericLicenseType.MachineLicense,
          GenericLicenseType.FirearmLicense,
          GenericLicenseType.DisabilityLicense,
          GenericLicenseType.PCard,
          GenericLicenseType.Ehic,
          GenericLicenseType.HuntingLicense,
        ],
      },
    },
    skip: skipFetching,
  })

  // Additional licenses
  const {
    data: dataPassport,
    loading: loadingPassport,
    error: errorPassport,
    refetch: refetchPassport,
  } = useGetIdentityDocumentQuery({ skip: skipFetching })

  return {
    data,
    dataPassport,
    loading,
    loadingPassport,
    error,
    errorPassport,
    refetch,
    refetchPassport,
  }
}

const LicensesModule = React.memo(
  ({
    data,
    dataPassport,
    loading,
    loadingPassport,
    error,
  }: LicenseModuleProps) => {
    const theme = useTheme()
    const intl = useIntl()

    if (error && !data) {
      return null
    }

    const licenses = data?.genericLicenses
    const passport = dataPassport?.getIdentityDocument

    const count = licenses?.length ?? 0 + (passport ? 1 : 0)

    const allLicenses = [...(licenses ?? []), ...(passport ?? [])]
    const viewPagerItemWidth = screenWidth - theme.spacing[2] * 3

    const items = allLicenses
      .filter(
        (license) =>
          license.__typename === 'GenericUserLicense' ||
          license.__typename === 'IdentityDocumentModel',
      )
      ?.slice(0, 3)
      .map((item, index) => (
        <WalletItem
          key={index}
          item={item}
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
          noPadding
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
          {(loading || loadingPassport) && !data ? (
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

export { LicensesModule, validateLicensesInitialData, useGetLicensesData }
