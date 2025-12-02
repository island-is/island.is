import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'

import { IcelandicGovernmentInstitutionsInvoiceGroup } from '@island.is/api/schema'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Problem } from '@island.is/react-spa/shared'
import { formatCurrency } from '@island.is/shared/utils'
import { SortableTable } from '@island.is/web/components'

import { m } from '../messages'
import * as styles from './Overview.css'

interface Props {
  invoiceGroups: IcelandicGovernmentInstitutionsInvoiceGroup[]
  error?: boolean
}

export const OverviewContent = ({ invoiceGroups, error }: Props) => {
  const { formatMessage, formatDate } = useIntl()

  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  const noData = (invoiceGroups?.length ?? 0) < 1

  return (
    <>
      {error && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          background="white"
          borderWidth="standard"
          borderRadius="lg"
          borderColor="blue200"
        >
          <Problem />
        </Box>
      )}
      {!error && noData && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          background="white"
          borderWidth="standard"
          borderRadius="lg"
          borderColor="blue200"
          flexDirection={['columnReverse', 'columnReverse', 'row']}
          columnGap={[2, 4, 8, 8, 20]}
          paddingY={[5, 8]}
          paddingX={[3, 3, 5, 10]}
          rowGap={[7, 7, 0]}
        >
          <Box display="flex" flexDirection="column" rowGap={1}>
            <Text variant={'h3'} as={'h3'} color="dark400">
              {formatMessage(m.search.noResultsFound)}
            </Text>
          </Box>
          {!isMobile && (
            <img
              width="240"
              src="/assets/sofa.svg"
              alt={formatMessage(m.search.noResultsFound)}
            />
          )}
        </Box>
      )}
      {!error && !noData && (
        <SortableTable
          labels={{
            supplier: formatMessage(m.overview.supplier),
            customer: formatMessage(m.overview.customer),
            amount: formatMessage(m.overview.amount),
          }}
          expandable
          align="left"
          defaultSortByKey="amount"
          items={invoiceGroups.map((group) => ({
            id: group.id,
            Seljandi: group.supplier.name,
            Kaupandi: group.customer.name,
            Upphæð: formatCurrency(group.totalAmount),
            children:
              group.invoices.length > 0 ? (
                <Box>
                  {group.invoices.map((invoice) => (
                    <Box
                      paddingY={2}
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
                              day: 'numeric'
                            })}
                          </Text>
                        </Box>
                        <Text variant="small">{invoice.id}</Text>
                      </Box>
                      <T.Table>
                        <T.Body>
                          {invoice.itemization?.map((invoiceItem, i) => {
                            const background = i % 2 === 0 ? 'white' : undefined
                            const isLastRow =
                              i === invoice.itemization.length - 1
                            return (
                              <>
                                <T.Row key={invoiceItem.id}>
                                  <T.Data
                                    box={{
                                      textAlign: 'left',
                                      background,
                                      className: styles.noBorder,
                                    }}
                                  >
                                    <Text variant="small">
                                      {invoiceItem.label}
                                    </Text>
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
                                {isLastRow && (
                                  <T.Row>
                                    <T.Data
                                      box={{
                                        background:
                                          background === 'white'
                                            ? undefined
                                            : 'white',
                                        className: styles.noBorder,
                                      }}
                                    />
                                    <T.Data
                                      box={{
                                        textAlign: 'right',
                                        background:
                                          background === 'white'
                                            ? undefined
                                            : 'white',
                                        className: styles.noBorder,
                                      }}
                                    >
                                      <Text
                                        fontWeight="semiBold"
                                        variant="small"
                                      >
                                        {formatCurrency(invoiceItem.amount)}
                                      </Text>
                                    </T.Data>
                                  </T.Row>
                                )}
                              </>
                            )
                          })}
                        </T.Body>
                      </T.Table>
                    </Box>
                  ))}
                </Box>
              ) : undefined,
          }))}
        />
      )}
    </>
  )
}
