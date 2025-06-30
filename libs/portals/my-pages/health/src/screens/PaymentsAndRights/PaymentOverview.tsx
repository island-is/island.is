import { RightsPortalPaymentOverview } from '@island.is/api/schema'
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
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useLocale } from '@island.is/localization'
import {
  DownloadFileButtons,
  StackWithBottomDivider,
  UserInfoLine,
  amountFormat,
  formSubmit,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import sub from 'date-fns/sub'
import { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { CONTENT_GAP, SECTION_GAP } from '../../utils/constants'
import { exportPaymentOverviewFile } from '../../utils/FileBreakdown'
import * as styles from './Payments.css'
import {
  useGetPaymentOverviewLazyQuery,
  useGetPaymentOverviewServiceTypesQuery,
} from './Payments.generated'
import { PaymentsWrapper } from './wrapper/PaymentsWrapper'

export const PaymentOverview = () => {
  const { formatMessage, formatDateFns, lang } = useLocale()

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

  const [enabledDocumentFlag, setEnabledDocumentFlag] = useState<boolean>(false)
  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.healthPaymentOverview,
        false,
      )
      if (ffEnabled) {
        setEnabledDocumentFlag(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFetchBills = () => {
    lazyOverviewQuery({
      variables: {
        input: {
          dateFrom: startDate,
          dateTo: endDate,
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
        <Problem noBorder={false} error={error} />
      ) : loading ? (
        <SkeletonLoader space={2} repeat={3} height={24} />
      ) : (
        <Box>
          <Box
            marginBottom={SECTION_GAP}
            borderBottomWidth="standard"
            borderColor="blueberry200"
          >
            <StackWithBottomDivider space={2}>
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
            </StackWithBottomDivider>
          </Box>

          <Stack space={[CONTENT_GAP, SECTION_GAP]}>
            <Text variant="h5">{formatMessage(messages.invoices)}</Text>
            <GridContainer>
              <GridRow
                marginBottom={CONTENT_GAP}
                direction={['column', 'column', 'column', 'row']}
              >
                <GridColumn
                  span={['6/8', '6/8', '6/8', '4/8']}
                  paddingBottom={[CONTENT_GAP, CONTENT_GAP, CONTENT_GAP, 0]}
                >
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
                <GridColumn span={['6/8', '6/8', '6/8', '4/8']}>
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
              </GridRow>
              {!!options?.length && (
                <GridRow direction="row" alignItems={['flexStart', 'flexEnd']}>
                  <GridColumn
                    span={['7/8', '7/8', '5/8']}
                    paddingBottom={[CONTENT_GAP, CONTENT_GAP, 0]}
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
                  <GridColumn span={['4/8', '4/8', '3/8']}>
                    <Button fluid size="medium" onClick={() => onFetchBills()}>
                      {formatMessage(m.get)}
                    </Button>
                  </GridColumn>
                </GridRow>
              )}
            </GridContainer>
            <Box>
              {overviewError ? (
                <Problem error={error} noBorder={false} />
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
                        {enabledDocumentFlag ? (
                          <T.HeadData>
                            {formatMessage(messages.paymentDocument)}
                          </T.HeadData>
                        ) : undefined}
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
                            {enabledDocumentFlag ? (
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
                            ) : undefined}
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
              )}
            </Box>
          </Stack>
        </Box>
      )}
    </PaymentsWrapper>
  )
}

export default PaymentOverview
