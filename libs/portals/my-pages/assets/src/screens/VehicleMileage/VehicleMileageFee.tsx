import { useMemo, useState } from 'react'

import {
  VehiclesMileageFeeDifferenceOutcome,
  VehiclesMileageFeePeriod,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  Icon,
  Inline,
  Select,
  Stack,
  Text,
  Tooltip,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  amountFormat,
  createColumnHelper,
  formSubmit,
  m,
  PortalTable,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { vehicleMessage as messages } from '../../lib/messages'
import { useGetVehicleMileageFeeQuery } from './VehicleMileageFee.generated'
import * as styles from './VehicleMileage.css'

const columnHelper = createColumnHelper<VehiclesMileageFeePeriod>()

const formatDifference = (value: number) =>
  `${value > 0 ? '+' : ''}${amountFormat(value)}`

const PeriodLabel = ({
  year,
  month,
}: Pick<VehiclesMileageFeePeriod, 'year' | 'month'>) => {
  const { formatDateFns } = useLocale()
  return <>{`${year} - ${formatDateFns(new Date(year, month - 1), 'LLLL')}`}</>
}

const DifferenceInfo = ({
  reversalThreshold,
}: {
  reversalThreshold?: number
}) => {
  const { formatMessage } = useLocale()
  return (
    <Tooltip
      text={
        <Stack space={1}>
          <Text variant="small">
            {formatMessage(messages.mileageFeeTooltipRefunded)}
          </Text>
          <Text variant="small">
            {formatMessage(messages.mileageFeeTooltipAdded)}
          </Text>
          <Text variant="small">
            {formatMessage(messages.mileageFeeTooltipReversed, {
              threshold: amountFormat(reversalThreshold),
            })}
          </Text>
        </Stack>
      }
    >
      <button
        type="button"
        className={styles.tooltipButton}
        aria-label={formatMessage(messages.mileageFeeDifferenceInfo)}
      >
        <Icon
          icon="informationCircle"
          type="outline"
          size="small"
          color="blue400"
        />
      </button>
    </Tooltip>
  )
}

const DifferenceValue = ({ period }: { period: VehiclesMileageFeePeriod }) => {
  const { formatMessage } = useLocale()
  const { difference, differenceOutcome } = period
  if (difference === null || difference === undefined) {
    return <>-</>
  }
  const text = formatDifference(difference)
  switch (differenceOutcome) {
    case VehiclesMileageFeeDifferenceOutcome.ADDED_TO_NEXT_INVOICE:
      return (
        <>
          <Text as="span" variant="medium" color="red600">
            {text}
          </Text>
          <VisuallyHidden>
            {' '}
            {formatMessage(messages.mileageFeeOutcomeAdded)}
          </VisuallyHidden>
        </>
      )
    case VehiclesMileageFeeDifferenceOutcome.REFUNDED:
      return (
        <>
          <Text as="span" variant="medium" color="mint800">
            {text}
          </Text>
          <VisuallyHidden>
            {' '}
            {formatMessage(messages.mileageFeeOutcomeRefunded)}
          </VisuallyHidden>
        </>
      )
    case VehiclesMileageFeeDifferenceOutcome.REVERSED:
      return (
        <>
          <Text as="span" variant="medium" color="dark350" strikethrough>
            {text}
          </Text>
          <VisuallyHidden>
            {' '}
            {formatMessage(messages.mileageFeeOutcomeReversed)}
          </VisuallyHidden>
        </>
      )
    default:
      return <>{text}</>
  }
}

interface Props {
  permno: string
}

export const VehicleMileageFee = ({ permno }: Props) => {
  const { formatMessage } = useLocale()
  const [year, setYear] = useState<number>()
  const [years, setYears] = useState<number[]>([])

  const { data, loading, error } = useGetVehicleMileageFeeQuery({
    variables: { input: { permno, year } },
    onCompleted: (result) => {
      if (result.vehicleMileageFee) {
        setYears(result.vehicleMileageFee.years)
      }
    },
  })

  const fee = error ? undefined : data?.vehicleMileageFee
  const selectedYear = year ?? years[0]
  const yearOptions = years.map((y) => ({
    label: y.toString(),
    value: y,
  }))
  const periods = [...(fee?.periods ?? [])].sort(
    (a, b) => b.year - a.year || b.month - a.month,
  )

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'period',
        header: formatMessage(messages.mileageFeePeriod),
        cell: ({ row }) => (
          <PeriodLabel year={row.original.year} month={row.original.month} />
        ),
        footer: () => formatMessage(messages.mileageFeeTotal),
        enableSorting: false,
      }),
      columnHelper.accessor('estimatedFee', {
        header: formatMessage(messages.mileageFeeEstimated),
        cell: ({ getValue }) => amountFormat(getValue()),
        footer: () => amountFormat(fee?.estimatedFeeTotal),
        meta: { align: 'right' },
        enableSorting: false,
      }),
      columnHelper.accessor('confirmedFee', {
        header: formatMessage(messages.mileageFeeConfirmed),
        cell: ({ getValue }) => amountFormat(getValue()) || '-',
        footer: () => amountFormat(fee?.confirmedFeeTotal),
        meta: { align: 'right' },
        enableSorting: false,
      }),
      columnHelper.accessor('difference', {
        header: () => (
          <Inline space={1} alignY="center" justifyContent="flexEnd">
            {formatMessage(messages.mileageFeeDifference)}
            <DifferenceInfo reversalThreshold={fee?.reversalThreshold} />
          </Inline>
        ),
        cell: ({ row }) => <DifferenceValue period={row.original} />,
        meta: { align: 'right' },
        enableSorting: false,
      }),
    ],
    [formatMessage, fee],
  )

  const announcement =
    year === undefined || loading
      ? ''
      : error
      ? formatMessage(m.errorTitle)
      : !fee
      ? formatMessage(messages.mileageFeeNotFound)
      : formatMessage(messages.mileageFeeYearLoaded, { year })

  const isInitialLoad = year === undefined

  if (isInitialLoad && error) {
    return <Problem error={error} noBorder={false} />
  }

  if (isInitialLoad && !loading && !fee) {
    return (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(messages.mileageFeeNotFound)}
      />
    )
  }

  return (
    <Box marginTop={6}>
      <VisuallyHidden>
        <span aria-live="polite">{announcement}</span>
      </VisuallyHidden>
      <Stack space={3}>
        <Text as="h3" variant="h5">
          {formatMessage(messages.mileageFeeTitle)}
        </Text>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="flexEnd"
          flexWrap="wrap"
          rowGap={2}
        >
          <Box className={styles.yearSelect}>
            <Select
              name="mileage-fee-year"
              label={formatMessage(messages.mileageFeeYear)}
              size="xs"
              backgroundColor="white"
              options={yearOptions}
              value={yearOptions.find((o) => o.value === selectedYear) ?? null}
              onChange={(option) => option && setYear(option.value)}
              isDisabled={years.length === 0}
            />
          </Box>
          <Button
            variant="utility"
            icon="download"
            iconType="outline"
            size="small"
            disabled={loading || !fee || periods.length === 0}
            onClick={() => fee && formSubmit(fee.downloadServiceUrl)}
          >
            {formatMessage(messages.mileageFeeDownload)}
          </Button>
        </Box>
        {error ? (
          <Problem error={error} noBorder={false} />
        ) : !loading && !fee ? (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(messages.mileageFeeNotFound)}
          />
        ) : (
          <PortalTable
            columns={columns}
            data={periods}
            loading={loading}
            emptyMessage={messages.mileageFeeNoPeriods}
            mobileTitleKey="period"
            srCaption={formatMessage(messages.mileageFeeTitle)}
          />
        )}
      </Stack>
    </Box>
  )
}

export default VehicleMileageFee
