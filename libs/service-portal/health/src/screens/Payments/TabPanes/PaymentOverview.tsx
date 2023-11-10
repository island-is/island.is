import {
  AlertMessage,
  Box,
  DatePicker,
  SkeletonLoader,
  Stack,
  Text,
  Table as T,
  Button,
  Select,
} from '@island.is/island-ui/core'
import { UserInfoLine, formSubmit, m } from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { SECTION_GAP } from '../../Medicine/constants'
import * as styles from './Payments.css'
import {
  useGetPaymentOverviewLazyQuery,
  useGetPaymentOverviewServiceTypesQuery,
} from '../Payments.generated'
import { useIntl } from 'react-intl'
import sub from 'date-fns/sub'
import { isDefined } from '@island.is/shared/utils'
import {
  RightsPortalPaymentOverview,
  RightsPortalPaymentOverviewDocument,
} from '@island.is/api/schema'

export const PaymentOverview = () => {
  const intl = useIntl()
  const { formatMessage, formatDateFns } = useLocale()

  const [startDate, setStartDate] = useState<Date>(
    sub(new Date(), { years: 3 }),
  )
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

  const [overview, setOverview] = useState<RightsPortalPaymentOverview>()

  const [document, setDocument] =
    useState<RightsPortalPaymentOverviewDocument>()

  const {
    data: serviceTypes,
    loading,
    error,
  } = useGetPaymentOverviewServiceTypesQuery()

  const [
    lazyOverviewQuery,
    { loading: overviewLoading, error: overviewError },
  ] = useGetPaymentOverviewLazyQuery({
    onCompleted(data) {
      const item = data.rightsPortalPaymentOverview.items[0]
      setOverview(item)
    },
  })

  const services = serviceTypes?.rightsPortalPaymentOverviewServiceTypes.items

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

  const onFetchBills = () => {
    lazyOverviewQuery({
      variables: {
        input: {
          dateFrom: formatDateFns(startDate, 'MM.dd.yyyy'),
          dateTo: formatDateFns(endDate, 'MM.dd.yyyy'),
          serviceTypeCode: selectedOptionId ?? '',
        },
      },
    })
  }

  const onFetchDocument = (url: string) => {
    formSubmit(url)
  }

  useEffect(() => {
    onFetchBills()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box paddingY={4} background="white">
      {error ? (
        <AlertMessage
          type="error"
          title={formatMessage(m.errorTitle)}
          message={formatMessage(messages.errorFetchPaymentInfo)}
        />
      ) : loading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : (
        <Box>
          <Box
            marginBottom={SECTION_GAP}
            borderBottomWidth="standard"
            borderColor="blueberry200"
          >
            <Stack dividers="blueberry200" space={1}>
              <UserInfoLine
                title={formatMessage(messages.statusOfRights)}
                titlePadding={2}
                label={formatMessage(messages.credit)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: overview?.credit
                    ? intl.formatNumber(overview.credit)
                    : overview?.credit,
                })}
              />
              <UserInfoLine
                label={formatMessage(messages.debit)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: overview?.debt
                    ? intl.formatNumber(overview.debt)
                    : overview?.debt,
                })}
              />
            </Stack>
          </Box>

          <Box>
            <Text marginBottom={2} variant="h5">
              {formatMessage(messages.invoices)}
            </Text>
            <Box
              marginBottom={SECTION_GAP}
              display="flex"
              flexDirection="column"
              rowGap={2}
            >
              <Box display="flex" columnGap={2}>
                <DatePicker
                  size="xs"
                  label={formatMessage(m.dateFrom)}
                  placeholderText={formatMessage(m.chooseDate)}
                  handleChange={(date) => setStartDate(date)}
                  selected={startDate}
                />
                <DatePicker
                  size="xs"
                  label={formatMessage(m.dateTo)}
                  placeholderText={formatMessage(m.chooseDate)}
                  handleChange={(date) => setEndDate(date)}
                  selected={endDate}
                />
              </Box>
              {!!options?.length && (
                <Box display="flex" alignItems="center" columnGap={2}>
                  <Select
                    value={
                      selectedOptionId
                        ? options?.find((opt) => opt.value === selectedOptionId)
                        : options[0]
                    }
                    size="sm"
                    name="service"
                    options={options}
                    onChange={(opt) => setSelectedOptionId(opt?.value ?? null)}
                  />
                  <Button size="medium" onClick={() => onFetchBills()}>
                    Sækja
                  </Button>
                </Box>
              )}
            </Box>
            <Box marginBottom={SECTION_GAP}>
              {overviewError ? (
                <AlertMessage
                  type="error"
                  title={formatMessage(m.errorTitle)}
                  message={formatMessage(messages.errorFetchPaymentInfo)}
                />
              ) : overviewLoading ? (
                <SkeletonLoader space={2} repeat={3} height={24} />
              ) : overview?.bills?.length ? (
                <T.Table>
                  <T.Head>
                    <tr className={styles.tableRowStyle}>
                      <T.HeadData>{formatMessage(m.date)}</T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.typeofService)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.totalPayment)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.insuranceShare)}
                      </T.HeadData>
                      <T.HeadData>
                        {formatMessage(messages.paymentDocument)}
                      </T.HeadData>
                    </tr>
                  </T.Head>
                  <T.Body>
                    {overview?.bills?.map((item, index) => {
                      return (
                        <tr key={index} className={styles.tableRowStyle}>
                          <T.Data>
                            {item.date &&
                              formatDateFns(item.date, 'dd.MM.yyyy')}
                          </T.Data>
                          <T.Data>{item.serviceType?.name}</T.Data>
                          <T.Data>{item.totalAmount}</T.Data>
                          <T.Data>{item.insuranceAmount}</T.Data>
                          <T.Data>
                            <Button
                              iconType="outline"
                              onClick={() =>
                                item.downloadUrl
                                  ? onFetchDocument(item?.downloadUrl)
                                  : undefined
                              }
                              variant="text"
                              icon="open"
                              size="small"
                            >
                              {formatMessage(messages.fetchDocument)}
                            </Button>
                          </T.Data>
                        </tr>
                      )
                    })}
                  </T.Body>
                </T.Table>
              ) : (
                <AlertMessage
                  type="warning"
                  title={formatMessage(m.noData)}
                  message={formatMessage(m.noDataFound)}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default PaymentOverview
