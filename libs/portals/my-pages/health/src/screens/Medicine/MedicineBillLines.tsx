import { RightsPortalDrugBill } from '@island.is/api/schema'
import {
  Box,
  Hyphen,
  LoadingDots,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  amountFormat,
  DownloadFileButtons,
  m,
  NestedLines,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { messages } from '../../lib/messages'
import { CONTENT_GAP, DATE_FORMAT, SECTION_GAP } from '../../utils/constants'
import { exportMedicineFile } from '../../utils/FileBreakdown'
import * as styles from './Medicine.css'
import { useGetDrugBillLineItemQuery } from './Medicine.generated'

interface Props {
  bill: RightsPortalDrugBill
  paymentPeriodId: string
}

const MedicineBillLines = ({ bill, paymentPeriodId }: Props) => {
  const { formatMessage, formatDateFns } = useLocale()
  const { isMobile } = useIsMobile()

  // Mounted when the row is expanded, so the lines are only fetched on demand
  const { data, loading, error } = useGetDrugBillLineItemQuery({
    variables: { input: { billId: bill.id ?? '', paymentPeriodId } },
    skip: !bill.id || !paymentPeriodId,
  })
  const lineItems = data?.rightsPortalDrugBillLines ?? []

  if (loading) {
    return (
      <Box padding={CONTENT_GAP} background="blue100">
        <LoadingDots />
      </Box>
    )
  }

  if (error) {
    return <Problem error={error} size="small" />
  }

  const excelButton = (
    <DownloadFileButtons
      BoxProps={{
        paddingX: isMobile ? 0 : 2,
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
                amountFormat(bill.totalCopaymentAmount ?? 0),
                amountFormat(bill.totalCustomerAmount ?? 0),
              ],
              lineItems,
              {
                part: amountFormat(bill.totalCopaymentAmount ?? 0),
                excess: amountFormat(bill.totalExcessAmount ?? 0),
                customer: amountFormat(bill.totalCustomerAmount ?? 0),
              },
              'xlsx',
            ),
        },
      ]}
    />
  )

  if (isMobile && !lineItems.length) {
    return (
      <Box paddingTop={2} paddingBottom={2}>
        <Text variant="h5" marginBottom={1}>
          {formatMessage(messages.medicineDrugLines)}
        </Text>
        <Text>{formatMessage(m.noDataFound)}</Text>
        {excelButton}
      </Box>
    )
  }

  if (isMobile) {
    return (
      <Box paddingTop={2}>
        <Text variant="h5" marginBottom={1}>
          {formatMessage(messages.medicineDrugLines)}
        </Text>
        {lineItems.map((lineItem, lineIndex) => {
          return (
            <NestedLines
              key={`${bill.id}-${lineIndex}`}
              data={[
                {
                  title: formatMessage(messages.medicineDrugName),
                  value: lineItem.drugName ?? '',
                },
                {
                  title: formatMessage(messages.medicineStrength),
                  value: lineItem.strength ?? '',
                },
                {
                  title: formatMessage(messages.medicineQuantity),
                  value: lineItem.quantity ?? '',
                },
                {
                  title: formatMessage(messages.medicineAmount),
                  value: lineItem.units ?? '',
                },
                {
                  title: formatMessage(messages.medicineSalePrice),
                  value: amountFormat(lineItem.salesPrice ?? 0),
                },
                {
                  title: formatMessage(
                    messages.medicinePaymentParticipationPrice,
                  ),
                  value: amountFormat(lineItem.copaymentAmount ?? 0),
                },
                {
                  title: formatMessage(messages.medicineExcessPrice),
                  value: amountFormat(lineItem.excessAmount ?? 0),
                },
                {
                  title: formatMessage(messages.medicinePaidByCustomer),
                  value: amountFormat(lineItem.customerAmount ?? 0),
                },
              ]}
            />
          )
        })}
        {excelButton}
      </Box>
    )
  }

  return (
    <Box padding={CONTENT_GAP} paddingBottom={SECTION_GAP} background="blue100">
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
                {formatMessage(messages.medicineSalePrice)}
              </span>
            </T.HeadData>
            <T.HeadData text={{ lineHeight: 'xs' }}>
              <span className={styles.subTableHeaderText}>
                <Hyphen>
                  {formatMessage(messages.medicinePaymentParticipationPrice)}
                </Hyphen>
              </span>
            </T.HeadData>
            <T.HeadData text={{ lineHeight: 'xs' }}>
              <span className={styles.subTableHeaderText}>
                <Hyphen>{formatMessage(messages.medicineExcessPrice)}</Hyphen>
              </span>
            </T.HeadData>
            <T.HeadData text={{ lineHeight: 'xs' }}>
              <span className={styles.subTableHeaderText}>
                {formatMessage(messages.medicinePaidByCustomer)}
              </span>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {lineItems.map((lineItem, k) => {
            return (
              <T.Row key={k}>
                <T.Data>{lineItem.drugName}</T.Data>
                <T.Data>{lineItem.strength}</T.Data>
                <T.Data>{lineItem.quantity}</T.Data>
                <T.Data>{lineItem.units}</T.Data>
                <T.Data>{amountFormat(lineItem.salesPrice ?? 0)}</T.Data>
                <T.Data>{amountFormat(lineItem.copaymentAmount ?? 0)}</T.Data>
                <T.Data>{amountFormat(lineItem.excessAmount ?? 0)}</T.Data>
                <T.Data>{amountFormat(lineItem.customerAmount ?? 0)}</T.Data>
              </T.Row>
            )
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
                {amountFormat(bill.totalCopaymentAmount ?? 0)}
              </span>
            </T.Data>
            <T.Data>
              <span className={styles.subTableHeaderText}>
                {amountFormat(bill.totalExcessAmount ?? 0)}
              </span>
            </T.Data>
            <T.Data>
              <span className={styles.subTableHeaderText}>
                {amountFormat(bill.totalCustomerAmount ?? 0)}
              </span>
            </T.Data>
          </T.Row>
        </T.Foot>
      </T.Table>

      {excelButton}
    </Box>
  )
}

export default MedicineBillLines
