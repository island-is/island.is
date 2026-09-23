import {
  RightsPortalDrugBill,
  RightsPortalDrugPeriod,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  Hyphen,
  LinkV2,
  Select,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  amountFormat,
  createColumnHelper,
  DownloadFileButtons,
  LinkResolver,
  m,
  PortalTable,
  StackWithBottomDivider,
  UserInfoLine,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useMemo, useState } from 'react'
import { messages } from '../../lib/messages'
import { tableTextCell } from '../../components/TableTextCell/TableTextCell'
import { HealthPaths } from '../../lib/paths'
import { CONTENT_GAP, DATE_FORMAT, SECTION_GAP } from '../../utils/constants'
import { exportMedicineBill } from '../../utils/FileBreakdown'
import {
  useGetDrugsBillsLazyQuery,
  useGetDrugsDataQuery,
} from './Medicine.generated'
import MedicineBillLines from './MedicineBillLines'
import { MedicinePaymentParticipationWrapper } from './wrapper/MedicinePaymentParticipationWrapper'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'

const columnHelper = createColumnHelper<RightsPortalDrugBill>()

export const MedicinePurchase = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()

  const { formatMessage, formatDateFns } = useLocale()
  const [selectedPeriod, setSelectedPeriod] =
    useState<RightsPortalDrugPeriod | null>(null)
  const formatDatePeriod = (dateFrom: Date | null, dateTo: Date | null) => {
    if (!dateFrom || !dateTo) return ''
    return `${formatDateFns(dateFrom, DATE_FORMAT)} - ${formatDateFns(
      dateTo,
      DATE_FORMAT,
    )}`
  }

  const [bills, setBills] = useState<RightsPortalDrugBill[] | null>(null)
  const [billsLoading, setBillsLoading] = useState<boolean>(false)

  const { data, loading, error } = useGetDrugsDataQuery()

  const [getPaymentPeriodsQuery] = useGetDrugsBillsLazyQuery()

  useEffect(() => {
    if (selectedPeriod) {
      setBillsLoading(true)
      getPaymentPeriodsQuery({
        variables: {
          input: {
            paymentPeriodId: selectedPeriod?.id ?? '',
          },
        },
        onCompleted: (data) => {
          setBills(data.rightsPortalDrugBills)
          setBillsLoading(false)
        },
        onError: () => {
          setBillsLoading(false)
        },
      })
    }
  }, [selectedPeriod, getPaymentPeriodsQuery])

  useEffect(() => {
    if (data) {
      const firstItem = data.rightsPortalDrugPeriods[0] ?? null
      if (firstItem) setSelectedPeriod(firstItem)
    }
  }, [data])

  const columns = useMemo(() => {
    return [
      columnHelper.accessor((bill) => bill.date ?? '', {
        id: 'date',
        header: formatMessage(m.date),
        enableSorting: false,
        meta: { type: 'interactive' },
        cell: ({ row }) =>
          tableTextCell(formatDateFns(row.original.date, DATE_FORMAT)),
      }),
      columnHelper.accessor((bill) => bill.description ?? '', {
        id: 'description',
        header: formatMessage(m.explanationNote),
        enableSorting: false,
      }),
      columnHelper.accessor((bill) => bill.totalCopaymentAmount ?? 0, {
        id: 'totalCopaymentAmount',
        header: () => (
          <Hyphen>
            {formatMessage(messages.medicinePaymentParticipationPrice)}
          </Hyphen>
        ),
        enableSorting: false,
        meta: { type: 'interactive' },
        cell: ({ getValue }) => tableTextCell(amountFormat(getValue())),
      }),
      columnHelper.accessor((bill) => bill.totalCustomerAmount ?? 0, {
        id: 'totalCustomerAmount',
        header: formatMessage(messages.medicinePaidByCustomer),
        enableSorting: false,
        meta: { type: 'interactive' },
        cell: ({ getValue }) => tableTextCell(amountFormat(getValue())),
      }),
    ]
  }, [formatMessage, formatDateFns])

  return (
    <MedicinePaymentParticipationWrapper
      pathname={HealthPaths.HealthMedicinePurchase}
    >
      <Box marginBottom={SECTION_GAP}>
        <Text variant="h5" marginBottom={1}>
          {formatMessage(messages.medicinePurchaseTitle)}
        </Text>
        <Text>{formatMessage(messages.medicinePurchaseIntroText)}</Text>
      </Box>
      {error && !loading && (
        <Box marginBottom={SECTION_GAP}>
          <Problem error={error} noBorder={false} />
        </Box>
      )}
      {!error && loading && (
        <Box marginBottom={CONTENT_GAP}>
          <SkeletonLoader
            repeat={4}
            borderRadius="standard"
            space={2}
            height={32}
          />
        </Box>
      )}
      {!error && !loading && !!data?.rightsPortalDrugPeriods?.length && (
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            marginBottom={SECTION_GAP}
            justifyContent="flexStart"
          >
            <Select
              name="paymentPeroid"
              size="xs"
              label={formatMessage(messages.medicinePaymentPeriod)}
              options={data.rightsPortalDrugPeriods.map((period) => ({
                label: formatDatePeriod(
                  period.dateFrom ? new Date(period.dateFrom) : null,
                  period.dateTo ? new Date(period.dateTo) : null,
                ),
                value: period.id,
              }))}
              backgroundColor="blue"
              value={
                selectedPeriod &&
                selectedPeriod?.id &&
                selectedPeriod?.dateFrom &&
                selectedPeriod?.dateTo
                  ? {
                      label: formatDatePeriod(
                        selectedPeriod.dateFrom,
                        selectedPeriod.dateTo,
                      ),
                      value: selectedPeriod.id,
                    }
                  : undefined
              }
              onChange={(option) =>
                setSelectedPeriod(
                  data.rightsPortalDrugPeriods.find(
                    (period) => period.id === option?.value,
                  ) ?? null,
                )
              }
            />
          </Box>
          <Box
            borderBottomWidth="standard"
            marginBottom={SECTION_GAP}
            borderColor="blue200"
          >
            <Text variant="eyebrow" color="purple400" marginBottom={1}>
              {formatMessage(messages.periodStatus)}
            </Text>
            <StackWithBottomDivider space={2}>
              <UserInfoLine
                label={formatMessage(messages.period)}
                content={
                  formatDatePeriod(
                    selectedPeriod?.dateFrom,
                    selectedPeriod?.dateTo,
                  ) ?? ''
                }
              />
              <UserInfoLine
                label={formatMessage(messages.medicinePaymentStatus)}
                content={amountFormat(selectedPeriod?.paymentStatus ?? 0)}
              />
              <UserInfoLine
                label={formatMessage(messages.medicineStep)}
                content={
                  formatMessage(messages.medicineStepStatus, {
                    step: selectedPeriod?.levelNumber,
                    ratio: selectedPeriod?.levelPercentage,
                  }) ?? ''
                }
              />
            </StackWithBottomDivider>
          </Box>
        </Box>
      )}
      <Box
        marginBottom={SECTION_GAP}
        display="flex"
        justifyContent="flexStart"
        columnGap={2}
      >
        <LinkV2 href={formatMessage(messages.medicinePriceListLink)} newTab>
          <Button
            variant="utility"
            icon="open"
            iconType="outline"
            as="span"
            unfocusable
          >
            {formatMessage(messages.medicinePriceList)}
          </Button>
        </LinkV2>

        <LinkResolver href={HealthPaths.HealthMedicineCalculator}>
          <Button
            variant="utility"
            icon="calculator"
            iconType="outline"
            as="span"
            unfocusable
          >
            {formatMessage(messages.medicineCalculatorTitle)}
          </Button>
        </LinkResolver>
      </Box>
      <Box>
        {billsLoading || loading ? (
          <SkeletonLoader repeat={3} borderRadius="large" space={1} />
        ) : (
          bills?.length && (
            <>
              <Text marginBottom={CONTENT_GAP} variant="h5">
                {formatMessage(messages.medicineBills)}
              </Text>
              <PortalTable
                columns={columns}
                data={bills}
                emptyMessage={m.noDataFound}
                getRowId={(bill, i) => bill.id ?? `${i}`}
                mobileTitleKey="description"
                renderExpandedRow={({ original: bill }) => (
                  <MedicineBillLines
                    bill={bill}
                    paymentPeriodId={selectedPeriod?.id ?? ''}
                  />
                )}
              />
            </>
          )
        )}
        {bills?.length ? (
          <DownloadFileButtons
            BoxProps={{
              paddingTop: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flexEnd',
            }}
            buttons={[
              {
                text: formatMessage(m.getAsExcel),
                onClick: () => exportMedicineBill(bills),
              },
            ]}
          />
        ) : undefined}
      </Box>
    </MedicinePaymentParticipationWrapper>
  )
}

export default MedicinePurchase
