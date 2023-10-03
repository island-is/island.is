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
  useGetDrugsBillsQuery,
  useGetDrugsDataQuery,
} from '../Medicine.generated'
import {
  RightsPortalDrugBillLineItem,
  RightsPortalDrugsBills,
  RightsPortalDrugsPaymentPeroids,
} from '@island.is/api/schema'
import { useEffect, useState } from 'react'
import * as styles from './Medicine.css'
import {
  CONTENT_GAP,
  DATE_FORMAT,
  MedicineTabs,
  SECTION_GAP,
} from '../constants'
type Props = {
  onTabChange: (id: MedicineTabs) => void
}

export const MedicinePurchase: React.FC<Props> = ({ onTabChange }) => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { formatDateFns } = useLocale()

  const [selectedPeriod, setSelectedPeriod] =
    useState<RightsPortalDrugsPaymentPeroids | null>(null)
  const [selectedLineItem, setSelectedLineItem] = useState<string>('')
  const [fetchedLineItems, setFetchedLineItems] = useState<
    Map<string, RightsPortalDrugBillLineItem[]>
  >(new Map())
  const formatDatePeriod = (dateFrom: Date, dateTo: Date) => {
    if (!dateFrom || !dateTo) return ''
    return `${formatDateFns(dateFrom, DATE_FORMAT)} - ${formatDateFns(
      dateTo,
      DATE_FORMAT,
    )}`
  }

  const [bills, setBills] = useState<RightsPortalDrugsBills[] | null>(null)
  const [billsLoading, setBillsLoading] = useState<boolean>(false)

  const { data, loading, error } = useGetDrugsDataQuery()

  const [getPaymenetPeriodsQuery] = useGetDrugsBillsLazyQuery()

  useEffect(() => {
    if (selectedPeriod) {
      setBillsLoading(true)
      getPaymenetPeriodsQuery({
        variables: {
          input: {
            paymentPeriodId: selectedPeriod?.id ?? '',
          },
        },
        onCompleted: (data) => {
          setBills(data.rightsPortalDrugsBills)
          setBillsLoading(false)
        },
        onError: () => {
          setBillsLoading(false)
        },
      })
    }
  }, [selectedPeriod])

  const [lineItemQuery, { loading: lineItemLoading }] =
    useGetDrugBillLineItemLazyQuery()

  useEffect(() => {
    if (data) {
      const firstItem = data?.rightsPortalDrugsPaymentPeroids[0]
      if (firstItem) setSelectedPeriod(firstItem)
    }
  }, [data])

  return (
    <Box paddingY={4}>
      <Box marginBottom={SECTION_GAP}>
        {/* <Text marginBottom={CONTENT_GAP} variant="h5">
          {formatMessage(messages.medicinePurchaseIntroTitle)}
        </Text>
        <Text>{formatMessage(messages.medicinePurchaseIntroText)}</Text> */}
        <IntroHeader
          isSubheading
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
      {data?.rightsPortalDrugsPaymentPeroids?.length && (
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
              options={data.rightsPortalDrugsPaymentPeroids.map((period) => ({
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
                  data.rightsPortalDrugsPaymentPeroids.find(
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
                  amount: selectedPeriod?.paidAmount,
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
          <LinkV2 href="#">{formatMessage(messages.medicinePriceList)}</LinkV2>
        </Button>
        <Button
          variant="utility"
          onClick={() => onTabChange(MedicineTabs.CALCULATOR)} // Does not update the Tabs component internal state (useTabState).. needs further investigation
          icon="print"
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
            <T.Table>
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
                        { value: bill.copaymentAmount ?? '' },
                        { value: bill.customerAmount ?? '' },
                      ]}
                      onExpandCallback={() => {
                        setSelectedLineItem(bill.id ?? '')
                        lineItemQuery({
                          variables: {
                            input: {
                              billId: bill.id,
                              paymentPeriodId: selectedPeriod?.id ?? '',
                            },
                          },
                          onCompleted: (data) =>
                            fetchedLineItems.set(
                              bill.id ?? '',
                              data.rightsPortalDrugBillLineItems,
                            ),
                        })
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
                                console.log(lineItem)
                                return (
                                  <T.Row key={`${i}-${j}-${k}`}>
                                    <T.Data>{lineItem.drugName}</T.Data>
                                    <T.Data>{lineItem.strength}</T.Data>
                                    <T.Data>{lineItem.amount}</T.Data>
                                    <T.Data>{lineItem.number}</T.Data>
                                    <T.Data>{lineItem.salesPrice}</T.Data>
                                    <T.Data>{lineItem.copaymentAmount}</T.Data>
                                    <T.Data>{lineItem.excessAmount}</T.Data>
                                    <T.Data>{lineItem.customerAmount}</T.Data>
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
                                  {bill.copaymentAmount}
                                </span>
                              </T.Data>
                              <T.Data>
                                <span className={styles.subTableHeaderText}>
                                  {bill.insuranceAmount}
                                </span>
                              </T.Data>
                              <T.Data>
                                <span className={styles.subTableHeaderText}>
                                  {bill.customerAmount}
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
