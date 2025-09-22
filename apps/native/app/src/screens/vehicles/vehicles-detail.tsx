import React from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, Text, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'

import { Button, Divider, Input, InputRow, Problem } from '../../ui'
import { useGetVehicleQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { testIDs } from '../../utils/test-ids'

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: true,
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
  }))

export const VehicleDetailScreen: NavigationFunctionComponent<{
  title?: string
  id: string
}> = ({ componentId, title, id }) => {
  useNavigationOptions(componentId)

  const intl = useIntl()

  const { data, loading, error } = useGetVehicleQuery({
    variables: {
      input: {
        regno: '',
        permno: id,
        vin: '',
      },
    },
  })

  useConnectivityIndicator({
    componentId,
    queryResult: { data, loading },
  })

  const {
    mainInfo,
    basicInfo,
    registrationInfo,
    inspectionInfo,
    technicalInfo,
  } = data?.vehiclesDetail || {}

  const isError = !!error
  const noInfo = data?.vehiclesDetail === null

  if (noInfo && !loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          {intl.formatMessage({
            id: 'vehicleDetail.noInfo',
          })}
        </Text>
      </View>
    )
  }

  if (isError) {
    return <Problem withContainer error={error} />
  }

  const inputLoading = loading && !data
  const allowMilageRegistration =
    mainInfo?.requiresMileageRegistration ||
    mainInfo?.availableMileageRegistration

  return (
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <InputRow>
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.regno' })}
              value={mainInfo?.regno}
            />
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.permno' })}
              value={basicInfo?.permno}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.firstReg' })}
              value={
                registrationInfo?.firstRegistrationDate
                  ? intl.formatDate(
                      new Date(registrationInfo?.firstRegistrationDate),
                    )
                  : '-'
              }
            />
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.color' })}
              value={registrationInfo?.color}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={inputLoading}
              label={intl.formatMessage({
                id: 'vehicleDetail.nextInspectionDate',
              })}
              noBorder
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
                noBorder
                loading={inputLoading}
                label={intl.formatMessage({ id: 'vehicleDetail.odometer' })}
                value={
                  data?.vehiclesDetail?.lastMileage?.mileage
                    ? `${intl.formatNumber(
                        parseInt(
                          data?.vehiclesDetail?.lastMileage?.mileage,
                          10,
                        ),
                      )} km`
                    : '-'
                }
              />
            )}
          </InputRow>

          {allowMilageRegistration && (
            <Button
              title={intl.formatMessage({ id: 'vehicle.mileage.inputLabel' })}
              onPress={() => {
                navigateTo(`/vehicle-mileage/`, {
                  id,
                  title: {
                    type: title,
                    year: basicInfo?.year,
                    color: registrationInfo?.color,
                  },
                })
              }}
              style={{ marginHorizontal: 16 }}
            />
          )}
          <Divider spacing={2} />

          <InputRow>
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.vehicleWeight' })}
              value={`${technicalInfo?.vehicleWeight ?? ''} kg`}
            />
            {technicalInfo?.totalWeight ? (
              <Input
                loading={inputLoading}
                label={intl.formatMessage({ id: 'vehicleDetail.totalWeight' })}
                value={`${technicalInfo?.totalWeight ?? '-'} kg`}
              />
            ) : null}
          </InputRow>

          <InputRow>
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.insured' })}
              value={intl.formatMessage(
                { id: 'vehicleDetail.insuredValue' },
                { isInsured: inspectionInfo?.insuranceStatus },
              )}
            />
            <Input
              loading={inputLoading}
              label={intl.formatMessage({
                id: 'vehicleDetail.unpaidVehicleFee',
              })}
              value={
                typeof inspectionInfo?.carTax === 'undefined' ||
                inspectionInfo?.carTax === null
                  ? '-'
                  : `${inspectionInfo?.carTax} kr.`
              }
            />
          </InputRow>

          {mainInfo ? (
            <InputRow>
              {mainInfo?.trailerWithBrakesWeight ? (
                <Input
                  loading={inputLoading}
                  label={intl.formatMessage({
                    id: 'vehicleDetail.trailerWithBrakes',
                  })}
                  value={`${mainInfo?.trailerWithBrakesWeight} kg`}
                />
              ) : null}
              {mainInfo?.trailerWithoutBrakesWeight ? (
                <Input
                  loading={inputLoading}
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
                loading={inputLoading}
                label={intl.formatMessage({
                  id: 'vehicleDetail.capacityWeight',
                })}
                value={`${technicalInfo?.capacityWeight ?? '-'} kg`}
              />
            ) : null}
            {mainInfo?.co2 ? (
              <Input
                loading={inputLoading}
                label={intl.formatMessage({ id: 'vehicleDetail.nedc' })}
                value={`${mainInfo?.co2 ?? 0} g/km`}
              />
            ) : null}
          </InputRow>
        </View>
      </ScrollView>
    </View>
  )
}

VehicleDetailScreen.options = getNavigationOptions
