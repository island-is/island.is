import { useEffect, useMemo, useState } from 'react'
import { useWindowSize } from 'react-use'
import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  MobileTable,
  amountFormat,
  m,
  downloadLink,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { CONTENT_GAP, SECTION_GAP } from '../../utils/constants'
import {
  getFirstDayOfPreviousYear,
  getLastDayOfPreviousYear,
} from '../../utils/dates'
import {
  GetPaymentOverviewTotalsQuery,
  useGetPaymentOverviewTotalsLazyQuery,
  useGetPaymentOverviewTotalsServiceTypesQuery,
  useGetPaymentOverviewTotalsPdfLazyQuery,
} from './Payments.generated'
import * as styles from './Payments.css'
import { PaymentsWrapper } from './wrapper/PaymentsWrapper'

export const PaymentOverviewTotals = () => {
  const { formatMessage, lang } = useLocale()
  const { width } = useWindowSize()

  const [startDate, setStartDate] = useState<Date>(getFirstDayOfPreviousYear)
  const [endDate, setEndDate] = useState<Date>(getLastDayOfPreviousYear)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

  type TotalsItem = NonNullable<
    GetPaymentOverviewTotalsQuery['rightsPortalPaymentOverviewTotals']
  >['items'][number]
  const [totalsItem, setTotalsItem] = useState<TotalsItem | undefined>(
    undefined,
  )

  const isMobile = width < theme.breakpoints.md

  const {
    data: serviceTypes,
    loading: serviceTypesLoading,
    error: serviceTypesError,
  } = useGetPaymentOverviewTotalsServiceTypesQuery()

  const [
    lazyTotalsQuery,
    { loading: totalsLoading, error: totalsError },
  ] = useGetPaymentOverviewTotalsLazyQuery({
    onCompleted(data) {
      const item = data.rightsPortalPaymentOverviewTotals.items[0]
      setTotalsItem(item)
    },
  })

  const [fetchTotalsPdf] = useGetPaymentOverviewTotalsPdfLazyQuery()

  const services =
    serviceTypes?.rightsPortalPaymentOverviewTotalsServiceTypes.items

  const serviceTypeNameByCode = useMemo(
    () =>
      services?.reduce<Record<string, string>>((acc, curr) => {
        if (curr.code && curr.name) {
          acc[curr.code] = curr.name
        }
        return acc
      }, {}) ?? {},
    [services],
  )

  const options = services
    ?.map((s) =>
      s.name && s.code
        ? {
            label: s.name,
            value: s.code,
          }
        : undefined,
    )
    .filter(isDefined)

  const onFetchTotals = () => {
    lazyTotalsQuery({
      variables: {
        input: {
          dateFrom: startDate,
          dateTo: endDate,
          serviceTypeCode: selectedOptionId ?? '',
        },
      },
    })
  }

  useEffect(() => {
    onFetchTotals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDownloadTotalsPdf = async () => {
    const { data } = await fetchTotalsPdf({
      variables: {
        input: {
          dateFrom: startDate,
          dateTo: endDate,
          serviceTypeCode: selectedOptionId ?? '',
        },
      },
    })

    const document =
      data?.rightsPortalPaymentOverviewTotalsPdf.items[0] ?? undefined

    if (document?.data && document?.fileName && document?.contentType) {
      downloadLink(document.data, document.contentType, document.fileName)
    }
  }

  const rows = useMemo(
    () =>
      totalsItem?.items?.map((item) => ({
        serviceTypeCode: item.serviceTypeCode ?? '',
        serviceTypeName:
          (item.serviceTypeCode &&
            serviceTypeNameByCode[item.serviceTypeCode]) ??
          item.serviceTypeCode ??
          '',
        fullCost: item.fullCost ?? 0,
        copayCost: item.copayCost ?? 0,
        patientCost: item.patientCost ?? 0,
      })) ?? [],
    [totalsItem, serviceTypeNameByCode],
  )

  const hasError = serviceTypesError || totalsError
  const loading = serviceTypesLoading || totalsLoading

  return (
    <PaymentsWrapper pathname={HealthPaths.HealthPaymentOverviewTotals}>
      {hasError ? (
        <Problem noBorder={false} error={hasError} />
      ) : loading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : (
        <Box>
          <Stack space={[CONTENT_GAP, SECTION_GAP]}>
            <Text variant="small">
              {formatMessage(messages.paymentOverviewTotalsIntro)}
            </Text>
            <GridContainer>
              <GridRow rowGap={[2, 2, 2, 2, 'smallGutter']}>
                <GridColumn span={['1/1', '1/1', '1/2', '1/2', '3/9']}>
                  <DatePicker
                    size="xs"
                    label={formatMessage(m.dateFrom)}
                    placeholderText={formatMessage(m.chooseDate)}
                    handleChange={(date) => setStartDate(date)}
                    backgroundColor="blue"
                    selected={startDate}
                    locale={lang}
                  />
                </GridColumn>
                <GridColumn
                  span={['1/1', '1/1', '1/2', '1/2', '3/9']}
                  paddingTop={[2, 2, 0, 0, 0]}
                >
                  <DatePicker
                    size="xs"
                    label={formatMessage(m.dateTo)}
                    placeholderText={formatMessage(m.chooseDate)}
                    handleChange={(date) => setEndDate(date)}
                    backgroundColor="blue"
                    selected={endDate}
                    locale={lang}
                  />
                </GridColumn>
                {!!options?.length && (
                  <GridColumn
                    span={['1/1', '1/1', '1/1', '1/1', '3/9']}
                    paddingTop={[2, 2, 0, 0, 0]}
                  >
                    <Select
                      value={
                        selectedOptionId
                          ? options?.find(
                              (opt) => opt.value === selectedOptionId,
                            )
                          : options[0]
                      }
                      label={formatMessage(messages.typeofService)}
                      size="xs"
                      name="service"
                      options={options}
                      backgroundColor="blue"
                      onChange={(opt) =>
                        setSelectedOptionId(opt?.value ?? null)
                      }
                    />
                  </GridColumn>
                )}
              </GridRow>
              <GridRow marginTop={3} align="spaceBetween">
                <GridColumn span={['1/2', '1/2', '1/2', '1/2', '2/9']}>
                  <Button size="medium" onClick={() => onFetchTotals()} fluid>
                    {formatMessage(m.get)}
                  </Button>
                </GridColumn>
                <GridColumn span={['1/2', '1/2', '1/2', '1/2', '3/9']}>
                  <Box
                    width="full"
                    height="full"
                    display="flex"
                    // alignItems="stretch"
                    justifyContent="flexEnd"
                  >
                    <Button
                      variant="utility"
                      size="medium"
                      icon="download"
                      iconType="outline"
                      onClick={() => onDownloadTotalsPdf()}
                      fluid
                    >
                      {formatMessage(messages.paymentOverviewTotalsDownload)}
                    </Button>
                  </Box>
                </GridColumn>
              </GridRow>
            </GridContainer>

            <Box>
              {!rows.length ? (
                <Box marginTop={2}>
                  <Problem
                    type="no_data"
                    title={formatMessage(messages.searchResultsEmpty)}
                    message={formatMessage(messages.searchResultsEmptyDetail)}
                    titleSize="h3"
                    noBorder={false}
                    tag={undefined}
                  />
                </Box>
              ) : !isMobile ? (
                <T.Table>
                  <T.Head>
                    <tr className={styles.tableRowStyle}>
                      <T.HeadData>
                        {formatMessage(messages.typeofService)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.totalPayment)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.medicinePaidByInsuranceShort)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.yourPayment)}
                      </T.HeadData>
                    </tr>
                  </T.Head>
                  <T.Body>
                    {rows.map((item, index) => (
                      <tr key={index} className={styles.tableRowStyle}>
                        <T.Data>{item.serviceTypeName}</T.Data>
                        <T.Data>{amountFormat(item.fullCost)}</T.Data>
                        <T.Data>{amountFormat(item.copayCost)}</T.Data>
                        <T.Data>{amountFormat(item.patientCost)}</T.Data>
                      </tr>
                    ))}
                  </T.Body>
                </T.Table>
              ) : (
                <Box>
                  <MobileTable
                    rows={rows.map((item) => ({
                      title: item.serviceTypeName,
                      data: [
                        {
                          title: formatMessage(messages.typeofService),
                          content: item.serviceTypeName,
                        },
                        {
                          title: formatMessage(messages.totalPayment),
                          content: amountFormat(item.fullCost),
                        },
                        {
                          title: formatMessage(messages.insuranceShare),
                          content: amountFormat(item.copayCost),
                        },
                        {
                          title: formatMessage(messages.debit),
                          content: amountFormat(item.patientCost),
                        },
                      ],
                    }))}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      )}
    </PaymentsWrapper>
  )
}

export default PaymentOverviewTotals
