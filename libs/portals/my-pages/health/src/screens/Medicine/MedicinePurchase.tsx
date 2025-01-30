import {
  RightsPortalDrugBill,
  RightsPortalDrugBillLine,
  RightsPortalDrugPeriod,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  Hidden,
  Hyphen,
  LinkV2,
  LoadingDots,
  Select,
  SkeletonLoader,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  amountFormat,
  DownloadFileButtons,
  ExpandHeader,
  ExpandRow,
  LinkResolver,
  m,
  StackWithBottomDivider,
  MobileTable,
  NestedLines,
  UserInfoLine,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { CONTENT_GAP, DATE_FORMAT, SECTION_GAP } from '../../utils/constants'
import {
  exportMedicineBill,
  exportMedicineFile,
} from '../../utils/FileBreakdown'
import * as styles from './Medicine.css'
import {
  useGetDrugBillLineItemLazyQuery,
  useGetDrugsBillsLazyQuery,
  useGetDrugsDataQuery,
} from './Medicine.generated'
import { MedicinePaymentParticipationWrapper } from './wrapper/MedicinePaymentParticipationWrapper'

export const MedicinePurchase = () => {
  useNamespaces('sp.health')

  const { formatMessage, formatDateFns } = useLocale()
  const [selectedPeriod, setSelectedPeriod] =
    useState<RightsPortalDrugPeriod | null>(null)
  const [selectedLineItem, setSelectedLineItem] = useState<string>('')
  const [fetchedLineItems] = useState(
    new Map<string, RightsPortalDrugBillLine[]>(),
  )
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

  const [lineItemQuery, { loading: lineItemLoading }] =
    useGetDrugBillLineItemLazyQuery()

  useEffect(() => {
    if (data) {
      const firstItem = data.rightsPortalDrugPeriods[0] ?? null
      if (firstItem) setSelectedPeriod(firstItem)
    }
  }, [data])

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
              <Hidden below="md">
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
                          loading={
                            lineItemLoading && bill.id === selectedLineItem
                          }
                          data={[
                            { value: formatDateFns(bill.date, DATE_FORMAT) },
                            { value: bill.description ?? '' },
                            {
                              value: amountFormat(
                                bill.totalCopaymentAmount ?? 0,
                              ),
                            },
                            {
                              value: amountFormat(
                                bill.totalCustomerAmount ?? 0,
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
                                  <T.HeadData text={{ lineHeight: 'xs' }}>
                                    <span className={styles.subTableHeaderText}>
                                      {formatMessage(messages.medicineDrugName)}
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData text={{ lineHeight: 'xs' }}>
                                    <span className={styles.subTableHeaderText}>
                                      {formatMessage(messages.medicineStrength)}
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData text={{ lineHeight: 'xs' }}>
                                    <span className={styles.subTableHeaderText}>
                                      {formatMessage(messages.medicineQuantity)}
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData text={{ lineHeight: 'xs' }}>
                                    <span className={styles.subTableHeaderText}>
                                      {formatMessage(messages.medicineAmount)}
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData text={{ lineHeight: 'xs' }}>
                                    <span className={styles.subTableHeaderText}>
                                      {formatMessage(
                                        messages.medicineSalePrice,
                                      )}
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData text={{ lineHeight: 'xs' }}>
                                    <span className={styles.subTableHeaderText}>
                                      <Hyphen>
                                        {formatMessage(
                                          messages.medicinePaymentParticipationPrice,
                                        )}
                                      </Hyphen>
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData text={{ lineHeight: 'xs' }}>
                                    <span className={styles.subTableHeaderText}>
                                      <Hyphen>
                                        {formatMessage(
                                          messages.medicineExcessPrice,
                                        )}
                                      </Hyphen>
                                    </span>
                                  </T.HeadData>
                                  <T.HeadData text={{ lineHeight: 'xs' }}>
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
                                          {amountFormat(
                                            lineItem.salesPrice ?? 0,
                                          )}
                                        </T.Data>
                                        <T.Data>
                                          {amountFormat(
                                            lineItem.copaymentAmount ?? 0,
                                          )}
                                        </T.Data>
                                        <T.Data>
                                          {amountFormat(
                                            lineItem.excessAmount ?? 0,
                                          )}
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
                                      {amountFormat(
                                        bill.totalCopaymentAmount ?? 0,
                                      )}
                                    </span>
                                  </T.Data>
                                  <T.Data>
                                    <span className={styles.subTableHeaderText}>
                                      {amountFormat(
                                        bill.totalExcessAmount ?? 0,
                                      )}
                                    </span>
                                  </T.Data>
                                  <T.Data>
                                    <span className={styles.subTableHeaderText}>
                                      {amountFormat(
                                        bill.totalCustomerAmount ?? 0,
                                      )}
                                    </span>
                                  </T.Data>
                                </T.Row>
                              </T.Foot>
                            </T.Table>

                            <DownloadFileButtons
                              BoxProps={{
                                paddingX: 2,
                                paddingTop: 2,
                                background: 'blue100',
                              }}
                              buttons={[
                                {
                                  text: formatMessage(m.getAsExcel),
                                  onClick: () =>
                                    exportMedicineFile(
                                      [
                                        formatDateFns(bill.date, DATE_FORMAT),
                                        bill.description ?? '',
                                        amountFormat(
                                          bill.totalCopaymentAmount ?? 0,
                                        ),
                                        amountFormat(
                                          bill.totalCustomerAmount ?? 0,
                                        ),
                                      ],
                                      [...fetchedLineItems].filter(
                                        (lItem) => lItem[0] === bill.id,
                                      )?.[0]?.[1] ?? [],
                                      {
                                        part: amountFormat(
                                          bill.totalCopaymentAmount ?? 0,
                                        ),
                                        excess: amountFormat(
                                          bill.totalExcessAmount ?? 0,
                                        ),
                                        customer: amountFormat(
                                          bill.totalCustomerAmount ?? 0,
                                        ),
                                      },
                                      'xlsx',
                                    ),
                                },
                              ]}
                            />
                          </Box>
                        </ExpandRow>
                      </T.Body>
                    )
                  })}
                </T.Table>
              </Hidden>
              <Hidden above="sm">
                <MobileTable
                  rows={bills.map((bill) => ({
                    title: bill.description ?? '',
                    data: [
                      {
                        title: formatMessage(m.date),
                        content: formatDateFns(bill.date, DATE_FORMAT),
                      },
                      {
                        title: formatMessage(
                          messages.medicinePaymentParticipationPrice,
                        ),
                        content: amountFormat(bill.totalCopaymentAmount ?? 0),
                      },
                      {
                        title: formatMessage(messages.medicinePaidByCustomer),
                        content: amountFormat(bill.totalCustomerAmount ?? 0),
                      },
                    ],
                    onExpandCallback: () => {
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
                    },
                    children: lineItemLoading ? (
                      <LoadingDots />
                    ) : bill.id ? (
                      fetchedLineItems
                        .get(bill.id)
                        ?.map((lineItem, lineIndex) => {
                          return (
                            <NestedLines
                              key={`${bill.id}-${lineIndex}`}
                              data={[
                                {
                                  title: formatMessage(
                                    messages.medicineDrugName,
                                  ),
                                  value: lineItem.drugName ?? '',
                                },
                                {
                                  title: formatMessage(
                                    messages.medicineStrength,
                                  ),
                                  value: lineItem.strength ?? '',
                                },
                                {
                                  title: formatMessage(
                                    messages.medicineQuantity,
                                  ),
                                  value: lineItem.quantity ?? '',
                                },
                                {
                                  title: formatMessage(messages.medicineAmount),
                                  value: lineItem.units ?? '',
                                },
                                {
                                  title: formatMessage(
                                    messages.medicineSalePrice,
                                  ),
                                  value: amountFormat(lineItem.salesPrice ?? 0),
                                },
                                {
                                  title: formatMessage(
                                    messages.medicinePaymentParticipationPrice,
                                  ),
                                  value: amountFormat(
                                    lineItem.copaymentAmount ?? 0,
                                  ),
                                },
                                {
                                  title: formatMessage(
                                    messages.medicineExcessPrice,
                                  ),
                                  value: amountFormat(
                                    lineItem.excessAmount ?? 0,
                                  ),
                                },
                                {
                                  title: formatMessage(
                                    messages.medicinePaidByCustomer,
                                  ),
                                  value: amountFormat(
                                    lineItem.customerAmount ?? 0,
                                  ),
                                },
                              ]}
                            />
                          )
                        })
                    ) : null,
                  }))}
                />
              </Hidden>
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
