import { useParams } from 'react-router-dom'
import { InputController } from '@island.is/shared/form-fields'
import { Controller, useForm } from 'react-hook-form'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  LoadingDots,
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
  formatDate,
  icelandLocalTime,
} from '@island.is/service-portal/core'

import { vehicleMessage as messages } from '../../lib/messages'
import {
  useGetUsersMileageQuery,
  usePostVehicleMileageMutation,
} from './VehicleDetail.generated'
import { displayWithUnit } from '../../utils/displayWithUnit'
import * as styles from './VehicleMileage.css'

const ORIGIN_CODE = 'ISLAND.IS'

type UseParams = {
  id: string
}

interface FormData {
  odometerStatus: number
}

const VehicleMilage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const handleSubmitForm = async (submitData: FormData) => {
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

  const { data, loading, error, updateQuery } = useGetUsersMileageQuery({
    variables: { input: { permno: id } },
  })

  const [postAction, { loading: postActionLoading }] =
    usePostVehicleMileageMutation({
      onError: (e) => {
        toast.error(formatMessage(m.errorTitle))
      },
      onCompleted: (mutationData) => {
        // Update useGetUsersMileageQuery on mutation success.
        const updatedMileage = mutationData.vehicleMileagePost
        toast.success(formatMessage(messages.postSuccess))

        updateQuery((prevData) => {
          const prevDetails = prevData.vehicleMileageDetails ?? []

          const updatedDetails = updatedMileage
            ? [updatedMileage, ...prevDetails]
            : prevDetails

          return {
            vehicleMileageDetails: updatedDetails,
          }
        })
      },
    })

  const details = data?.vehicleMileageDetails
  const hasData = details && details?.length > 0

  return (
    <>
      <Box marginBottom={[2, 2, 6]}>
        <IntroHeader
          title={m.vehicleMilage}
          introComponent={formatMessage(messages.vehicleMilageIntro, {
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
                <GridColumn span="1/1">
                  <Text as="h3" variant="h5">
                    {formatMessage(messages.vehicleMilageInputTitle)}
                  </Text>
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
                    rules={{
                      validate: {
                        value: (value: number) => {
                          // Input number must be higher than the highest known mileage registration value
                          if (details) {
                            const highestRegistration = Math.max(
                              ...details.map((o) => parseInt(o.mileage ?? '0')),
                            )
                            if (highestRegistration > value) {
                              return formatMessage(messages.mileageInputTooLow)
                            }
                          }
                        },
                      },
                    }}
                    label={formatMessage(messages.vehicleMilageInputLabel)}
                    placeholder={formatMessage(
                      messages.vehicleMilageInputPlaceholder,
                    )}
                  />
                </GridColumn>
                <GridColumn
                  span={['1/1', '7/9', '6/9', '5/9', '2/9']}
                  offset={['0', '0', '0', '0', '0']}
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
                      loading={postActionLoading}
                    >
                      {formatMessage(m.save)}
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
                          {formatMessage(messages.vehicleMilageRegistration)}
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

export default VehicleMilage
