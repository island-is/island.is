import React from 'react';
import {useIntl} from 'react-intl';
import {ScrollView, View, Text} from 'react-native';
import {testIDs} from '../../utils/test-ids';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Input, InputRow, NavigationBarSheet} from '@ui';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {GET_USERS_VEHICLE_DETAIL} from '../../graphql/queries/get-users-vehicles-detail';
import {useQuery} from '@apollo/client';
import {client} from '../../graphql/client';

const {getNavigationOptions, useNavigationOptions} =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }));

export const VehicleDetailScreen: NavigationFunctionComponent<{
  title?: string;
  id: string;
}> = ({componentId, title, id}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();

  const {data, loading, error} = useQuery(GET_USERS_VEHICLE_DETAIL, {
    client,
    fetchPolicy: 'cache-first',
    variables: {
      input: {
        regno: '',
        permno: id,
        vin: '',
      },
    },
  });

  const {mainInfo, basicInfo, registrationInfo, inspectionInfo, technicalInfo} =
    data?.vehiclesDetail || {};

  const isError = !!error;
  const noInfo = data?.vehiclesDetail === null;

  if (noInfo && !loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Engin gögn bárust</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={title ? title : `${mainInfo?.model} ${mainInfo?.subModel}`}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{marginHorizontal: 16}}
      />
      <ScrollView style={{flex: 1}}>
        <View>
          <InputRow>
            <Input
              loading={loading}
              error={isError}
              label={intl.formatMessage({id: 'vehicleDetail.regno'})}
              value={mainInfo?.regno}
            />
            <Input
              loading={loading}
              error={isError}
              label={intl.formatMessage({id: 'vehicleDetail.permno'})}
              value={basicInfo?.permno}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={isError}
              label={intl.formatMessage({id: 'vehicleDetail.firstReg'})}
              value={
                registrationInfo?.firstRegistrationDate
                  ? intl.formatDate(
                      new Date(registrationInfo?.firstRegistrationDate),
                    )
                  : '-'
              }
            />
            <Input
              loading={loading}
              error={isError}
              label={intl.formatMessage({id: 'vehicleDetail.color'})}
              value={registrationInfo?.color}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={isError}
              label={intl.formatMessage({
                id: 'vehicleDetail.nextInspectionDate',
              })}
              value={
                inspectionInfo?.nextInspectionDate
                  ? intl.formatDate(
                      new Date(inspectionInfo?.nextInspectionDate),
                    )
                  : '-'
              }
            />
            {inspectionInfo?.odometer && (
              <Input
                loading={loading}
                error={isError}
                label={intl.formatMessage({id: 'vehicleDetail.odometer'})}
                value={`${inspectionInfo?.odometer} km`}
              />
            )}
          </InputRow>

          <InputRow>
            <Input
              loading={loading}
              error={isError}
              label={intl.formatMessage({id: 'vehicleDetail.vehicleWeight'})}
              value={`${technicalInfo?.vehicleWeight} kg`}
            />
            {technicalInfo?.totalWeight ? (
              <Input
                loading={loading}
                error={isError}
                label={intl.formatMessage({id: 'vehicleDetail.totalWeight'})}
                value={`${technicalInfo?.totalWeight ?? '-'} kg`}
              />
            ) : null}
          </InputRow>

          <InputRow>
            <Input
              loading={loading}
              error={isError}
              label={intl.formatMessage({id: 'vehicleDetail.insured'})}
              value={intl.formatMessage(
                {id: 'vehicleDetail.insuredValue'},
                {isInsured: inspectionInfo?.insuranceStatus},
              )}
            />
            <Input
              loading={loading}
              error={isError}
              label={intl.formatMessage({id: 'vehicleDetail.unpaidVehicleFee'})}
              value={`${inspectionInfo?.carTax} kr.`}
            />
          </InputRow>

          {mainInfo ? (
            <InputRow>
              {mainInfo?.trailerWithBrakesWeight ? (
                <Input
                  loading={loading}
                  error={isError}
                  label={intl.formatMessage({
                    id: 'vehicleDetail.trailerWithBrakes',
                  })}
                  value={`${mainInfo?.trailerWithBrakesWeight} kg`}
                />
              ) : null}
              {mainInfo?.trailerWithoutBrakesWeight ? (
                <Input
                  loading={loading}
                  error={isError}
                  label={intl.formatMessage({
                    id: 'vehicleDetail.trailerWithoutBrakes',
                  })}
                  value={`${mainInfo?.trailerWithoutBrakesWeight} kg`}
                />
              ) : null}
            </InputRow>
          ) : null}

          <InputRow>
            {technicalInfo?.capacityWeight ? (
              <Input
                loading={loading}
                error={isError}
                label={intl.formatMessage({id: 'vehicleDetail.capacityWeight'})}
                value={`${technicalInfo?.capacityWeight ?? '-'} kg`}
              />
            ) : null}
            {mainInfo?.co2 ? (
              <Input
                loading={loading}
                error={isError}
                label={intl.formatMessage({id: 'vehicleDetail.nedc'})}
                value={`${mainInfo?.co2 ?? 0} g/km`}
              />
            ) : null}
          </InputRow>
        </View>
      </ScrollView>
    </View>
  );
};

VehicleDetailScreen.options = getNavigationOptions;
