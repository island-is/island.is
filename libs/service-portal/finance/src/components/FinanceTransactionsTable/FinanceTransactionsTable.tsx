import React, { FC, useState } from 'react'
import format from 'date-fns/format'
import { Table as T, Box, Pagination } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import amountFormat from '../../utils/amountFormat'
import { ExpandRow, ExpandHeader } from '../../components/ExpandableTable'
import { CustomerRecordsDetails } from '../../screens/FinanceTransactions/FinanceTransactionsData.types'
import FinanceTransactionsDetail from '../FinanceTransactionsDetail/FinanceTransactionsDetail'

const ITEMS_ON_PAGE = 20

interface Props {
  recordsArray: Array<CustomerRecordsDetails>
}

const FinanceTransactionsTable: FC<Props> = ({ recordsArray }) => {
  const [page, setPage] = useState(1)

  const totalPages =
    recordsArray.length > ITEMS_ON_PAGE
      ? Math.ceil(recordsArray.length / ITEMS_ON_PAGE)
      : 0
  return (
    <>
      <T.Table>
        <ExpandHeader
          data={[
            'Dagsetning',
            'Gildisdagur',
            'Umsjónarmaður',
            'Gjaldliður',
            'Upphæð',
          ]}
        />
        <T.Body>
          {recordsArray
            .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
            .map((record) => (
              <ExpandRow
                key={`${record.createTime}-${record.referenceToLevy}`}
                data={[
                  format(new Date(record.createDate), dateFormat.is),
                  format(new Date(record.valueDate), dateFormat.is),
                  record.collectingOrganization,
                  record.itemCode,
                  amountFormat(record.amount),
                ]}
              >
                <FinanceTransactionsDetail
                  data={[
                    {
                      title: 'Framkvæmdaraðili',
                      value: record.performingOrganization,
                    },
                    {
                      title: 'Gjaldgrunnur',
                      value: record.chargeItemSubject,
                    },
                    { title: 'Tímabil', value: record.period },
                    { title: 'Gjaldflokkur', value: record.chargeType },
                    {
                      title: 'Hreyfingaflokkur',
                      value: record.category,
                    },
                    {
                      title: 'Hreyfingargerð',
                      value: record.subCategory,
                    },
                    ...(record.actionCategory
                      ? [
                          {
                            title: 'Aðgerðarflokkur',
                            value: record.actionCategory,
                          },
                        ]
                      : []),
                    { title: 'Tilvísun', value: record.reference },
                  ]}
                />
              </ExpandRow>
            ))}
        </T.Body>
      </T.Table>
      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(page)}
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}
    </>
  )
}

export default FinanceTransactionsTable
