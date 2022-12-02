import React from 'react'
import { FormattedDate, useIntl } from 'react-intl';
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { testIDs } from '../../utils/test-ids'
import { Navigation, NavigationFunctionComponent } from "react-native-navigation";
import { Input, InputRow, NavigationBarSheet } from '@island.is/island-ui-native';
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options';
import { GET_USERS_VEHICLE_DETAIL } from '../../graphql/queries/get-users-vehicles-detail';
import { useQuery } from '@apollo/client';
import { client } from '../../graphql/client'


const {
  getNavigationOptions,
  useNavigationOptions,
} = useThemedNavigationOptions(() => ({
  topBar: {
    visible: false,
  },
}))

export const VehicleDetailScreen: NavigationFunctionComponent<{ item: any }> = ({ componentId, item }) => {
  useNavigationOptions(componentId)

  const { data, loading, error } = useQuery(GET_USERS_VEHICLE_DETAIL,
    {
    client,
    fetchPolicy: 'cache-first',
    variables: {
      input: {
        regno: '',
        permno: item?.permno,
        vin: '',
      },
    },
  })

  console.log(data, 'data details')

  const inspectionInfo = data?.vehiclesDetail?.inspectionInfo;
  const mainInfo = data?.vehiclesDetail?.mainInfo;
  const technicalInfo = data?.vehiclesDetail?.technicalInfo;

  const intl = useIntl()
  const isError = !!error;
  const isLoading = loading;

  if (!data?.vehiclesDetail) return null;

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={item?.type}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }} >
        <View>
          <InputRow>
            <Input
              loading={isLoading}
              error={isError}
              label={intl.formatMessage({ id: 'vehicleDetail.regno' })}
              value={item?.regno}
            />
            <Input
                loading={isLoading}
                error={isError}
                label={intl.formatMessage({ id: 'vehicleDetail.permno' })}
                value={item?.permno}
              />

          </InputRow>
          <InputRow>
            <Input
              loading={isLoading}
              error={isError}
              label={intl.formatMessage({ id: 'vehicleDetail.firstReg' })}
              value={<FormattedDate value={new Date(item.firstRegDate)} />}
            />
            <Input
              loading={isLoading}
              error={isError}
              label={intl.formatMessage({ id: 'vehicleDetail.color' })}
              value={item?.color}
            />
          </InputRow>
          <InputRow>
            {item?.nextInspection?.nextInspectionDate && (
              <Input
                loading={isLoading}
                error={isError}
                label={intl.formatMessage({ id: 'vehicleDetail.nextInspectionDate' })}
                value={<FormattedDate value={new Date(item?.nextInspection?.nextInspectionDate)} />}
              />
            )}
             {technicalInfo?.vehicleWeight && (
              <Input
                loading={isLoading}
                error={isError}
                label={intl.formatMessage({ id: 'vehicleDetail.vehicleWeight' })}
                value={`${technicalInfo?.vehicleWeight} kg`}
              />
            )}
          </InputRow>
          {inspectionInfo && (
            <InputRow>
              <Input
                loading={isLoading}
                error={isError}
                label={intl.formatMessage({ id: 'vehicleDetail.insured' })}
                value={intl.formatMessage(
                  { id: 'vehicleDetail.insuredValue' },
                  { isInsured: inspectionInfo?.insuranceStatus }
                )}
              />
              <Input
                loading={isLoading}
                error={isError}
                label={intl.formatMessage({ id: 'vehicleDetail.unpaidVehicleFee' })}
                value={`${inspectionInfo?.carTax} kr.`}
              />
            </InputRow>
          )}

          <InputRow>

            {mainInfo?.co2 && (
              <Input
                loading={isLoading}
                error={isError}
                label={intl.formatMessage({ id: 'vehicleDetail.nedc' })}
                value={`${mainInfo?.co2} g/km`}
              />
            )}
          </InputRow>
          {mainInfo && (
            <InputRow>
            {mainInfo?.trailerWithBrakesWeight && (
              <Input
                loading={isLoading}
                error={isError}
                label={intl.formatMessage({ id: 'vehicleDetail.trailerWithBrakes' })}
                value={`${mainInfo?.trailerWithBrakesWeight} kg`}
              />
            )}
            {mainInfo?.trailerWithoutBrakesWeight && (
              <Input
                loading={isLoading}
                error={isError}
                label={intl.formatMessage({ id: 'vehicleDetail.trailerWithoutBrakes' })}
                value={`${mainInfo?.trailerWithoutBrakesWeight} kg`}
              />
            )}
            </InputRow>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

VehicleDetailScreen.options = getNavigationOptions
