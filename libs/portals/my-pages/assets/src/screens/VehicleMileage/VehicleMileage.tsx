import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  SkeletonLoader,
  Stack,
  Table,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  icelandLocalTime,
  IntroHeader,
  m,
  SAMGONGUSTOFA_SLUG,
  SimpleBarChart,
} from '@island.is/portals/my-pages/core'
import { InputController } from '@island.is/shared/form-fields'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { VehicleMileageDetail } from '@island.is/api/schema'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import format from 'date-fns/format'
import VehicleCO2 from '../../components/VehicleCO2'
import { vehicleMessage as messages } from '../../lib/messages'
import { displayWithUnit } from '../../utils/displayWithUnit'
import { isReadDateToday } from '../../utils/readDate'
import {
  useGetCo2Query,
  useGetUsersMileageQuery,
  usePostVehicleMileageMutation,
  usePutVehicleMileageMutation,
} from './VehicleDetail.generated'
import * as styles from './VehicleMileage.css'

const ORIGIN_CODE = 'ISLAND.IS'

type UseParams = {
  id: string
}

interface FormData {
  odometerStatus: number
}

interface ChartProps {
  date: string
  mileage: number
}

const VehicleMileage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const [formValue, setFormValue] = useState('')
  const { id } = useParams() as UseParams
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const { data: co2 } = useGetCo2Query({
    variables: {
      input: {
        page: 1,
        pageSize: 1,
        filterOnlyVehiclesUserCanRegisterMileage: true,
        query: id,
      },
    },
  })

  const [showChart, setShowChart] = useState<boolean>(false)
  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.isServicePortalVehicleBulkMileageSubdataPageEnabled,
        false,
      )
      if (ffEnabled) {
        setShowChart(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearAll = () => {
    // Clear form, state and errors on success.
    setFormValue('')
    reset()

    refetch()

    toast.success(formatMessage(messages.postSuccess))
  }

  const handleSubmitForm = async (submitData: FormData) => {
    if (isFormEditable) {
      if (details?.[0]?.internalId) {
        putAction({
          variables: {
            input: {
              internalId: parseInt(details[0].internalId),
              permno: id,
              mileageNumber: Number(submitData.odometerStatus),
            },
          },
        })
      } else {
        toast.error(formatMessage(m.errorTitle))
      }
    } else {
      postAction({
        variables: {
          input: {
            permno: id,
            originCode: ORIGIN_CODE,
            mileageNumber: Number(submitData.odometerStatus),
          },
        },
      })
    }
  }

  const { data, loading, error, refetch } = useGetUsersMileageQuery({
    variables: { input: { permno: id } },
  })

  const [putAction, { loading: putActionLoading }] =
    usePutVehicleMileageMutation({
      onError: () => {
        toast.error(formatMessage(m.errorTitle))
      },
      onCompleted: () => {
        clearAll()
      },
    })

  const [postAction, { loading: postActionLoading, data: updateData }] =
    usePostVehicleMileageMutation({
      onError: () => {
        toast.error(formatMessage(m.errorTitle))
      },
      onCompleted: () => {
        clearAll()
      },
    })

  const details = data?.vehicleMileageDetails?.data
  const hasData = details && details?.length > 0
  const isFormEditable = data?.vehicleMileageDetails?.editing
  const canRegisterMileage = data?.vehicleMileageDetails?.canRegisterMileage

  const actionLoading = putActionLoading || postActionLoading
  const hasUserPostAccess =
    data?.vehicleMileageDetails?.canUserRegisterVehicleMileage

  const parseChartData = (
    data: Array<VehicleMileageDetail>,
  ): Array<Record<string, number | string>> => {
    const filteredData = data?.reduce<Record<string, ChartProps>>(
      (acc, current) => {
        if (
          !current.mileageNumber ||
          !current.readDate ||
          !current.originCode
        ) {
          return acc
        }

        const currentDate = new Date(current.readDate).toISOString()
        //01.01.1993-ISLAND.IS
        const mashedKey = currentDate + '-' + current.originCode
        //If the "mashed" key isn't in the key array, add it.
        if (!Object.keys(acc).includes(mashedKey)) {
          acc[mashedKey] = { date: currentDate, mileage: current.mileageNumber }
        }
        return acc
      },
      {},
    )

    if (!filteredData) {
      return []
    }

    return Object.values(filteredData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        date: format(new Date(item.date), 'dd.MM.yyyy'),
        mileage: item.mileage,
      }))
  }

  return (
    <>
      <Box marginBottom={[2, 2, 6]}>
        <IntroHeader
          title={m.vehicleMileage}
          introComponent={
            <Text>
              {formatMessage(messages.vehicleMileageIntro, {
                href: (str: React.ReactNode) => (
                  <span>
                    <a
                      href={formatMessage(messages.mileageExtLink)}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.link}
                    >
                      {str}
                    </a>
                  </span>
                ),
              })}
            </Text>
          }
          serviceProviderSlug={SAMGONGUSTOFA_SLUG}
          serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
        />
        <Stack space={6}>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <GridContainer>
              <GridRow marginBottom={2}>
                {loading ? (
                  <GridColumn span={['8/8', '8/8', '8/8', '5/8']}>
                    <SkeletonLoader display="block" width={220} height={30} />
                  </GridColumn>
                ) : (
                  <GridColumn span={['8/8', '8/8', '8/8', '5/8']}>
                    {hasUserPostAccess ? (
                      isFormEditable ? (
                        <>
                          <Text as="h3" variant="h5">
                            {formatMessage(messages.mileageSuccessFormTitle)}
                          </Text>
                          <Text variant="default" paddingTop={1}>
                            {formatMessage(messages.mileageSuccessFormText, {
                              date: icelandLocalTime(
                                updateData?.vehicleMileagePost?.readDate ??
                                  details?.[0].readDate ??
                                  undefined,
                              ),
                            })}
                          </Text>
                        </>
                      ) : canRegisterMileage === true ? (
                        <Text as="h3" variant="h5">
                          {formatMessage(messages.vehicleMileageInputTitle)}
                        </Text>
                      ) : (
                        <Text as="h3" variant="h5">
                          {formatMessage(messages.mileageAlreadyRegistered)}
                        </Text>
                      )
                    ) : (
                      <Text as="h3" variant="h5">
                        {formatMessage(messages.mileageYouAreNotAllowed)}
                      </Text>
                    )}
                  </GridColumn>
                )}
              </GridRow>
              <GridRow
                alignItems="flexStart"
                rowGap={[1, 1, 2, 2, 'smallGutter']}
              >
                <GridColumn span={['1/1', '7/9', '6/9', '5/9', '3/9']}>
                  <InputController
                    control={control}
                    id="odometerStatus"
                    name="odometerStatus"
                    required
                    type="number"
                    suffix=" km"
                    thousandSeparator
                    backgroundColor="blue"
                    size="xs"
                    maxLength={12}
                    error={errors.odometerStatus?.message}
                    disabled={
                      (!isFormEditable && !canRegisterMileage) ||
                      !hasUserPostAccess
                    }
                    defaultValue={''}
                    onChange={(e) => setFormValue(e.target.value)}
                    rules={{
                      validate: {
                        value: (value: number) => {
                          // Input number must be higher than the highest known mileage registration value

                          if (details) {
                            // If we're in editing mode, we want to find the highest confirmed registered number, ignoring all Island.is registrations from today.
                            const confirmedRegistrations = details.filter(
                              (item) => {
                                if (item.readDate) {
                                  const isIslandIsReadingToday =
                                    item.originCode === ORIGIN_CODE &&
                                    isReadDateToday(new Date(item.readDate))
                                  return !isIslandIsReadingToday
                                }
                                return true
                              },
                            )

                            const detailArray = isFormEditable
                              ? confirmedRegistrations
                              : [...details]

                            const latestRegistration =
                              detailArray?.[0]?.mileageNumber ?? 0

                            if (latestRegistration > value) {
                              return formatMessage(messages.mileageInputTooLow)
                            }
                          }
                        },
                      },
                      required: {
                        value: true,
                        message: formatMessage(messages.mileageInputMinLength),
                      },
                      minLength: {
                        value: 1,
                        message: formatMessage(messages.mileageInputMinLength),
                      },
                    }}
                    label={formatMessage(messages.vehicleMileageInputLabel)}
                    placeholder={formatMessage(
                      messages.vehicleMileageInputPlaceholder,
                    )}
                  />
                </GridColumn>
                <GridColumn
                  span={['1/1', '7/9', '6/9', '5/9', '2/9']}
                  offset="0"
                  paddingBottom={[1, 1, 2, 0, 0]}
                  paddingTop="smallGutter"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    textAlign="center"
                    height="full"
                    paddingTop={'p5'}
                  >
                    <Button
                      variant="primary"
                      size="small"
                      fluid
                      type="submit"
                      loading={actionLoading || loading}
                      disabled={formValue.length === 0}
                    >
                      {formatMessage(isFormEditable ? m.update : m.register)}
                    </Button>
                  </Box>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </form>
          {loading && (
            <Box marginTop={2}>
              <SkeletonLoader
                space={2}
                repeat={4}
                display="block"
                width="full"
                height={35}
              />
            </Box>
          )}
          {!loading && !error && hasData && (
            <>
              <GridContainer>
                <GridRow marginBottom={2}>
                  <GridColumn span="1/1">
                    <Text as="h3" variant="h5">
                      {formatMessage(m.overview)}
                    </Text>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span="1/1">
                    <Table.Table width="100%">
                      <Table.Head>
                        <Table.Row>
                          <Table.HeadData>
                            {formatMessage(m.date)}
                          </Table.HeadData>
                          <Table.HeadData align="center">
                            {formatMessage(messages.vehicleMileageRegistration)}
                          </Table.HeadData>
                          <Table.HeadData align="right">
                            {formatMessage(messages.odometer)}
                          </Table.HeadData>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {details?.map((item, i) => (
                          <Table.Row key={i}>
                            <Table.Data>
                              {item.readDate
                                ? icelandLocalTime(item.readDate)
                                : ''}
                            </Table.Data>
                            <Table.Data align="center">
                              {item.originCode}
                            </Table.Data>
                            <Table.Data align="right">
                              {displayWithUnit(item.mileageNumber, 'km', true)}
                            </Table.Data>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Table>
                  </GridColumn>
                </GridRow>
              </GridContainer>
              {showChart && (
                <Box width="full">
                  <SimpleBarChart
                    data={parseChartData(details)}
                    datakeys={['date', 'mileage']}
                    bars={[
                      {
                        datakey: 'mileage',
                      },
                    ]}
                    xAxis={{
                      datakey: 'date',
                    }}
                    yAxis={{
                      datakey: 'mileage',
                      label: 'Km.',
                    }}
                    tooltip={{
                      labels: {
                        mileage: formatMessage(messages.odometer),
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Stack>
        <VehicleCO2 co2={co2?.vehiclesListV3?.data?.[0]?.co2 ?? '0'} />
      </Box>

      <FootNote
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        notes={[{ text: formatMessage(messages.infoNote) }]}
      />
    </>
  )
}

export default VehicleMileage
