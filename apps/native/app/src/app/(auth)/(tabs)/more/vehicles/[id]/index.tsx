import { NetworkStatus } from '@apollo/client'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useIntl } from 'react-intl'
import {
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native'
import { ContextMenu } from 'react-native-platform-components'

import { StackScreen } from '@/components/stack-screen'
import {
  useGetVehicleMileageQuery,
  useGetVehicleQuery,
} from '@/graphql/types/schema'
import { useBrowser } from '@/hooks/use-browser'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import { Button, Input, InputRow, LinkText, Problem, Typography } from '@/ui'
import { testIDs } from '@/utils/test-ids'
import { useMemo, useState } from 'react'
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
  const mileageUnit = mainInfo?.hasMilesOdometer ? 'mi' : 'km'

  // The vehicle detail endpoint returns the latest mileage number but not its
  // read date, so fetch the mileage registrations to get the most recent date.
  const mileageRes = useGetVehicleMileageQuery({
    variables: { input: { permno: id } },
    skip: !allowMileageRegistration,
  })

  const latestMileageRecord = useMemo(() => {
    const records = mileageRes.data?.vehicleMileageDetails?.data ?? []
    return [...records]
      .filter((record) => !!record?.readDate)
      .sort(
        (a, b) =>
          new Date(b.readDate as string).getTime() -
          new Date(a.readDate as string).getTime(),
      )[0]
  }, [mileageRes.data])

  const lastMileageDate = latestMileageRecord?.readDate
    ? intl.formatDate(new Date(latestMileageRecord.readDate))
    : null
  const lastMileageNumber =
    latestMileageRecord?.mileage ?? data?.vehiclesDetail?.lastMileage?.mileage
  const lastMileageValue = lastMileageNumber
    ? `${intl.formatNumber(parseInt(lastMileageNumber, 10))} ${mileageUnit}`
    : '-'

  const navigateToMileage = () => {
    router.navigate({
      pathname: '/more/vehicles/[id]/mileage',
      params: {
        id,
        vehicleType: title ?? '',
        vehicleYear: basicInfo?.year ?? '',
        vehicleColor: registrationInfo?.color ?? '',
      },
    })
  }

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={res.networkStatus === NetworkStatus.refetch}
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
            headerBackButtonDisplayMode: 'minimal',
            headerBackTitle: '',
            headerRightItems: [
              {
                type: 'custom',
                element: (
                  <ContextMenu
                    title={intl.formatMessage({
                      id: 'vehicleDetail.moreOptions',
                    })}
                    trigger="tap"
                    android={{ visible: showContext }}
                    actions={
                      dropdownItems.map((item) => ({
                        id: item.link,
                        title: item.title,
                        image: Platform.select({
                          android: 'ic_external_link',
                          ios: 'arrow.up.forward',
                        }),
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
                    <Pressable onPress={() => setShowContext(true)}>
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
                onPress={navigateToMileage}
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
              label={intl.formatMessage({ id: 'vehicleDetail.firstReg' })}
              value={
                registrationInfo?.firstRegistrationDate
                  ? intl.formatDate(
                      new Date(registrationInfo.firstRegistrationDate),
                    )
                  : '-'
              }
            />
          </InputRow>
          <InputRow>
            <Input
              loading={inputLoading}
              label={intl.formatMessage({
                id: 'vehicleDetail.nextInspectionDate',
              })}
              value={
                inspectionInfo?.nextInspectionDate
                  ? intl.formatDate(new Date(inspectionInfo.nextInspectionDate))
                  : '-'
              }
            />
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.insured' })}
              value={intl.formatMessage(
                { id: 'vehicleDetail.insuredValue' },
                { isInsured: inspectionInfo?.insuranceStatus },
              )}
            />
          </InputRow>
          {allowMileageRegistration && (
            <InputRow>
              <Input
                loading={inputLoading}
                label={`${intl.formatMessage({
                  id: 'vehicleDetail.lastOdometer',
                })}${lastMileageDate ? ` (${lastMileageDate})` : ''}`}
                value={lastMileageValue}
                rightElement={
                  <Pressable
                    onPress={navigateToMileage}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <LinkText variant="small">
                      {intl.formatMessage({ id: 'vehicleDetail.viewMore' })}
                    </LinkText>
                    <Typography
                      variant="body"
                      size={13}
                      weight="600"
                      color={theme.color.blue400}
                    >
                      →
                    </Typography>
                  </Pressable>
                }
              />
            </InputRow>
          )}

          <Typography
            variant="eyebrow"
            color={theme.color.purple400}
            style={{
              marginHorizontal: theme.spacing[2],
              marginTop: theme.spacing[3],
              marginBottom: theme.spacing[1],
            }}
          >
            {intl.formatMessage({ id: 'vehicleDetail.moreInfo' })}
          </Typography>

          <InputRow>
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.color' })}
              value={registrationInfo?.color}
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

          {mainInfo &&
          (mainInfo.trailerWithBrakesWeight ||
            mainInfo.trailerWithoutBrakesWeight) ? (
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
            {mainInfo?.co2 ? (
              <Input
                loading={inputLoading}
                label={intl.formatMessage({ id: 'vehicleDetail.nedc' })}
                value={`${mainInfo.co2 ?? 0} g/km`}
              />
            ) : null}
            <Input
              loading={inputLoading}
              label={intl.formatMessage({ id: 'vehicleDetail.permno' })}
              value={basicInfo?.permno}
            />
          </InputRow>

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

          {technicalInfo?.capacityWeight ? (
            <InputRow>
              <Input
                loading={inputLoading}
                label={intl.formatMessage({
                  id: 'vehicleDetail.capacityWeight',
                })}
                value={`${technicalInfo.capacityWeight ?? '-'} kg`}
              />
            </InputRow>
          ) : null}
        </View>
      </ScrollView>
    </>
  )
}
