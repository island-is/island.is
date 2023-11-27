import {
  Box,
  Text,
  Select,
  Stack,
  Button,
  SkeletonLoader,
  Table as T,
  LinkV2,
  Hyphen,
} from '@island.is/island-ui/core'
import {
  ExpandHeader,
  ExpandRow,
  IntroHeader,
  LinkResolver,
  UserInfoLine,
  amountFormat,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { messages } from '../../lib/messages'
import {
  useGetDrugBillLineItemLazyQuery,
  useGetDrugsBillsLazyQuery,
  useGetDrugsDataQuery,
} from './Medicine.generated'
import {
  RightsPortalDrugBillLine,
  RightsPortalDrugBill,
  RightsPortalDrugPeriod,
} from '@island.is/api/schema'
import { useEffect, useState } from 'react'
import * as styles from './Medicine.css'
import { CONTENT_GAP, DATE_FORMAT, SECTION_GAP } from './constants'
import { MedicineWrapper } from './wrapper/MedicineWrapper'
import { HealthPaths } from '../../lib/paths'

export const MedicinePurchase = () => {
  useNamespaces('sp.health')

  const { formatMessage, formatDateFns } = useLocale()
  const [selectedPeriod, setSelectedPeriod] =
    useState<RightsPortalDrugPeriod | null>(null)
  const [selectedLineItem, setSelectedLineItem] = useState<string>('')
  const fetchedLineItems = new Map<string, RightsPortalDrugBillLine[]>()
  const formatDatePeriod = (dateFrom: Date, dateTo: Date) => {
    if (!dateFrom || !dateTo) return ''
    return `${formatDateFns(dateFrom, DATE_FORMAT)} - ${formatDateFns(
      dateTo,
      DATE_FORMAT,
    )}`
  }

  const [bills, setBills] = useState<RightsPortalDrugBill[] | null>(null)
  const [billsLoading, setBillsLoading] = useState<boolean>(false)

  const { data, loading } = useGetDrugsDataQuery()

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

  const [lineItemQuery, { loading: lineItemLoading }] =
    useGetDrugBillLineItemLazyQuery()

  useEffect(() => {
    if (data) {
      const firstItem = data.rightsPortalDrugPeriods[0] ?? null
      if (firstItem) setSelectedPeriod(firstItem)
    }
  }, [data])

  return (
    <MedicineWrapper pathname={HealthPaths.HealthMedicinePurchase}>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          isSubheading
          span={['8/8', '8/8', '8/8', '5/8', '5/8']}
          title={messages.medicinePurchaseTitle}
          intro={messages.medicinePurchaseIntroText}
        />
      </Box>
      {loading && (
        <Box marginBottom={CONTENT_GAP}>
          <SkeletonLoader
            repeat={4}
            borderRadius="standard"
            space={2}
            height={32}
          />
        </Box>
      )}
      {!!data?.rightsPortalDrugPeriods?.length && (
        <Box display="flex" flexDirection="column">
          <Box marginBottom={1}>
            <Text color="blue400" variant="eyebrow" as="h3">
              {formatMessage(messages.medicinePaymentPeriod)}
            </Text>
          </Box>
          <Box
            display="flex"
            marginBottom={CONTENT_GAP}
            justifyContent="flexStart"
          >
            <Select
              name="paymentPeroid"
              size="sm"
              options={data.rightsPortalDrugPeriods.map((period) => ({
                label: formatDatePeriod(period.dateFrom, period.dateTo),
                value: period.id,
              }))}
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
            <Text variant="eyebrow" color="purple600" marginBottom={1}>
              {formatMessage(messages.periodStatus)}
            </Text>
            <Stack dividers="blueberry200" space={0}>
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.period)}
                content={
                  formatDatePeriod(
                    selectedPeriod?.dateFrom,
                    selectedPeriod?.dateTo,
                  ) ?? ''
                }
              />
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicinePaymentStatus)}
                content={amountFormat(selectedPeriod?.paymentStatus ?? 0)}
              />
              <UserInfoLine
                paddingY={3}
                label={formatMessage(messages.medicineStep)}
                content={
                  formatMessage(messages.medicineStepStatus, {
                    step: selectedPeriod?.levelNumber,
                    ratio: selectedPeriod?.levelPercentage,
                  }) ?? ''
                }
              />
            </Stack>
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
        <Text marginBottom={CONTENT_GAP} variant="h5">
          {formatMessage(messages.medicineBills)}
        </Text>
        {billsLoading || loading ? (
          <SkeletonLoader repeat={3} borderRadius="large" space={1} />
        ) : (
          bills?.length && (
            <T.Table data-testid="invoices">
              <ExpandHeader
                data={[
                  { value: '' },
                  { value: formatMessage(m.date) },
                  { value: formatMessage(m.explanationNote) },
                  {
                    value: (
                      <Hyphen>
                        {formatMessage(
                          messages.medicinePaymentParticipationPrice,
                        )}
                      </Hyphen>
                    ),
                  },
                  { value: formatMessage(messages.medicinePaidByCustomer) },
                ]}
              />
              {bills.map((bill, i) => {
                return (
                  <T.Body key={i}>
                    <ExpandRow
                      expandWhenLoadingFinished={true}
                      loading={lineItemLoading && bill.id === selectedLineItem}
                      data={[
                        { value: formatDateFns(bill.date, DATE_FORMAT) },
                        { value: bill.description ?? '' },
                        {
                          value: amountFormat(bill.totalCopaymentAmount ?? 0),
                        },
                        {
                          value: amountFormat(bill.totalCustomerAmount ?? 0),
                        },
                      ]}
                      onExpandCallback={() => {
                        if (bill?.id && selectedPeriod?.id) {
                          setSelectedLineItem(bill.id)
                          lineItemQuery({
                            variables: {
                              input: {
                                billId: bill.id,
                                paymentPeriodId: selectedPeriod.id,
                              },
                            },
                            onCompleted: (data) => {
                              if (bill && bill.id) {
                                fetchedLineItems.set(
                                  bill.id,
                                  data.rightsPortalDrugBillLines,
                                )
                              }
                            },
                          })
                        }
                      }}
                    >
                      <Box
                        padding={CONTENT_GAP}
                        paddingBottom={SECTION_GAP}
                        background="blue100"
                      >
                        <Text variant="h5" marginBottom={1}>
                          {formatMessage(messages.medicineDrugLines)}
                        </Text>
                        <T.Table>
                          <T.Head>
                            <T.Row>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(messages.medicineDrugName)}
                                </span>
                              </T.HeadData>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(messages.medicineStrength)}
                                </span>
                              </T.HeadData>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(messages.medicineQuantity)}
                                </span>
                              </T.HeadData>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(messages.medicineAmount)}
                                </span>
                              </T.HeadData>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(messages.medicineSalePrice)}
                                </span>
                              </T.HeadData>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  <Hyphen>
                                    {formatMessage(
                                      messages.medicinePaymentParticipationPrice,
                                    )}
                                  </Hyphen>
                                </span>
                              </T.HeadData>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  <Hyphen>
                                    {formatMessage(
                                      messages.medicineExcessPrice,
                                    )}
                                  </Hyphen>
                                </span>
                              </T.HeadData>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(
                                    messages.medicinePaidByCustomer,
                                  )}
                                </span>
                              </T.HeadData>
                            </T.Row>
                          </T.Head>
                          <T.Body>
                            {[...fetchedLineItems].map((item, j) => {
                              const [billId, lineItems] = item

                              if (billId !== bill.id) return null
                              return lineItems.map((lineItem, k) => {
                                return (
                                  <T.Row key={`${i}-${j}-${k}`}>
                                    <T.Data>{lineItem.drugName}</T.Data>
                                    <T.Data>{lineItem.strength}</T.Data>
                                    <T.Data>{lineItem.quantity}</T.Data>
                                    <T.Data>{lineItem.units}</T.Data>
                                    <T.Data>
                                      {amountFormat(lineItem.salesPrice ?? 0)}
                                    </T.Data>
                                    <T.Data>
                                      {amountFormat(
                                        lineItem.copaymentAmount ?? 0,
                                      )}
                                    </T.Data>
                                    <T.Data>
                                      {amountFormat(lineItem.excessAmount ?? 0)}
                                    </T.Data>
                                    <T.Data>
                                      {amountFormat(
                                        lineItem.customerAmount ?? 0,
                                      )}
                                    </T.Data>
                                  </T.Row>
                                )
                              })
                            })}
                          </T.Body>
                          <T.Foot>
                            <T.Row>
                              <T.Data>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(m.total)}
                                </span>
                              </T.Data>
                              <T.Data></T.Data>
                              <T.Data></T.Data>
                              <T.Data></T.Data>
                              <T.Data></T.Data>
                              <T.Data>
                                <span className={styles.subTableHeaderText}>
                                  {amountFormat(bill.totalCopaymentAmount ?? 0)}
                                </span>
                              </T.Data>
                              <T.Data>
                                <span className={styles.subTableHeaderText}>
                                  {amountFormat(bill.totalExcessAmount ?? 0)}
                                </span>
                              </T.Data>
                              <T.Data>
                                <span className={styles.subTableHeaderText}>
                                  {amountFormat(bill.totalCustomerAmount ?? 0)}
                                </span>
                              </T.Data>
                            </T.Row>
                          </T.Foot>
                        </T.Table>
                      </Box>
                    </ExpandRow>
                  </T.Body>
                )
              })}
            </T.Table>
          )
        )}
      </Box>
    </MedicineWrapper>
  )
}

export default MedicinePurchase
