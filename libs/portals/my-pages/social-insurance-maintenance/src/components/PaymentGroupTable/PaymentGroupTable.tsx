import {
  ScrollableMiddleTable,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  EmptyTable,
  MONTHS,
  amountFormat,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { useGetPaymentPlanQuery } from '../PaymentGroupTable/PaymentGroupTable.generated'

export const PaymentGroupTable = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useGetPaymentPlanQuery()

  if (error && !loading) {
    return <Problem noBorder={false} size="small" />
  }

  const paymentPlan = data?.socialInsurancePaymentPlan

  if (!error && !paymentPlan) {
    return (
      <EmptyTable
        loading={loading}
        message={formatMessage(m.noPaymentsFound)}
      />
    )
  }

  /*
  return (
    <Box overflow="auto" width="full" ref={tableRef}>
      {!isMobile && (
        <>
          <Box
            position="absolute"
            style={{
              left: `${FIRST_COLUMN_WIDTH - ICON_WIDTH / 2}px`,
              top: '45%',
              zIndex: '20',
              opacity: 0.8,
            }}
          >
            <Button
              circle
              colorScheme="light"
              icon={'arrowBack'}
              iconType="filled"
              onClick={() => handleScroll('backward')}
              size="medium"
              type="button"
              variant="primary"
            />
          </Box>
          <Box
            position="absolute"
            style={{
              right: `${LAST_COLUMN_WIDTH - ICON_WIDTH / 2}px`,
              top: '45%',
              zIndex: '20',
              opacity: 0.8,
            }}
          >
            <Button
              circle
              colorScheme="light"
              icon={'arrowForward'}
              iconType="filled"
              onClick={() => handleScroll('forward')}
              size="medium"
              type="button"
              variant="primary"
            />
          </Box>
        </>
      )}
      <T.Table
        box={{
          className: styles.table,
          overflow: 'initial',
        }}
        style={{
          tableLayout: nested ? 'fixed' : 'auto',
          width: nested ? breakpointWidth : 'initial',
        }}
      >
        <T.Head>
          <T.Row>
            <T.HeadData
              box={{
                className: cn(styles.row, styles.header, styles.expandColumn, {
                  [styles.sticky]: options?.firstColumn.sticky,
                }),
              }}
            />
            <T.HeadData
              box={{
                className: cn(styles.firstColumn, styles.header, styles.row, {
                  [styles.sticky]: options?.firstColumn.sticky,
                }),
              }}
            >
              <Text variant="small" fontWeight="medium">
                {header.first}
              </Text>
            </T.HeadData>
            {header.scrollableMiddle.map((val, index) => (
              <T.HeadData
                box={{
                  className: styles.header,
                }}
                key={`nested-table-header-col-${index}`}
              >
                <Text variant="small" fontWeight="medium">
                  {val}
                </Text>
              </T.HeadData>
            ))}
            <T.HeadData
              style={{
                width: isMobile ? 'initial' : LAST_COLUMN_WIDTH,
              }}
              box={{
                className: cn(styles.lastColumn, styles.header, styles.row, {
                  [styles.lastColumnSticky]: options?.firstColumn.sticky,
                }),
              }}
            >
              <Text textAlign="right" variant="small" fontWeight="medium">
                {header.last}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows?.map((r, rowIdx) => {
            const backgroundColor = rowIdx % 2 === 0 ? 'white' : undefined

            return (
              <ScrollableMiddleTableRow
                key={`nested-table-row-${rowIdx}`}
                backgroundColor={backgroundColor}
                data={[
                  {
                    value: <Text variant="small">{r.first}</Text>,
                    first: true,
                  },
                  ...r.scrollableMiddle.map((b) => ({
                    value: <Text variant="small">{b}</Text>,
                  })),
                  {
                    value: <Text variant="small">{r.last}</Text>,
                    last: true,
                  },
                ]}
                dataToExpand={r.nested.map((n) => {
                  console.log(n)
                  return [
                    {
                      value: <Text variant="small">{'FIRST'}</Text>,
                      first: true,
                    },
                    ...n.scrollableMiddle.map((b) => ({
                      value: <Text variant="small">{b}</Text>,
                    })),
                    {
                      value: <Text variant="small">{'LAST'}</Text>,
                      last: true,
                    },
                  ]
                })}
              />
            )
          })}
          {footer && (
            <T.Row>
              <T.Data
                box={{
                  className: cn(styles.expandColumn, {
                    [styles.sticky]: options?.firstColumn.sticky,
                  }),
                }}
              />
              <T.Data
                box={{
                  className: cn(styles.firstColumn, {
                    [styles.sticky]: options?.firstColumn.sticky,
                  }),
                }}
              >
                <Text variant="small" fontWeight="medium">
                  {footer.first}
                </Text>
              </T.Data>
              {footer.scrollableMiddle.map((val, index) => (
                <T.Data key={`nested-table-footer-col-${index}`}>
                  <Text variant="small" fontWeight="medium">
                    {val}
                  </Text>
                </T.Data>
              ))}
              <T.Data
                box={{
                  className: cn(styles.lastColumn, {
                    [styles.lastColumnSticky]: options?.lastColumn.sticky,
                  }),
                }}
              >
                <Text variant="small" fontWeight="medium">
                  {footer.last}
                </Text>
              </T.Data>
            </T.Row>
          )}
        </T.Body>
      </T.Table>
    </Box>
  )
  */

  return (
    <ScrollableMiddleTable
      options={{
        firstColumn: {
          shadow: true,
          sticky: true,
        },
        lastColumn: {
          shadow: true,
          sticky: true,
        },
      }}
      header={{
        first: formatMessage(m.type),
        scrollableMiddle: MONTHS.map((month) =>
          formatMessage(coreMessages[month as keyof typeof coreMessages]),
        ),
        last: formatMessage(m.year),
      }}
      rows={paymentPlan?.paymentGroups?.map((p) => {
        return {
          first: p.name,
          scrollableMiddle: MONTHS.map((month) => {
            const monthlyAmount = p.monthlyPaymentHistory.find(
              (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
            )?.amount
            return monthlyAmount ? amountFormat(monthlyAmount) : '-'
          }),
          last: `${amountFormat(p.totalYearCumulativeAmount)}`,
          nested: p.payments.map((pp) => ({
            first: pp.name,
            scrollableMiddle: MONTHS.map((month) => {
              const monthlyAmount = pp.monthlyPaymentHistory.find(
                (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
              )?.amount
              return monthlyAmount ? amountFormat(monthlyAmount) : '-'
            }),
            last: `${amountFormat(pp.totalYearCumulativeAmount)}`,
          })),
        }
      })}
      footer={{
        first: formatMessage(m.totalPaymentsReceived),
        scrollableMiddle: MONTHS.map((month) => {
          const monthlyAmount = paymentPlan?.totalMonthlyPaymentHistory?.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month),
          )?.amount

          return monthlyAmount ? amountFormat(monthlyAmount) : '-'
        }),
        last: paymentPlan?.totalPaymentsReceived
          ? amountFormat(paymentPlan?.totalPaymentsReceived)
          : '-',
      }}
    />
  )
}
