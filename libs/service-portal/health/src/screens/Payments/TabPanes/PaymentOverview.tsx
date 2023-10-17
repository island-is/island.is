import {
  AlertMessage,
  Box,
  DatePicker,
  SkeletonLoader,
  Stack,
  Text,
  Table as T,
  Button,
} from '@island.is/island-ui/core'
import { UserInfoLine, m } from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { CONTENT_GAP, SECTION_GAP } from '../../Medicine/constants'
import * as styles from './Payments.css'

export const PaymentOverview = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { formatMessage, formatDateFns } = useLocale()

  const status = data?.items[0]

  return (
    <Box paddingY={4} background="white">
      {error ? (
        <AlertMessage
          type="error"
          title="Villa kom upp"
          message="Ekki tókst að sækja greiðsluupplýsingar"
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
                  amount: status?.credit ?? 0,
                })}
              />
              <UserInfoLine
                label={formatMessage(messages.debit)}
                content={formatMessage(messages.medicinePaymentPaidAmount, {
                  amount: status?.debit ?? 0,
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
              justifyContent="flexStart"
              columnGap={2}
            >
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
            <Box marginBottom={SECTION_GAP}>
              {billsError ? (
                <AlertMessage
                  type="error"
                  title="Villa kom upp"
                  message="Ekki tókst að sækja greiðsluupplýsingar"
                />
              ) : billsLoading ? (
                <SkeletonLoader space={2} repeat={3} height={24} />
              ) : (
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
                    {bills?.items.map((item, index) => (
                      <tr key={index} className={styles.tableRowStyle}>
                        <T.Data>
                          {formatDateFns(item.date, 'dd.MM.yyyy')}
                        </T.Data>
                        <T.Data>{item.serviceType}</T.Data>
                        <T.Data>{item.totalAmount}</T.Data>
                        <T.Data>{item.insuranceAmount}</T.Data>
                        <T.Data>
                          <Button
                            iconType="outline"
                            onClick={
                              item.documentId === 44
                                ? () => console.log('download doc')
                                : undefined
                            }
                            variant="text"
                            icon="open"
                            size="small"
                          >
                            Sækja skjal
                          </Button>
                        </T.Data>
                      </tr>
                    ))}
                  </T.Body>
                </T.Table>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default PaymentOverview
