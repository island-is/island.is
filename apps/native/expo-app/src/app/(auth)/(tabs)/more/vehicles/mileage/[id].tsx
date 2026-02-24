import { useCallback, useMemo, useState } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { Alert, FlatList, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { router } from 'expo-router'

import {
  Button,
  Divider,
  NavigationBarSheet,
  Problem,
  TextField,
  Typography,
  useDynamicColor,
} from '@/ui'
import externalLinkIcon from '@/assets/icons/external-link.png'
import {
  GetVehicleDocument,
  GetVehicleMileageDocument,
  GetVehicleMileageQuery,
  useGetVehicleMileageQuery,
  useGetVehicleQuery,
  usePostVehicleMileageMutation,
  useUpdateVehicleMileageMutation,
} from '@/graphql/types/schema'
import { useBrowser } from '@/lib/use-browser'
import { showPrompt } from '@/lib/show-picker'
import { MileageCell } from '@/screens/vehicles/components/mileage-cell'

const HIGHEST_MILEAGE = 9999999

export const originCodes = {
  'ISLAND.IS': 'Ísland.is',
  SKODUN: 'Skoðun',
}

type ListItem =
  | NonNullable<
      NonNullable<GetVehicleMileageQuery['vehicleMileageDetails']>['data']
    >[number]
  | {
      __typename: 'Skeleton'
      internalId: number
    }

export default function VehicleMileageScreen() {
  const params = useLocalSearchParams<{
    id: string
    vehicleType?: string
    vehicleYear?: string
    vehicleColor?: string
  }>()
  const { id } = params

  const intl = useIntl()
  const dynamicColor = useDynamicColor()
  const { openBrowser } = useBrowser()
  const [input, setInput] = useState('')

  const info = useGetVehicleQuery({
    fetchPolicy: 'cache-first',
    variables: {
      input: { regno: '', permno: id, vin: '' },
    },
  })

  const res = useGetVehicleMileageQuery({
    variables: { input: { permno: id } },
  })

  const [postMileage, { loading: loadingSubmit }] =
    usePostVehicleMileageMutation({
      refetchQueries: [GetVehicleMileageDocument, GetVehicleDocument],
    })

  const [updateMileage] = useUpdateVehicleMileageMutation({
    refetchQueries: [GetVehicleMileageDocument, GetVehicleDocument],
  })

  const data = useMemo<ListItem[]>(() => {
    if (res.loading && !res.data) {
      return Array.from({ length: 6 }).map((_, index) => ({
        __typename: 'Skeleton' as const,
        internalId: index,
      }))
    }
    return [...(res.data?.vehicleMileageDetails?.data ?? [])].sort((a, b) => {
      if (!a?.readDate || !b?.readDate) return 0
      return new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
    })
  }, [res.data, res.loading])

  const latestMileage =
    data?.[0]?.__typename !== 'Skeleton' && data[0]?.mileage
      ? +data[0].mileage
      : 0

  const isFormEditable = !!res.data?.vehicleMileageDetails?.editing
  const canRegisterMileage =
    !!res.data?.vehicleMileageDetails?.canRegisterMileage
  const canUserRegisterVehicleMileage =
    !!res.data?.vehicleMileageDetails?.canUserRegisterVehicleMileage

  const shouldDisableMileageForm =
    !canRegisterMileage || !canUserRegisterVehicleMileage
  const shouldDisableMileageEdit = !isFormEditable || shouldDisableMileageForm

  const vehicle = useMemo(() => {
    return {
      type:
        params.vehicleType ||
        `${info.data?.vehiclesDetail?.basicInfo?.model ?? ''} ${
          info.data?.vehiclesDetail?.basicInfo?.subModel ?? ''
        }`.trim(),
      year: params.vehicleYear ?? info.data?.vehiclesDetail?.basicInfo?.year,
      color:
        params.vehicleColor ??
        info.data?.vehiclesDetail?.registrationInfo?.color,
    }
  }, [info.data, params])

  const parseMileage = useCallback(
    (value?: string, allowLower?: boolean) => {
      const mileage = Number(String(value ?? '').replace(/\D/g, ''))
      if (mileage <= latestMileage && !allowLower) {
        Alert.alert(
          intl.formatMessage({ id: 'vehicle.mileage.errorTitle' }),
          intl.formatMessage({
            id: 'vehicle.mileage.errorMileageInputTooLow',
          }),
        )
        return false
      } else if (mileage > HIGHEST_MILEAGE) {
        Alert.alert(
          intl.formatMessage({ id: 'vehicle.mileage.errorTitle' }),
          intl.formatMessage({
            id: 'vehicle.mileage.errorMileageInputTooHigh',
          }),
        )
        return false
      }
      return String(mileage)
    },
    [latestMileage, intl],
  )

  const handleFailedToUpdate = () => {
    Alert.alert(
      intl.formatMessage({ id: 'vehicle.mileage.errorTitle' }),
      intl.formatMessage({ id: 'vehicle.mileage.errorFailedToUpdate' }),
    )
  }

  const onSubmit = useCallback(() => {
    const mileage = parseMileage(input)
    if (!mileage) return

    postMileage({
      variables: {
        input: { mileage, originCode: 'ISLAND.IS', permno: id },
      },
    })
      .then((res) => {
        if (res.data?.vehicleMileagePost?.mileage !== String(mileage)) {
          handleFailedToUpdate()
        } else {
          Alert.alert(
            intl.formatMessage({ id: 'vehicle.mileage.successTitle' }),
            intl.formatMessage({ id: 'vehicle.mileage.successMessage' }),
          )
        }
      })
      .catch(() => handleFailedToUpdate())
  }, [id, input, parseMileage, postMileage, intl])

  const onEditMileageSubmit = useCallback(
    (mileageInput: string | undefined) => {
      const mileage = parseMileage(mileageInput, true)
      const internalId = data[0].internalId
      if (!mileage) return

      if (!internalId) {
        return Alert.alert(
          intl.formatMessage({ id: 'vehicle.mileage.errorTitle' }),
          intl.formatMessage({
            id: 'vehicle.mileage.errorFailedToUpdate',
          }),
        )
      }

      updateMileage({
        variables: {
          input: {
            mileage: mileage.toString(),
            permno: id,
            internalId: Number(internalId),
          },
        },
      })
        .then((res) => {
          if (res.data?.vehicleMileagePut?.mileage !== String(mileage)) {
            handleFailedToUpdate()
          } else {
            Alert.alert(
              intl.formatMessage({ id: 'vehicle.mileage.successTitle' }),
              intl.formatMessage({ id: 'vehicle.mileage.successMessage' }),
            )
          }
        })
        .catch(() => handleFailedToUpdate())
    },
    [data, id, parseMileage, updateMileage, intl],
  )

  const onEdit = useCallback(async () => {
    const res = await showPrompt({
      title: intl.formatMessage({ id: 'vehicle.mileage.promptEditTitle' }),
      defaultValue: String(latestMileage),
      keyboardType: 'number-pad',
      positiveText: intl.formatMessage({
        id: 'vehicle.mileage.promptEditButton',
      }),
      negativeText: intl.formatMessage({
        id: 'vehicle.mileage.promptCancelButton',
      }),
    })
    if (res.action === 'positive') {
      return onEditMileageSubmit(res.text)
    }
  }, [latestMileage, onEditMileageSubmit, intl])

  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item, index }) =>
          item.__typename === 'Skeleton' ? (
            <MileageCell skeleton />
          ) : (
            <MileageCell
              title={
                originCodes[item.originCode as keyof typeof originCodes] ??
                item.originCode
              }
              subtitle={
                item.readDate ? <FormattedDate value={item.readDate} /> : '-'
              }
              accessory={
                item.mileage
                  ? `${intl.formatNumber(parseInt(item.mileage, 10))} km`
                  : '-'
              }
              editable={!shouldDisableMileageEdit && index === 0}
              onPress={onEdit}
            />
          )
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        keyExtractor={(item, index) => String(item.internalId ?? index)}
        ListHeaderComponent={
          <View key="list-header">
            <NavigationBarSheet
              componentId="vehicle-mileage"
              title={
                <View
                  style={{
                    flexDirection: 'column',
                    marginTop: 8,
                    marginBottom: 16,
                  }}
                >
                  <Typography variant="heading4">{vehicle.type}</Typography>
                  <Typography variant="body">
                    {vehicle.color} - {id}
                  </Typography>
                </View>
              }
              onClosePress={() => router.back()}
              style={{ marginHorizontal: 16 }}
              showLoading={res.loading && !!res.data}
            />
            <View style={{ flexDirection: 'column', gap: 16 }}>
              <TextField
                editable={!shouldDisableMileageForm}
                key="mileage-input"
                placeholder={intl.formatMessage({
                  id: 'vehicle.mileage.inputPlaceholder',
                })}
                placeholderTextColor={dynamicColor({
                  light: '#999999',
                  dark: '#999999',
                })}
                label={intl.formatMessage({
                  id: 'vehicle.mileage.inputLabel',
                })}
                value={input}
                maxLength={9}
                keyboardType="decimal-pad"
                onChange={(value) => {
                  setInput(
                    value.length
                      ? Intl.NumberFormat('is-IS').format(
                          Math.max(
                            0,
                            Math.min(
                              HIGHEST_MILEAGE,
                              Number(value.replace(/\D/g, '')),
                            ),
                          ),
                        )
                      : value,
                  )
                }}
              />
              <Button
                title={intl.formatMessage({
                  id: 'vehicle.mileage.inputSubmitButton',
                })}
                onPress={onSubmit}
                disabled={shouldDisableMileageForm || loadingSubmit}
              />
            </View>
            <View>
              {shouldDisableMileageForm && (
                <Typography
                  variant="body3"
                  textAlign="center"
                  style={{ marginTop: 16 }}
                >
                  {!canUserRegisterVehicleMileage
                    ? intl.formatMessage({
                        id: 'vehicle.mileage.youAreNotAllowedCopy',
                      })
                    : intl.formatMessage({
                        id: 'vehicle.mileage.registerIntervalCopy',
                      })}
                </Typography>
              )}
              <Button
                icon={externalLinkIcon}
                title={intl.formatMessage({
                  id: 'vehicle.mileage.moreInformationCopy',
                })}
                onPress={() =>
                  openBrowser('https://island.is/flokkur/akstur-og-bifreidar')
                }
                isTransparent
                textStyle={{ fontSize: 12, lineHeight: 16 }}
              />
            </View>
            <Divider style={{ marginLeft: 0, marginRight: 0 }} />
            <Typography
              variant="heading4"
              style={{ marginTop: 16, marginBottom: 16 }}
            >
              {intl.formatMessage({ id: 'vehicle.mileage.historyTitle' })}
            </Typography>
          </View>
        }
        style={{ flex: 1, margin: 16, marginTop: 0 }}
        ListFooterComponent={res.error ? <Problem error={res.error} /> : null}
      />
    </>
  )
}
