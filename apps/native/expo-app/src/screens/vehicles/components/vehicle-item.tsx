import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { SafeAreaView, TouchableHighlight, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { Label, VehicleCard } from '../../../ui'
import { ListVehiclesV2Query } from '../../../graphql/types/schema'
import { useRouter } from 'expo-router'

function differenceInMonths(a: Date, b: Date) {
  return a.getMonth() - b.getMonth() + 12 * (a.getFullYear() - b.getFullYear())
}

type VehicleListItem = NonNullable<
  NonNullable<ListVehiclesV2Query['vehiclesListV2']>['vehicleList']
>[0]

const Cell = styled(TouchableHighlight)`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.extraLarge};
`

export const VehicleItem = React.memo(
  ({
    item,
    minHeight,
    style,
  }: {
    item: VehicleListItem
    index: number
    minHeight?: number
    style?: ViewStyle
  }) => {
    const theme = useTheme()
    const router = useRouter()
    const nextInspection = item?.nextMainInspection
      ? new Date(item?.nextMainInspection)
      : null

    const isInspectionDeadline =
      (nextInspection
        ? differenceInMonths(new Date(nextInspection), new Date())
        : 0) < 0

    const isMileageRequired = item.requiresMileageRegistration

    return (
      <View style={{ paddingHorizontal: theme.spacing[2], ...style }}>
        <Cell
          underlayColor={
            theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
          }
          onPress={() => {
            router.push({
              pathname: '/(auth)/(tabs)/more/vehicles/[id]',
              params: { id: item.permno, title: item.make },
            })
          }}
        >
          <SafeAreaView>
            <VehicleCard
              title={item.make}
              color={item.colorName}
              number={item.regno}
              minHeight={minHeight}
              label={
                isInspectionDeadline && nextInspection ? (
                  <Label color="danger" icon>
                    <FormattedMessage
                      id="vehicles.nextInspectionLabel"
                      values={{
                        date: <FormattedDate value={nextInspection} />,
                      }}
                    />
                  </Label>
                ) : isMileageRequired ? (
                  <Label color="primary" icon>
                    <FormattedMessage id="vehicles.mileageRequired" />
                  </Label>
                ) : null
              }
            />
          </SafeAreaView>
        </Cell>
      </View>
    )
  },
)
