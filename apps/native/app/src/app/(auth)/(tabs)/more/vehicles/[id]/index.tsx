import { useLocalSearchParams, useRouter } from 'expo-router'
import { useIntl } from 'react-intl'
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native'
import { ContextMenu } from 'react-native-platform-components'

import { StackScreen } from '@/components/stack-screen'
import { useGetVehicleQuery } from '@/graphql/types/schema'
import { useBrowser } from '@/hooks/use-browser'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import { Button, Divider, Input, InputRow, Problem } from '@/ui'
import { testIDs } from '@/utils/test-ids'
import { useState } from 'react'
import { useTheme } from 'styled-components'

export default function VehicleDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>()
  const intl = useIntl()
  const router = useRouter()
  const myPagesLinks = useMyPagesLinks()
  const theme = useTheme()
  const { openBrowser } = useBrowser()
  const [showContext, setShowContext] = useState(false)

  const res = useGetVehicleQuery({
    variables: {
      input: { regno: '', permno: id, vin: '' },
    },
  })
  const { data, loading, error } = res

  const {
    mainInfo,
    basicInfo,
    registrationInfo,
    inspectionInfo,
    technicalInfo,
  } = data?.vehiclesDetail || {}

  const noInfo = data?.vehiclesDetail === null

  const dropdownItems = [
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

  if (noInfo && !loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{intl.formatMessage({ id: 'vehicleDetail.noInfo' })}</Text>
      </View>
    )
  }

  if (error) {
    return <Problem withContainer error={error} />
  }

  const inputLoading = loading && !data
  const allowMileageRegistration =
    mainInfo?.requiresMileageRegistration ||
    mainInfo?.availableMileageRegistration

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={res.loading && !data}
            onRefresh={() => res.refetch()}
          />
        }
        style={{ flex: 1 }}
        testID={testIDs.SCREEN_VEHICLE_DETAIL}
      >
        <StackScreen
          networkStatus={res.networkStatus}
          options={{
            title: title ?? data?.vehiclesDetail?.basicInfo?.model ?? '',
            headerRightItems: [
              {
                type: 'custom',
                element: (
                  <ContextMenu
                    title="Fleiri valmöguleikar"
                    trigger="tap"
                    android={{ visible: showContext }}
                    actions={
                      dropdownItems.map((item) => ({
                        id: item.link,
                        title: item.title,
                        image: 'arrow.up.forward',
                      })) || []
                    }
                    onPressAction={(id, title) => {
                      const item = dropdownItems.find((i) => i.link === id)
                      if (item) {
                        openBrowser(item.link)
                      }
                    }}
                    onMenuClose={() => setShowContext(false)}
                  >
                    <Pressable
                      onPress={() => setShowContext(true)}
                    >
                      <Image
                        source={require('@/assets/icons/Ellipsis-vertical.png')}
                        width={24}
                        height={24}
                        tintColor={theme.shade.foreground}
                      />
                    </Pressable>
                  </ContextMenu>
                ),
              },
            ],
          }}
        />
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              margin: theme.spacing.p4,
              gap: theme.spacing.p4,
            }}
          >
            {allowMileageRegistration && (
              <Button
                style={{ flex: 1 }}
                iconStyle={{ tintColor: theme.color.dark300 }}
                isOutlined
                title={intl.formatMessage({
                  id: 'vehicles.registerMileage',
                })}
                iconPosition="end"
                icon={require('@/assets/icons/edit.png')}
                isUtilityButton
                onPress={() => {
                  router.navigate({
                    pathname: '/more/vehicles/[id]/mileage',
                    params: {
                      id,
                      vehicleType: title ?? '',
                      vehicleYear: basicInfo?.year ?? '',
                      vehicleColor: registrationInfo?.color ?? '',
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
              icon={require('@/assets/icons/external-link.png')}
              isUtilityButton
              title={intl.formatMessage({
                id: 'vehicle.links.reportOwnerChange',
              })}
              onPress={() => openBrowser(myPagesLinks.reportOwnerChange)}
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
                      new Date(registrationInfo.firstRegistrationDate),
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
                  ? intl.formatDate(new Date(inspectionInfo.nextInspectionDate))
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
                        parseInt(data.vehiclesDetail.lastMileage.mileage, 10),
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
              label={intl.formatMessage({
                id: 'vehicleDetail.vehicleWeight',
              })}
              value={`${technicalInfo?.vehicleWeight ?? ''} kg`}
            />
            {technicalInfo?.totalWeight ? (
              <Input
                loading={inputLoading}
                label={intl.formatMessage({
                  id: 'vehicleDetail.totalWeight',
                })}
                value={`${technicalInfo.totalWeight ?? '-'} kg`}
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
                  : `${inspectionInfo.carTax} kr.`
              }
            />
          </InputRow>

          {mainInfo ? (
            <InputRow>
              {mainInfo.trailerWithBrakesWeight ? (
                <Input
                  loading={inputLoading}
                  label={intl.formatMessage({
                    id: 'vehicleDetail.trailerWithBrakes',
                  })}
                  value={`${mainInfo.trailerWithBrakesWeight} kg`}
                />
              ) : null}
              {mainInfo.trailerWithoutBrakesWeight ? (
                <Input
                  loading={inputLoading}
                  label={intl.formatMessage({
                    id: 'vehicleDetail.trailerWithoutBrakes',
                  })}
                  value={`${mainInfo.trailerWithoutBrakesWeight} kg`}
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
                value={`${technicalInfo.capacityWeight ?? '-'} kg`}
              />
            ) : null}
            {mainInfo?.co2 ? (
              <Input
                loading={inputLoading}
                label={intl.formatMessage({ id: 'vehicleDetail.nedc' })}
                value={`${mainInfo.co2 ?? 0} g/km`}
              />
            ) : null}
          </InputRow>
        </View>
      </ScrollView>
    </>
  )
}
