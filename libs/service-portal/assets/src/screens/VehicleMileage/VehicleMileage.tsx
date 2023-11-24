import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
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
  m,
  FootNote,
  SAMGONGUSTOFA_SLUG,
  IntroHeader,
  icelandLocalTime,
} from '@island.is/service-portal/core'

import { vehicleMessage as messages } from '../../lib/messages'
import {
  useGetUsersMileageQuery,
  usePostVehicleMileageMutation,
  usePutVehicleMileageMutation,
} from './VehicleDetail.generated'
import { displayWithUnit } from '../../utils/displayWithUnit'
import * as styles from './VehicleMileage.css'
import { Problem } from '@island.is/react-spa/shared'

const ORIGIN_CODE = 'ISLAND.IS'

type UseParams = {
  id: string
}

interface FormData {
  odometerStatus: number
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
              internalId: details?.[0]?.internalId,
              permno: id,
              mileage: String(submitData.odometerStatus),
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
            mileage: String(submitData.odometerStatus),
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
  const requiresMileageRegistration =
    data?.vehicleMileageDetails?.requiresMileageRegistration

  const actionLoading = putActionLoading || postActionLoading

  if ((error || requiresMileageRegistration === false) && !loading) {
    return <Problem type="not_found" />
  }

  return (
    <>
      <Box marginBottom={[2, 2, 6]}>
        <IntroHeader
          title={m.vehicleMileage}
          introComponent={formatMessage(messages.vehicleMileageIntro, {
            href: (str: any) => (
              <span>
                <a
                  href="https://island.is/flokkur/akstur-og-bifreidar"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  {str}
                </a>
              </span>
            ),
          })}
          serviceProviderSlug={SAMGONGUSTOFA_SLUG}
          serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
        />
        <Stack space={6}>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <GridContainer>
              <GridRow marginBottom={2}>
                <GridColumn span={['8/8', '8/8', '8/8', '5/8']}>
                  {isFormEditable ? (
                    <>
                      <Text as="h3" variant="h5">
                        {formatMessage(messages.mileageSuccessFormTitle)}
                      </Text>
                      <Text variant="default" paddingTop={1}>
                        {formatMessage(messages.mileageSuccessFormText, {
                          date: updateData?.vehicleMileagePost?.readDate
                            ? icelandLocalTime(
                                updateData?.vehicleMileagePost?.readDate,
                              )
                            : '',
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
                  )}
                </GridColumn>
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
                    defaultValue={''}
                    onChange={(e) => setFormValue(e.target.value)}
                    rules={{
                      validate: {
                        value: (value: number) => {
                          // Input number must be higher than the highest known mileage registration value

                          if (details) {
                            // If we're in editing mode, we want to find the highest number ignoring the most recent one.
                            const [, ...rest] = details
                            const detailArray = isFormEditable
                              ? rest
                              : [...details]

                            const highestRegistration = Math.max(
                              ...detailArray.map((o) =>
                                parseInt(o.mileage ?? '0'),
                              ),
                            )
                            if (highestRegistration > value) {
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
                        <Table.HeadData>{formatMessage(m.date)}</Table.HeadData>
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
                            {displayWithUnit(item.mileage, 'km', true)}
                          </Table.Data>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Table>
                </GridColumn>
              </GridRow>
            </GridContainer>
          )}
        </Stack>
      </Box>

      <FootNote
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        notes={[{ text: formatMessage(messages.infoNote) }]}
      />
    </>
  )
}

export default VehicleMileage
