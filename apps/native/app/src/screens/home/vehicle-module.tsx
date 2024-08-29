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

import illustrationSrc from '../../assets/illustrations/le-moving-s4.png'
import { navigateTo } from '../../lib/deep-linking'
import { VehicleItem } from '../vehicles/components/vehicle-item'
import { useListVehiclesQuery } from '../../graphql/types/schema'
import { screenWidth } from '../../utils/dimensions'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

export const VehicleModule = React.memo(() => {
  const theme = useTheme()
  const intl = useIntl()

  const { data, loading, error } = useListVehiclesQuery({
    variables: {
      input: {
        page: 1,
        pageSize: 10,
        showDeregeristered: false,
        showHistory: false,
      },
    },
  })

  if (error && !data) {
    return null
  }

  const vehicles = data?.vehiclesList?.vehicleList

  // TODO - order mileage vehicles first if there are any
  const vehiclesWithMileageRegistration = vehicles?.filter(
    (vehicle) => vehicle.requiresMileageRegistration,
  )

  const count = vehicles?.length ?? 0

  const children = vehicles?.slice(0, 3).map((vehicle, index) => (
    <VehicleItem
      key={vehicle.permno}
      item={vehicle}
      index={index}
      style={
        count > 1
          ? {
              width: screenWidth - theme.spacing[2] * 3,
              paddingHorizontal: 0,
              paddingLeft: theme.spacing[2],
            }
          : {
              width: '100%',
              paddingHorizontal: 0,
              paddingRight: theme.spacing[2],
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
        <TouchableOpacity onPress={() => navigateTo(`/vehicles`)}>
          <Heading
            button={
              count === 0 ? null : (
                <TouchableOpacity
                  onPress={() => navigateTo('/vehicles')}
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
            <FormattedMessage id="home.vehicles" />
          </Heading>
        </TouchableOpacity>
        {loading && !data ? (
          <GeneralCardSkeleton height={156} />
        ) : (
          <>
            {count === 0 && (
              <EmptyCard
                text={intl.formatMessage({
                  id: 'vehicles.emptyListDescription',
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
