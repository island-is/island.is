import {
  Box,
  Text,
  Select,
  Stack,
  Button,
  SkeletonLoader,
  Table as T,
  LinkV2,
} from '@island.is/island-ui/core'
import {
  ExpandHeader,
  ExpandRow,
  IntroHeader,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import {
  useGetDrugBillLineItemLazyQuery,
  useGetDrugsBillsLazyQuery,
  useGetDrugsDataQuery,
} from '../Medicine.generated'
import {
  RightsPortalDrugBillLine,
  RightsPortalDrugBill,
  RightsPortalDrugPeriod,
} from '@island.is/api/schema'
import { useEffect, useState } from 'react'
import * as styles from './Medicine.css'
import {
  CONTENT_GAP,
  DATE_FORMAT,
  MedicineTabs,
  SECTION_GAP,
} from '../constants'
import { useIntl } from 'react-intl'

type Props = {
  onTabChange: (id: MedicineTabs) => void
}

export const MedicinePurchase: React.FC<Props> = ({ onTabChange }) => {
  useNamespaces('sp.health')

  const { formatMessage, formatDateFns } = useLocale()
  const intl = useIntl()
  const [selectedPeriod, setSelectedPeriod] =
    useState<RightsPortalDrugPeriod | null>(null)
  const [selectedLineItem, setSelectedLineItem] = useState<string>('')
  const [fetchedLineItems, setFetchedLineItems] = useState<
    Map<string, RightsPortalDrugBillLine[]>
  >(new Map())
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
    <Box paddingY={4}>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          isSubheading
          span={['8/8']}
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
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: selectedPeriod?.paidAmount
                    ? intl.formatNumber(selectedPeriod?.paidAmount)
                    : selectedPeriod?.paidAmount,
                })}
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
        <Button variant="utility" icon="open" iconType="outline">
          <LinkV2 href="https://rg.sjukra.is/lyfjaverdskra" newTab>
            {formatMessage(messages.medicinePriceList)}
          </LinkV2>
        </Button>
        <Button
          variant="utility"
          onClick={() => onTabChange(MedicineTabs.CALCULATOR)}
          icon="calculator"
          iconType="outline"
        >
          {formatMessage(messages.medicineCalculatorTitle)}
        </Button>
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
                    value: formatMessage(
                      messages.medicinePaymentParticipationPrice,
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
                          value: formatMessage(
                            messages.medicinePaymentPaidAmount,
                            {
                              amount: bill.totalCopaymentAmount
                                ? intl.formatNumber(bill.totalCopaymentAmount)
                                : bill.totalCopaymentAmount,
                            },
                          ),
                        },
                        {
                          value: formatMessage(
                            messages.medicinePaymentPaidAmount,
                            {
                              amount: bill.totalCustomerAmount
                                ? intl.formatNumber(bill.totalCustomerAmount)
                                : bill.totalCustomerAmount,
                            },
                          ),
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
                                  {formatMessage(
                                    messages.medicinePaymentParticipationPrice,
                                  )}
                                </span>
                              </T.HeadData>
                              <T.HeadData>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(messages.medicineExcessPrice)}
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
                                      {formatMessage(
                                        messages.medicinePaymentPaidAmount,
                                        {
                                          amount: lineItem.salesPrice
                                            ? intl.formatNumber(
                                                lineItem.salesPrice,
                                              )
                                            : lineItem.salesPrice,
                                        },
                                      )}
                                    </T.Data>
                                    <T.Data>
                                      {formatMessage(
                                        messages.medicinePaymentPaidAmount,
                                        {
                                          amount: lineItem.copaymentAmount
                                            ? intl.formatNumber(
                                                lineItem.copaymentAmount,
                                              )
                                            : lineItem.copaymentAmount,
                                        },
                                      )}
                                    </T.Data>
                                    <T.Data>
                                      {formatMessage(
                                        messages.medicinePaymentPaidAmount,
                                        {
                                          amount: lineItem.excessAmount
                                            ? intl.formatNumber(
                                                lineItem.excessAmount,
                                              )
                                            : lineItem.excessAmount,
                                        },
                                      )}
                                    </T.Data>
                                    <T.Data>
                                      {formatMessage(
                                        messages.medicinePaymentPaidAmount,
                                        {
                                          amount: lineItem.customerAmount
                                            ? intl.formatNumber(
                                                lineItem.customerAmount,
                                              )
                                            : lineItem.customerAmount,
                                        },
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
                                  {formatMessage(
                                    messages.medicinePaymentPaidAmount,
                                    {
                                      amount: bill.totalCopaymentAmount
                                        ? intl.formatNumber(
                                            bill.totalCopaymentAmount,
                                          )
                                        : bill.totalCopaymentAmount,
                                    },
                                  )}
                                </span>
                              </T.Data>
                              <T.Data>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(
                                    messages.medicinePaymentPaidAmount,
                                    {
                                      amount: bill.totalExcessAmount
                                        ? intl.formatNumber(
                                            bill.totalExcessAmount,
                                          )
                                        : bill.totalExcessAmount,
                                    },
                                  )}
                                </span>
                              </T.Data>
                              <T.Data>
                                <span className={styles.subTableHeaderText}>
                                  {formatMessage(
                                    messages.medicinePaymentPaidAmount,
                                    {
                                      amount: bill.totalCustomerAmount
                                        ? intl.formatNumber(
                                            bill.totalCustomerAmount,
                                          )
                                        : bill.totalCustomerAmount,
                                    },
                                  )}
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
    </Box>
  )
}
