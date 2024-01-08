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
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  DownloadFileButtons,
  UserInfoLine,
  amountFormat,
  formSubmit,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { CONTENT_GAP, SECTION_GAP } from '../Medicine/constants'
import * as styles from './Payments.css'
import {
  useGetPaymentOverviewLazyQuery,
  useGetPaymentOverviewServiceTypesQuery,
} from './Payments.generated'
import sub from 'date-fns/sub'
import { isDefined } from '@island.is/shared/utils'
import { RightsPortalPaymentOverview } from '@island.is/api/schema'
import { PaymentsWrapper } from './wrapper/PaymentsWrapper'
import { HealthPaths } from '../../lib/paths'
import { exportPaymentOverviewFile } from '../../utils/FileBreakdown'
import { Problem } from '@island.is/react-spa/shared'

export const PaymentOverview = () => {
  const { formatMessage, formatDateFns } = useLocale()

  const [startDate, setStartDate] = useState<Date>(
    sub(new Date(), { years: 3 }),
  )
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

  const [overview, setOverview] = useState<RightsPortalPaymentOverview>()

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
    <PaymentsWrapper pathname={HealthPaths.HealthPaymentOverview}>
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
                content={amountFormat(overview?.credit ?? 0)}
              />
              <UserInfoLine
                label={formatMessage(messages.debit)}
                content={amountFormat(overview?.debt ?? 0)}
              />
            </Stack>
          </Box>

          <Stack space={SECTION_GAP}>
            <Text variant="h5">{formatMessage(messages.invoices)}</Text>
            <GridContainer>
              <GridRow marginBottom={CONTENT_GAP}>
                <GridColumn span={'1/2'}>
                  <DatePicker
                    size="xs"
                    label={formatMessage(m.dateFrom)}
                    placeholderText={formatMessage(m.chooseDate)}
                    handleChange={(date) => setStartDate(date)}
                    backgroundColor="blue"
                    selected={startDate}
                  />
                </GridColumn>
                <GridColumn span={'1/2'}>
                  <DatePicker
                    size="xs"
                    label={formatMessage(m.dateTo)}
                    placeholderText={formatMessage(m.chooseDate)}
                    handleChange={(date) => setEndDate(date)}
                    backgroundColor="blue"
                    selected={endDate}
                  />
                </GridColumn>
              </GridRow>
              {!!options?.length && (
                <GridRow alignItems="flexEnd">
                  <GridColumn span={'5/8'}>
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
                  <GridColumn span={'3/8'}>
                    <Button fluid size="medium" onClick={() => onFetchBills()}>
                      {formatMessage(m.get)}
                    </Button>
                  </GridColumn>
                </GridRow>
              )}
            </GridContainer>
            <Box>
              {overviewError ? (
                <AlertMessage
                  type="error"
                  title={formatMessage(m.errorTitle)}
                  message={formatMessage(messages.errorFetchPaymentInfo)}
                />
              ) : overviewLoading ? (
                <SkeletonLoader space={2} repeat={3} height={24} />
              ) : overview?.bills?.length ? (
                <>
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
                            <T.Data>
                              {amountFormat(item.totalAmount ?? 0)}
                            </T.Data>
                            <T.Data>
                              {amountFormat(item.insuranceAmount ?? 0)}
                            </T.Data>
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
                        onClick: () =>
                          exportPaymentOverviewFile(
                            overview?.bills ?? [],
                            'xlsx',
                          ),
                      },
                    ]}
                  />
                </>
              ) : (
                <Problem type="no_data" noBorder />
              )}
            </Box>
          </Stack>
        </Box>
      )}
    </PaymentsWrapper>
  )
}

export default PaymentOverview
