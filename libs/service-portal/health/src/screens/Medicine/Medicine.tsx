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
  TableGrid,
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
                      { value: 'Dagsetning' },
                      { value: 'Skýring' },
                      { value: 'Greiðsluþátttökuverð' },
                      { value: 'Greitt af einstakling' },
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
                            <Text variant="h5" marginBottom={1}>
                              Lyfjalínur
                            </Text>
                            <T.Table>
                              <T.Head>
                                <T.Row>
                                  <T.HeadData>
                                    <span className={styles.subTableHeaderText}>
                                      Lyfjaheiti
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData>
                                    <span className={styles.subTableHeaderText}>
                                      Styrkur
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData>
                                    <span className={styles.subTableHeaderText}>
                                      Magn
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData>
                                    <span className={styles.subTableHeaderText}>
                                      Fjöldi
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData>
                                    <span className={styles.subTableHeaderText}>
                                      Söluverð
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData>
                                    <span className={styles.subTableHeaderText}>
                                      Greiðlsuþátttökuverð
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData>
                                    <span className={styles.subTableHeaderText}>
                                      Umframverð
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData>
                                    <span className={styles.subTableHeaderText}>
                                      Greitt af einstakling
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
