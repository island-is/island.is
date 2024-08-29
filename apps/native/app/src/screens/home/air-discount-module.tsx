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

import illustrationSrc from '../../assets/illustrations/le-jobs-s2.png'
import { navigateTo } from '../../lib/deep-linking'
import { useGetAirDiscountQuery } from '../../graphql/types/schema'
import { AirDiscountCard } from '@ui/lib/card/air-discount-card'
import { screenWidth } from '../../utils/dimensions'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

export const AirDiscountModule = React.memo(() => {
  const theme = useTheme()
  const intl = useIntl()

  const { data, loading, error } = useGetAirDiscountQuery({
    fetchPolicy: 'network-only',
  })

  const noRights =
    data?.airDiscountSchemeDiscounts?.filter(
      (item) => item.user.fund?.credit === 0 && item.user.fund.used === 0,
    ).length === data?.airDiscountSchemeDiscounts?.length

  const discounts = data?.airDiscountSchemeDiscounts?.filter(
    ({ user }) => !(user.fund?.used === 0 && user.fund.credit === 0),
  )

  if (error && !data) {
    return null
  }

  const count = discounts?.length ?? 0

  const children = discounts?.slice(0, 3).map(({ discountCode, user }) => (
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
              width: screenWidth - theme.spacing[2] * 4,
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
        <TouchableOpacity onPress={() => navigateTo(`/air-discount`)}>
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
                  <Typography weight="400" color={theme.color.blue400}>
                    <FormattedMessage id="button.seeAll" />
                  </Typography>
                  <ChevronRight />
                </TouchableOpacity>
              )
            }
          >
            <FormattedMessage id="home.airDiscount" />
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
                image={<Image source={illustrationSrc} resizeMode="contain" />}
                link={null}
              />
            )}
            {count === 1 && children?.slice(0, 1)}
            {count >= 2 && <ViewPager>{children}</ViewPager>}
          </>
        )}
      </Host>
    </SafeAreaView>
  )
})
