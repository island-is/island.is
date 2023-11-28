import {Label, VehicleCard} from '@ui';
import React from 'react';
import {FormattedDate, FormattedMessage} from 'react-intl';
import {SafeAreaView, TouchableHighlight, View} from 'react-native';
import {useTheme} from 'styled-components/native';
import {navigateTo} from '../../../lib/deep-linking';
import {GetUserVehiclesQuery} from '../../../graphql/types/schema';

function differenceInMonths(a: Date, b: Date) {
  return a.getMonth() - b.getMonth() + 12 * (a.getFullYear() - b.getFullYear());
}

type VehicleListItem = NonNullable<
  NonNullable<GetUserVehiclesQuery['vehiclesList']>['vehicleList']
>[0];

export const VehicleItem = React.memo(
  ({
    item,
    mileage,
  }: {
    item: VehicleListItem;
    index: number;
    mileage?: boolean;
  }) => {
    const theme = useTheme();
    const nextInspection = item?.nextInspection?.nextInspectionDate
      ? new Date(item?.nextInspection.nextInspectionDate)
      : null;

    const isInspectionDeadline =
      (nextInspection
        ? differenceInMonths(new Date(nextInspection), new Date())
        : 0) < 0;

    const isMileageRequired = item.requiresMileageRegistration && mileage;

    return (
      <View style={{paddingHorizontal: 16}}>
        <TouchableHighlight
          underlayColor={
            theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
          }
          style={{marginBottom: 16, borderRadius: 16}}
          onPress={() => {
            navigateTo(`/vehicle/`, {
              id: item.permno,
              title: item.type,
            });
          }}>
          <SafeAreaView>
            <VehicleCard
              title={item.type}
              color={item.color}
              number={item.regno}
              label={
                isInspectionDeadline && nextInspection ? (
                  <Label color="warning" icon>
                    <FormattedMessage
                      id="vehicles.nextInspectionLabel"
                      values={{
                        date: <FormattedDate value={nextInspection} />,
                      }}
                    />
                  </Label>
                ) : isMileageRequired ? (
                  <Label color="warning" icon>
                    <FormattedMessage id="vehicles.mileageRequired" />
                  </Label>
                ) : null
              }
            />
          </SafeAreaView>
        </TouchableHighlight>
      </View>
    );
  },
);
