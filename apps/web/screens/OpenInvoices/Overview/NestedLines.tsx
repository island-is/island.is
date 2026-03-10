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
  supplierId: string
  customerId: string
  total: number
  dateFrom?: Date
  dateTo?: Date
}

export const NestedLines = ({
  supplierId,
  customerId,
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
          supplier: +supplierId,
          customer: +customerId,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
      },
    },
  )

  if (error) {
    return <p>oh no error</p>
  }

  const invoices =
    data?.icelandicGovernmentInstitutionsInvoiceGroup?.invoices ?? []

  if (loading || (!invoices.length && !error)) {
    return (
      <T.Row>
        <T.Data box={{ background: 'blue100' }} colSpan={4}>
          <EmptyTable
            loading={loading}
            message={formatMessage(m.overview.emptyTable)}
          />
        </T.Data>
      </T.Row>
    )
  }

  return (
    <T.Row>
      <T.Data box={{ background: 'blue100' }} colSpan={4}>
        {invoices.map((invoice) => (
          <Box
            paddingBottom={3}
            paddingLeft={2}
            key={invoice.id}
            background="blue100"
          >
            <Box marginBottom={2} display="flex">
              <Box marginRight={2}>
                <Text variant="small" fontWeight="semiBold">
                  {formatDate(new Date(invoice.date), {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </Box>
              <Text variant="small">{invoice.id}</Text>
            </Box>
            <T.Table>
              <T.Body>
                {invoice.itemizations?.map((invoiceItem, i) => {
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
                        (invoice.itemizations?.length ?? 0) % 2 === 0
                          ? 'white'
                          : undefined,
                      className: styles.noBorder,
                    }}
                  />
                  <T.Data
                    box={{
                      textAlign: 'right',
                      background:
                        (invoice.itemizations?.length ?? 0) % 2 === 0
                          ? 'white'
                          : undefined,
                      className: styles.noBorder,
                    }}
                  >
                    <Text fontWeight="semiBold" variant="small">
                      {formatCurrency(invoice.totalItemizationAmount)}
                    </Text>
                  </T.Data>
                </T.Row>
              </T.Body>
            </T.Table>
          </Box>
        ))}
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
      </T.Data>
    </T.Row>
  )
}
