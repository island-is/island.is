import { useLocale, useNamespaces } from '@island.is/localization'
import {
  AlertMessage,
  Box,
  Button,
  LinkV2,
  Select,
  SkeletonLoader,
  Stack,
  Tabs,
  Text,
  Table as T,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import {
  useGetDrugBillLineItemLazyQuery,
  useGetDrugsBillsQuery,
  useGetDrugsDataQuery,
} from './Medicine.generated'
import {
  ExpandHeader,
  ExpandRow,
  TableBox,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useEffect, useState } from 'react'
import {
  RightsPortalDrugsPaymentPeroids,
  RightsPortalDrugBillLineItem,
} from '@island.is/api/schema'
import * as styles from './Medicine.css'
enum MedicineTabs {
  PURCHASE = 'lyfjakaup',
  CALCULATOR = 'reiknivel',
  LICENSE = 'skirteini',
}

const SECTION_GAP = 5
const CONTENT_GAP = 2

const DATE_FORMAT = 'dd.MM.yyyy'
const DATE_FORMAT_SHORT = 'd.M.yyyy'

const Medicine = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { formatDateFns } = useLocale()
  const [selectedTab, setSelectedTab] = useState<MedicineTabs>(
    MedicineTabs.PURCHASE,
  )
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

  const { data, loading, error } = useGetDrugsDataQuery()

  const {
    data: bills,
    loading: billsLoading,
    error: billsError,
  } = useGetDrugsBillsQuery({
    variables: {
      input: {
        paymentPeriodId: selectedPeriod?.id ?? '',
      },
    },
  })

  const [lineItemQuery, { loading: lineItemLoading }] =
    useGetDrugBillLineItemLazyQuery()

  useEffect(() => {
    if (data) {
      const firstItem = data?.rightsPortalDrugsPaymentPeroids[0]
      if (firstItem) setSelectedPeriod(firstItem)
    }
  }, [data])

  if (loading) {
    return (
      <SkeletonLoader repeat={3} borderRadius="large" space={1} height={24} />
    )
  }

  if (error) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(m.errorTitle)}
        message={formatMessage(m.errorFetch)}
      />
    )
  }

  const tabs = [
    {
      id: MedicineTabs.PURCHASE,
      label: formatMessage(messages.medicinePurchaseTitle),
      content: (
        <Box paddingY={4}>
          <Box marginBottom={SECTION_GAP}>
            <Text marginBottom={CONTENT_GAP} variant="h5">
              {formatMessage(messages.medicinePurchaseIntroTitle)}
            </Text>
            <Text>{formatMessage(messages.medicinePurchaseIntroText)}</Text>
          </Box>
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
                  options={data.rightsPortalDrugsPaymentPeroids.map(
                    (period) => ({
                      label: formatDatePeriod(period.dateFrom, period.dateTo),
                      value: period.id,
                    }),
                  )}
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
              <LinkV2 href="#">
                {formatMessage(messages.medicinePriceList)}
              </LinkV2>
            </Button>
            <Button
              variant="utility"
              onClick={() => setSelectedTab(MedicineTabs.CALCULATOR)} // Does not update the Tabs component internal state (useTabState).. needs further investigation
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
            {billsLoading ? (
              <SkeletonLoader repeat={3} borderRadius="large" space={1} />
            ) : (
              bills?.rightsPortalDrugsBills.length && (
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
                  {bills.rightsPortalDrugsBills.map((bill, i) => {
                    return (
                      <T.Body key={i}>
                        <ExpandRow
                          expandWhenLoadingFinished={true}
                          loading={
                            lineItemLoading && bill.id === selectedLineItem
                          }
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
                            <Box marginBottom={CONTENT_GAP}>
                              {/* These fields do not match the data coming from the API needs further investigation from designers */}
                              <TableBox
                                data={[
                                  {
                                    title: formatMessage(
                                      messages.medicineBillDate,
                                    ),
                                    value: formatDateFns(
                                      bill.date,
                                      DATE_FORMAT_SHORT,
                                    ),
                                  },
                                  {
                                    title: formatMessage(
                                      messages.medicineQuantity,
                                    ),
                                    value: '1',
                                  },
                                  {
                                    title: formatMessage(
                                      messages.medicinePaidByCustomer,
                                    ),
                                    value: '3.100 kr.',
                                  },
                                  {
                                    title: formatMessage(
                                      messages.medicineStrength,
                                    ),
                                    value: '50 mg.',
                                  },
                                  {
                                    title: formatMessage(
                                      messages.medicineSalePrice,
                                    ),
                                    value: '3.100 kr.',
                                  },
                                  {
                                    title: formatMessage(
                                      messages.medicinePaidByInsurance,
                                    ),
                                    value: '500 kr.',
                                  },
                                  {
                                    title: formatMessage(
                                      messages.medicineAmount,
                                    ),
                                    value: '1',
                                  },
                                  {
                                    title: formatMessage(
                                      messages.medicinePaymentParticipationPrice,
                                    ),
                                    value: '500 kr.',
                                  },
                                ]}
                              />
                            </Box>
                            <Box>
                              <Text variant="h5" marginBottom={1}>
                                Lyfjalínur
                              </Text>
                              <T.Table>
                                <T.Head>
                                  <T.Row>
                                    <T.HeadData>
                                      <span
                                        className={styles.subTableHeaderText}
                                      >
                                        {formatMessage(
                                          messages.medicineDrugName,
                                        )}
                                      </span>
                                    </T.HeadData>
                                    <T.HeadData>
                                      <span
                                        className={styles.subTableHeaderText}
                                      >
                                        {formatMessage(
                                          messages.medicineStrength,
                                        )}
                                      </span>
                                    </T.HeadData>
                                    <T.HeadData>
                                      <span
                                        className={styles.subTableHeaderText}
                                      >
                                        {formatMessage(
                                          messages.medicineQuantity,
                                        )}
                                      </span>
                                    </T.HeadData>
                                    <T.HeadData>
                                      <span
                                        className={styles.subTableHeaderText}
                                      >
                                        {formatMessage(messages.medicineAmount)}
                                      </span>
                                    </T.HeadData>
                                    <T.HeadData>
                                      <span
                                        className={styles.subTableHeaderText}
                                      >
                                        {formatMessage(
                                          messages.medicineSalePrice,
                                        )}
                                      </span>
                                    </T.HeadData>
                                    <T.HeadData>
                                      <span
                                        className={styles.subTableHeaderText}
                                      >
                                        {formatMessage(
                                          messages.medicinePaymentParticipationPrice,
                                        )}
                                      </span>
                                    </T.HeadData>
                                    <T.HeadData>
                                      <span
                                        className={styles.subTableHeaderText}
                                      >
                                        {formatMessage(
                                          messages.medicineExcessPrice,
                                        )}
                                      </span>
                                    </T.HeadData>
                                    <T.HeadData>
                                      <span
                                        className={styles.subTableHeaderText}
                                      >
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
                                          <T.Data>{lineItem.amount}</T.Data>
                                          <T.Data>{lineItem.number}</T.Data>
                                          <T.Data>{lineItem.salesPrice}</T.Data>
                                          <T.Data>
                                            {lineItem.copaymentAmount}
                                          </T.Data>
                                          <T.Data>
                                            {lineItem.insuranceAmount}
                                          </T.Data>
                                          <T.Data>
                                            {lineItem.customerAmount}
                                          </T.Data>
                                        </T.Row>
                                      )
                                    })
                                  })}
                                </T.Body>
                              </T.Table>
                            </Box>
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
      ),
    },
    {
      id: MedicineTabs.CALCULATOR,
      label: formatMessage(messages.medicineCalculatorTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={CONTENT_GAP} variant="h5">
            {formatMessage(messages.medicineCalculatorIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicineCalculatorIntroText)}</Text>
        </Box>
      ),
    },
    {
      id: MedicineTabs.LICENSE,
      label: formatMessage(messages.medicineLicenseTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={CONTENT_GAP} variant="h5">
            {formatMessage(messages.medicineLicenseIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicineLicenseIntroText)}</Text>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      <IntroHeader
        title={formatMessage(messages.medicineTitle)}
        intro={formatMessage(messages.medicineTitleIntro)}
      />
      <Tabs
        label={formatMessage(messages.chooseTherapy)}
        tabs={tabs}
        contentBackground="transparent"
        selected={selectedTab}
        size="xs"
        onChange={(id) => setSelectedTab(id as MedicineTabs)}
      />
    </Box>
  )
}

export default Medicine
