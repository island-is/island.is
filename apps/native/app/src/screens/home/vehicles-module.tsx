import React, { useMemo } from 'react'
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
} from '../../ui'
import illustrationSrc from '../../assets/illustrations/le-moving-s4.png'
import { navigateTo } from '../../lib/deep-linking'
import { VehicleItem } from '../vehicles/components/vehicle-item'
import {
  ListVehiclesV2Query,
  useListVehiclesV2Query,
} from '../../graphql/types/schema'
import { screenWidth } from '../../utils/dimensions'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const validateVehiclesInitialData = ({
  data,
  loading,
}: {
  data: ListVehiclesV2Query | undefined
  loading: boolean
}) => {
  if (loading) {
    return true
  }
  // Only show widget initially if there are vehicles that require mileage registration
  if (
    data?.vehiclesListV2?.vehicleList?.some(
      (vehicle) => vehicle.requiresMileageRegistration,
    )
  ) {
    return true
  }

  return false
}

interface VehiclesModuleProps {
  data: ListVehiclesV2Query | undefined
  loading: boolean
  error?: ApolloError | undefined
}

const VehiclesModule = React.memo(
  ({ data, loading, error }: VehiclesModuleProps) => {
    const theme = useTheme()
    const intl = useIntl()

    const vehicles = data?.vehiclesListV2?.vehicleList

    // Reorder vehicles so vehicles that require mileage registration are shown first
    const reorderedVehicles = useMemo(
      () =>
        vehicles
          ? [...vehicles]?.sort((a, b) => {
              if (
                a.requiresMileageRegistration &&
                !b.requiresMileageRegistration
              ) {
                return -1
              } else if (
                !a.requiresMileageRegistration &&
                b.requiresMileageRegistration
              ) {
                return 1
              }
              return 0
            })
          : vehicles,
      [vehicles],
    )
    if (error && !data) {
      return null
    }

    const viewPagerItemWidth = screenWidth - theme.spacing[2] * 3
    const count = reorderedVehicles?.length ?? 0

    const items = reorderedVehicles?.slice(0, 3).map((vehicle, index) => (
      <VehicleItem
        key={vehicle.permno}
        item={vehicle}
        index={index}
        minHeight={152}
        style={
          count > 1
            ? {
                width: viewPagerItemWidth,
                paddingHorizontal: 0,
                paddingLeft: theme.spacing[2],
                minHeight: 152,
              }
            : {
                width: '100%',
                paddingHorizontal: 0,
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
            onPress={() => navigateTo(`/vehicles`)}
          >
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
                    <Typography variant="heading5" color={theme.color.blue400}>
                      <FormattedMessage id="button.seeAll" />
                    </Typography>
                    <ChevronRight />
                  </TouchableOpacity>
                )
              }
            >
              <FormattedMessage id="homeOptions.vehicles" />
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

export { VehiclesModule, validateVehiclesInitialData, useListVehiclesV2Query }
