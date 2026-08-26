import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/shared/utils'

import { EmptyTable } from '../components/EmptyTable/EmptyTable'
import { m } from '../messages'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUP } from './Overview.graphql'
import * as styles from './Overview.css'

interface Props {
  supplierLegalId: string
  erpLegalEntityId: number
  total: number
  dateFrom?: Date
  dateTo?: Date
}

export const NestedLines = ({
  supplierLegalId,
  erpLegalEntityId,
  dateFrom,
  dateTo,
  total,
}: Props) => {
  const { formatDate, formatMessage } = useIntl()

  const { data, error, loading } = useQuery<Query>(
    GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_GROUP,
    {
      variables: {
        input: {
          supplierLegalId,
          erpLegalEntityId,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      },
    },
  )

  const payments =
    data?.icelandicGovernmentInstitutionsInvoicePaymentsGroup?.payments ?? []

  const renderItemizations = () => {
    if (error) {
      return <EmptyTable message={formatMessage(m.overview.errorLoading)} />
    }

    if (loading || !payments.length) {
      return (
        <EmptyTable
          loading={loading}
          message={formatMessage(m.overview.emptyTable)}
        />
      )
    }

    return payments.map((payment) => (
      <Box paddingBottom={3} paddingLeft={2} paddingRight={2} key={payment.id}>
        <Box marginBottom={2} display="flex">
          <Box marginRight={2}>
            <Text variant="small" fontWeight="semiBold">
              {formatDate(new Date(payment.date), {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Box>
          <Text variant="small">{payment.invoice.number}</Text>
        </Box>
        <T.Table>
          <T.Body>
            {payment.invoice.itemizations?.map((invoiceItem, i) => {
              const background = i % 2 === 0 ? 'white' : undefined
              return (
                <T.Row key={invoiceItem.id}>
                  <T.Data
                    box={{
                      textAlign: 'left',
                      background,
                      className: styles.noBorder,
                    }}
                  >
                    <Text variant="small">{invoiceItem.label}</Text>
                  </T.Data>
                  <T.Data
                    box={{
                      textAlign: 'right',
                      background,
                      className: styles.noBorder,
                    }}
                  >
                    <Text variant="small">
                      {formatCurrency(invoiceItem.amount)}
                    </Text>
                  </T.Data>
                </T.Row>
              )
            })}
            <T.Row>
              <T.Data
                box={{
                  background:
                    (payment.invoice.itemizations?.length ?? 0) % 2 === 0
                      ? 'white'
                      : undefined,
                  className: styles.noBorder,
                }}
              >
                <Text fontWeight="semiBold" variant="small">
                  {formatMessage(m.totals.invoiceAmount)}
                </Text>
              </T.Data>
              <T.Data
                box={{
                  textAlign: 'right',
                  background:
                    (payment.invoice.itemizations?.length ?? 0) % 2 === 0
                      ? 'white'
                      : undefined,
                  className: styles.noBorder,
                }}
              >
                <Text fontWeight="semiBold" variant="small">
                  {formatCurrency(payment.invoice.totalAmount)}
                </Text>
              </T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    ))
  }

  return (
    <Box background="blue100" paddingTop={3}>
      {renderItemizations()}
      <Box paddingY={3} paddingLeft={2} background="blue100">
        <Box
          marginRight={2}
          marginBottom={2}
          display="flex"
          justifyContent="spaceBetween"
        >
          <Text variant="small" fontWeight="semiBold">
            {`${formatMessage(m.totals.total)}: `}
          </Text>
          <Text variant="small" fontWeight="semiBold">
            {formatCurrency(total)}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
