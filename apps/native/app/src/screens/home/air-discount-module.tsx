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
  AirDiscountCard,
} from '../../ui'
import illustrationSrc from '../../assets/illustrations/le-jobs-s2.png'
import { navigateTo } from '../../lib/deep-linking'
import {
  GetAirDiscountQuery,
  useGetAirDiscountQuery,
} from '../../graphql/types/schema'
import { screenWidth } from '../../utils/dimensions'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

interface AirDiscountModuleProps {
  data: GetAirDiscountQuery | undefined
  loading: boolean
  error?: ApolloError | undefined
}

const validateAirDiscountInitialData = ({
  data,
  loading,
}: {
  data: GetAirDiscountQuery | undefined
  loading: boolean
}) => {
  if (loading) {
    return true
  }

  const noRights =
    data?.airDiscountSchemeDiscounts?.filter(
      (item) => item.user.fund?.credit === 0 && item.user.fund.used === 0,
    ).length === data?.airDiscountSchemeDiscounts?.length

  // Only show widget initially if the user has air discount rights
  if (!noRights) {
    return true
  }

  return false
}

const AirDiscountModule = React.memo(
  ({ data, loading, error }: AirDiscountModuleProps) => {
    const theme = useTheme()
    const intl = useIntl()

    if (error && !data) {
      return null
    }

    const noRights =
      data?.airDiscountSchemeDiscounts?.filter(
        (item) => item.user.fund?.credit === 0 && item.user.fund.used === 0,
      ).length === data?.airDiscountSchemeDiscounts?.length

    const discounts = data?.airDiscountSchemeDiscounts?.filter(
      ({ user }) => !(user.fund?.used === 0 && user.fund.credit === 0),
    )

    const count = discounts?.length ?? 0
    const viewPagerItemWidth = screenWidth - theme.spacing[2] * 4

    const items = discounts?.slice(0, 3).map(({ discountCode, user }) => (
      <AirDiscountCard
        key={`loftbru-item-${discountCode}`}
        name={user.name}
        code={discountCode}
        credit={user.fund?.credit}
        text={intl.formatMessage(
          { id: 'airDiscount.remainingFares' },
          {
            remaining: user.fund?.credit,
            total: user.fund?.total,
          },
        )}
        style={
          count > 1
            ? {
                width: viewPagerItemWidth,
                marginLeft: theme.spacing[2],
              }
            : {
                width: '100%',
              }
        }
      />
    ))

    return (
      <SafeAreaView
        style={{
          marginHorizontal: theme.spacing[2],
          marginBottom: theme.spacing[2],
        }}
      >
        <Host>
          <TouchableOpacity
            disabled={count === 0}
            onPress={() => navigateTo(`/air-discount`)}
          >
            <Heading
              button={
                count === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => navigateTo('/air-discount')}
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
              <FormattedMessage id="homeOptions.airDiscount" />
            </Heading>
          </TouchableOpacity>
          {loading && !data ? (
            <GeneralCardSkeleton height={146} />
          ) : (
            <>
              {noRights && (
                <EmptyCard
                  text={intl.formatMessage({
                    id: 'airDiscount.emptyListDescription',
                  })}
                  image={
                    <Image source={illustrationSrc} resizeMode="contain" />
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

export {
  AirDiscountModule,
  useGetAirDiscountQuery,
  validateAirDiscountInitialData,
}
