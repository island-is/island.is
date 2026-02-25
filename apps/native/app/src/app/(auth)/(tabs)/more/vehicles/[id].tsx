import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { ExternalLink } from '@/components/external-links/external-links'
import { useGetVehicleQuery } from '@/graphql/types/schema'
import { useBrowser } from '@/hooks/use-browser'
import { useMyPagesLinks } from '@/lib/my-pages-links'
import { Button, Divider, Input, InputRow, Problem, theme } from '@/ui'
import { testIDs } from '@/utils/test-ids'

export default function VehicleDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>()
  const intl = useIntl()
  const router = useRouter()
  const myPagesLinks = useMyPagesLinks()
  const { openBrowser } = useBrowser()
  const [menuVisible, setMenuVisible] = useState(false)

  const { data, loading, error } = useGetVehicleQuery({
    variables: {
      input: { regno: '', permno: id, vin: '' },
    },
  })

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

  const handleDropdownPress = useCallback(
    (link: string) => {
      setMenuVisible(false)
      openBrowser(link)
    },
    [openBrowser],
  )

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
      <Stack.Screen
        options={{
          title: title ?? data?.vehiclesDetail?.basicInfo?.model ?? '',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image
                source={require('@/assets/icons/Ellipsis-vertical.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: theme.color.blue400,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menu}>
              {dropdownItems.map((item, index) => (
                <ExternalLink
                  key={item.title}
                  links={{ link: item.link, title: item.title }}
                  borderBottom={index !== dropdownItems.length - 1}
                  fontWeight="bold"
                  fontSize={14}
                />
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
      <ScrollView style={{ flex: 1 }} testID={testIDs.SCREEN_VEHICLE_DETAIL}>
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
                    pathname: '/more/vehicles/mileage/[id]',
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menuContainer: {
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 100 : 56,
    paddingRight: theme.spacing[1],
  },
  menu: {
    minWidth: 150,
    backgroundColor: theme.color.white,
    borderRadius: 8,
    shadowRadius: 30,
    shadowColor: theme.color.blue400,
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
})
