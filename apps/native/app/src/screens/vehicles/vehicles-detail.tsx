import React from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, Text, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useMyPagesLinks } from '../../lib/my-pages-links'

import { useNavigationButtonPress } from 'react-native-navigation-hooks'
import { setDropdownContent } from '../../components/dropdown/dropdown-content-registry'
import { LinkRowButton } from '../../components/link-row-button/link-row-button'
import { useGetVehicleQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { navigateTo } from '../../lib/deep-linking'
import { useBrowser } from '../../lib/use-browser'
import { Button, Divider, Input, InputRow, Problem, theme } from '../../ui'
import {
  ButtonRegistry,
  ComponentRegistry,
} from '../../utils/component-registry'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme) => ({
    topBar: {
      visible: true,
      rightButtons: getRightButtons({ icons: ['dots'], theme }),
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
  const myPagesLinks = useMyPagesLinks()
  const { openBrowser } = useBrowser()

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
    rightButtons: getRightButtons({ icons: ['dots'] }),
  })

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === ButtonRegistry.HomeScreenDropdownButton) {
      const items = [
        {
          title: intl.formatMessage({
            id: 'vehicle.links.dropdown.orderNumberPlate',
          }),
          link: myPagesLinks.orderNumberPlate,
        },
        {
          title: intl.formatMessage({
            id: 'vehicle.links.dropdown.orderRegistrationCertificate',
          }),
          link: myPagesLinks.orderRegistrationCertificate,
        },
        {
          title: intl.formatMessage({
            id: 'vehicle.links.dropdown.changeCoOwner',
          }),
          link: myPagesLinks.changeCoOwner,
        },
        {
          title: intl.formatMessage({
            id: 'vehicle.links.dropdown.changeOperator',
          }),
          link: myPagesLinks.changeOperator,
        },
      ]

      const contentId = `vehicle-dropdown-${id}`
      setDropdownContent(
        contentId,
        <View>
          {items.map((item, index) => (
            <LinkRowButton
              componentId={componentId}
              key={item.title}
              link={{ link: item.link, title: item.title, isExternal: true }}
              borderBottom={index !== items.length - 1}
              fontWeight={'bold'}
              fontSize={14}
            />
          ))}
        </View>,
      )

      void Navigation.showOverlay({
        component: {
          name: ComponentRegistry.DropdownMenuOverlay,
          passProps: {
            contentId,
          },
        },
      })
    }
  }, componentId)

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
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              margin: theme.spacing.p4,
              gap: theme.spacing.p4,
            }}
          >
            {allowMilageRegistration && (
              <Button
                style={{ flex: 1 }}
                iconStyle={{ tintColor: theme.color.dark300 }}
                isOutlined
                title={intl.formatMessage({
                  id: 'vehicles.registerMileage',
                })}
                iconPosition="end"
                icon={require('../../assets/icons/edit.png')}
                isUtilityButton
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
              />
            )}
            <Button
              style={{ flex: 1 }}
              isOutlined
              iconPosition="end"
              iconStyle={{ tintColor: theme.color.dark300 }}
              icon={require('../../assets/icons/external-link.png')}
              isUtilityButton
              title={intl.formatMessage({
                id: 'vehicle.links.reportOwnerChange',
              })}
              onPress={() => {
                openBrowser(myPagesLinks.reportOwnerChange, componentId)
              }}
            />
          </View>
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
